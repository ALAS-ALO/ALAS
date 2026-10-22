// Receives the contact form and creates a lead in the Notion CRM ("Clientes").
// Needs the secret NOTION_TOKEN (the "Web ALAS" integration), set in Cloudflare → Worker → Settings → Variables and Secrets.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const DATABASE_ID = '5c5f60d2-60da-4894-932f-89a674a72edb';
const RAMAS = ['Studio', 'Space', 'Ambas'];
const TIPOS = ['Particular', 'Empresa', 'Estudio de arquitectura', 'Profesional Autónomo'];
const IDIOMAS: Record<string, string> = { es: 'español', en: 'inglés', gl: 'gallego' };

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const text = (s: string) => {
  const parts = [];
  for (let i = 0; i < s.length; i += 2000) parts.push({ type: 'text', text: { content: s.slice(i, i + 2000) } });
  return parts;
};

export const POST: APIRoute = async ({ request }) => {
  let d: Record<string, unknown>;
  try { d = await request.json(); } catch { return json(400, { ok: false, error: 'bad-json' }); }

  // honeypot: bots fill the hidden "web" field; pretend it worked
  if (str(d.web, 200)) return json(200, { ok: true });

  const email = str(d.Email, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { ok: false, error: 'email' });
  const nombre = str(d.Nombre, 200) || email;
  const telefono = str(d['Teléfono'], 40);
  const rama = RAMAS.includes(String(d.Rama)) ? String(d.Rama) : 'Ambas';
  const tipo = TIPOS.includes(String(d.Tipo)) ? String(d.Tipo) : 'Particular';
  const mensaje = str(d.Notas, 5000);
  const idioma = IDIOMAS[str(d.idioma, 5)] ?? 'español';

  const token = (env as Record<string, string | undefined>).NOTION_TOKEN;
  if (!token) return json(500, { ok: false, error: 'config' });

  const properties: Record<string, unknown> = {
    Nombre: { title: text(nombre) },
    Email: { email },
    Rama: { select: { name: rama } },
    Tipo: { select: { name: tipo } },
    'Fuente del lead': { select: { name: 'Web' } },
    'Estado pipeline': { select: { name: 'Lead' } },
    Notas: { rich_text: text(mensaje.slice(0, 1990)) },
  };
  if (telefono) properties['Teléfono'] = { phone_number: telefono };

  const children = [
    { object: 'block', type: 'paragraph', paragraph: { rich_text: text(`Formulario web (${idioma}) · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`) } },
    ...(mensaje ? [{ object: 'block', type: 'quote', quote: { rich_text: text(mensaje) } }] : []),
  ];

  let r: Response;
  try {
    r = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ parent: { database_id: DATABASE_ID }, properties, children }),
    });
  } catch (e) {
    console.error('Notion unreachable', e);
    return json(502, { ok: false, error: 'notion' });
  }
  if (!r.ok) {
    console.error('Notion error', r.status, await r.text());
    return json(502, { ok: false, error: 'notion' });
  }
  return json(200, { ok: true });
};
