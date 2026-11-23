// Receives the contact form, creates a lead in the Notion CRM ("Clientes") and e-mails a notice to soporte@.
// Needs the secret NOTION_TOKEN (the "Web ALAS" integration), set in Cloudflare → Worker → Settings → Variables and Secrets,
// and the send_email binding AVISO (wrangler.jsonc). If one of the two fails, the other is enough to keep the lead.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { EmailMessage } from 'cloudflare:email';

export const prerender = false;

const DATABASE_ID = '5c5f60d2-60da-4894-932f-89a674a72edb';
const RAMAS = ['Studio', 'Space', 'Ambas'];
const TIPOS = ['Particular', 'Empresa', 'Estudio de arquitectura', 'Profesional Autónomo'];
const IDIOMAS: Record<string, string> = { es: 'español', en: 'inglés', gl: 'gallego' };
const AVISO_FROM = 'web@alaslab.com';
const AVISO_TO = 'alaslab.soporte@gmail.com';

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const text = (s: string) => {
  const parts = [];
  for (let i = 0; i < s.length; i += 2000) parts.push({ type: 'text', text: { content: s.slice(i, i + 2000) } });
  return parts;
};
// UTF-8 → base64 (MIME bodies and encoded headers)
const b64 = (s: string) => {
  let bin = '';
  for (const b of new TextEncoder().encode(s)) bin += String.fromCharCode(b);
  return btoa(bin);
};
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ');

// Plain-text notice; "Responder" in Gmail goes straight to the person who wrote.
async function aviso(lead: { nombre: string; email: string; telefono: string; rama: string; tipo: string; mensaje: string; idioma: string; fecha: string }) {
  const binding = (env as Record<string, any>).AVISO;
  if (!binding) return false;
  const asunto = `Nuevo contacto web: ${oneLine(lead.nombre).slice(0, 60)}${lead.rama ? ` · ${lead.rama}` : ''}`;
  const cuerpo = [
    `Nombre: ${lead.nombre}`,
    `Correo: ${lead.email}`,
    lead.telefono ? `Teléfono: ${lead.telefono}` : null,
    `Rama: ${lead.rama || '—'}`,
    `Tipo: ${lead.tipo || '—'}`,
    `Idioma: ${lead.idioma}`,
    `Fecha: ${lead.fecha} UTC`,
    '',
    'Mensaje:',
    lead.mensaje || '—',
    '',
    '—',
    'Enviado desde el formulario de alaslab.com. Responde a este correo para contestar directamente.',
  ].filter((l) => l !== null).join('\r\n');
  const raw = [
    `From: "Web ALAS" <${AVISO_FROM}>`,
    `To: <${AVISO_TO}>`,
    `Reply-To: <${lead.email}>`,
    `Subject: =?UTF-8?B?${b64(asunto)}?=`,
    `Date: ${new Date().toUTCString().replace('GMT', '+0000')}`,
    `Message-ID: <${crypto.randomUUID()}@alaslab.com>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(cuerpo).replace(/.{76}/g, '$&\r\n'),
  ].join('\r\n');
  try {
    await binding.send(new EmailMessage(AVISO_FROM, AVISO_TO, raw));
    return true;
  } catch (e) {
    console.error('Aviso por correo fallido', e);
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  let d: Record<string, unknown>;
  try { d = await request.json(); } catch { return json(400, { ok: false, error: 'bad-json' }); }

  // honeypot: bots fill the hidden "web" field; pretend it worked
  if (str(d.web, 200)) return json(200, { ok: true });

  const email = str(d.Email, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { ok: false, error: 'email' });
  const nombre = str(d.Nombre, 200) || email;
  const telefono = str(d['Teléfono'], 40);
  // branch and client type are optional: a value outside the CRM's options is left out instead of failing
  const rama = RAMAS.includes(String(d.Rama)) ? String(d.Rama) : '';
  const tipo = TIPOS.includes(String(d.Tipo)) ? String(d.Tipo) : '';
  const mensaje = str(d.Notas, 5000);
  const idioma = IDIOMAS[str(d.idioma, 5)] ?? 'español';

  const fecha = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const token = (env as Record<string, string | undefined>).NOTION_TOKEN;

  const properties: Record<string, unknown> = {
    Nombre: { title: text(nombre) },
    Email: { email },
    'Fuente del lead': { select: { name: 'Web' } },
    'Estado pipeline': { select: { name: 'Lead' } },
    Notas: { rich_text: text(mensaje.slice(0, 1990)) },
  };
  if (telefono) properties['Teléfono'] = { phone_number: telefono };
  if (rama) properties.Rama = { select: { name: rama } };
  if (tipo) properties.Tipo = { select: { name: tipo } };

  const children = [
    { object: 'block', type: 'paragraph', paragraph: { rich_text: text(`Formulario web (${idioma}) · ${fecha} UTC`) } },
    ...(mensaje ? [{ object: 'block', type: 'quote', quote: { rich_text: text(mensaje) } }] : []),
  ];

  const notion = async () => {
    if (!token) { console.error('NOTION_TOKEN missing'); return false; }
    try {
      const r = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent: { database_id: DATABASE_ID }, properties, children }),
      });
      if (!r.ok) { console.error('Notion error', r.status, await r.text()); return false; }
      return true;
    } catch (e) {
      console.error('Notion unreachable', e);
      return false;
    }
  };

  const [enNotion, enCorreo] = await Promise.all([
    notion(),
    aviso({ nombre, email, telefono, rama, tipo, mensaje, idioma, fecha }),
  ]);
  if (!enNotion && !enCorreo) return json(502, { ok: false, error: 'notion' });
  return json(200, { ok: true, notion: enNotion, aviso: enCorreo });
};
