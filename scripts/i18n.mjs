// Builds the translated home markup and script for each language.
// Source of truth: src/content/home.html + src/scripts/main.js (Spanish).
// Dictionaries: src/i18n/<lang>.json, keyed by the exact Spanish text.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const html = read('src/content/home.html');
const js = read('src/scripts/main.js');
const LANGS = { es: '/', en: '/en/', gl: '/gl/' };
const SITE = JSON.parse(read('src/i18n/site.json'));
const ROUTES = JSON.parse(read('src/i18n/routes.json'));
// {{KEY}} tokens: the owner's details (site.json) and the per-language routes (routes.json)
const HAS_MAIL = /@/.test(SITE.CORREO || '');
const VIA = { es: 'a través del formulario de esta web', en: 'through the form on this website', gl: 'a través do formulario desta web' };
const RETRY = { es: 'Vuelve a intentarlo en unos minutos.', en: 'Please try again in a few minutes.', gl: 'Volve tentalo nuns minutos.' };
const WRITE = { es: 'Escríbenos directamente a', en: 'Please write to us directly at', gl: 'Escríbenos directamente a' };
const TOKENS = (lang) => ({
  ...SITE,
  CONTACTO: HAS_MAIL ? (lang === 'en' ? 'to ' : 'a ') + SITE.CORREO : VIA[lang],
  FALLO: HAS_MAIL ? `${WRITE[lang]} ${SITE.CORREO}.` : RETRY[lang],
});
const fill = (src, lang) => {
  const T = TOKENS(lang);
  // without an address yet, the visible e-mail links are left out
  if (!HAS_MAIL) src = src.replace(/\s*<p class="contact-mail">[\s\S]*?<\/p>/, '').replace(/\s*<a class="proto foot-mail"[^>]*>[^<]*<\/a>/, '');
  return src.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in ROUTES[lang] ? ROUTES[lang][k] : k in T ? T[k] : m));
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function translateHtml(src, dict) {
  let out = src;
  for (const [es, tr] of Object.entries(dict)) {
    // text nodes (keep surrounding whitespace) and translatable attributes
    out = out.replace(new RegExp('>(\\s*)' + esc(es) + '(\\s*)<', 'g'), (_, a, b) => '>' + a + tr + b + '<');
    out = out.replace(new RegExp('(aria-label|placeholder|title|alt)="' + esc(attr(es)) + '"', 'g'), (_, n) => n + '="' + attr(tr) + '"');
  }
  return out;
}

function translateJs(src, dict) {
  let out = src;
  for (const [es, tr] of Object.entries(dict)) {
    const lit = tr.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    out = out.replace(new RegExp("'" + esc(es) + "'", 'g'), () => "'" + lit + "'");
    out = out.replace(new RegExp('>' + esc(es) + '<', 'g'), () => '>' + lit + '<');
    out = out.replace(new RegExp('aria-label="' + esc(es) + '"', 'g'), () => 'aria-label="' + attr(lit) + '"');
  }
  return out;
}

mkdirSync(new URL('src/generated/', root), { recursive: true });
for (const [lang, href] of Object.entries(LANGS)) {
  const dict = lang === 'es' ? {} : JSON.parse(read(`src/i18n/${lang}.json`));
  // longest keys first so a short key never eats part of a longer one
  const sorted = Object.fromEntries(Object.entries(dict).sort((a, b) => b[0].length - a[0].length));
  let page = translateHtml(html, sorted)
    .replace(`hreflang="${lang}" lang="${lang}"`, `hreflang="${lang}" lang="${lang}" aria-current="page"`);
  writeFileSync(new URL(`src/generated/home.${lang}.html`, root), fill(page, lang));
  writeFileSync(new URL(`src/generated/main.${lang}.js`, root), fill(translateJs(js, sorted), lang));
  void href;
}
console.log('i18n: generated es, en, gl');
