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

// Section pages (/studio/, /space/, /contacto/): the same header, sections and footer as the home page,
// cut from the translated home so they never drift apart. Links that pointed inside the home now point to pages.
const PAGES = {
  studio: { sections: ['studio', 'trayectoria'] },
  space: { sections: ['space', 'trayectoria'] },
  contact: { sections: ['contacto', 'faq'] },
};
// the whole element that starts at `start`, counting nested tags of the same name
function element(src, start, tag) {
  const re = new RegExp('<' + tag + '\\b|</' + tag + '>', 'g');
  re.lastIndex = start; let depth = 0, m;
  while ((m = re.exec(src))) { depth += m[0][1] === '/' ? -1 : 1; if (!depth) return src.slice(start, re.lastIndex); }
  throw new Error('unclosed <' + tag + '>');
}
function byId(src, id) {
  const at = src.search(new RegExp('<section\\b[^>]*\\bid="' + id + '"'));
  if (at < 0) throw new Error('missing section #' + id);
  return element(src, at, 'section');
}
function sectionPage(full, lang, key, def) {
  const R = ROUTES[lang];
  const NAV = { inicio: R.home, alas: R.home + '#alas', studio: R.studio, proyectos: R.studio + '#proyectos', space: R.space, herramientas: R.space + '#herramientas', contacto: R.contact };
  let header = element(full, full.indexOf('<header'), 'header')
    .replace(/href="#(\w+)"/g, (m, id) => (id in NAV ? `href="${NAV[id]}"` : m))
    .replace(/<a href="([^"]*)" hreflang="(\w+)"/g, (m, h, l) => (ROUTES[l] ? `<a href="${ROUTES[l][key]}" hreflang="${l}"` : m))
    .replace(`<a href="${R[key]}">`, `<a href="${R[key]}" aria-current="page">`);
  let body = def.sections.map((id) => byId(full, id)).join('\n')
    // calls to action go to the contact page with their branch preselected
    .replace(/href="#contacto" data-rama="(\w+)"/g, (m, r) => `href="${R.contact}?rama=${r}" data-rama="${r}"`)
    .replace(/href="#(\w+)"/g, (m, id) => (id in NAV ? `href="${NAV[id]}"` : m));
  // the page's own heading is its first big title
  body = body.replace(/<h2 class="display-l">([\s\S]*?)<\/h2>/, '<h1 class="display-l">$1</h1>');
  const footer = element(full, full.indexOf('<footer'), 'footer')
    .replace(`<a href="${R[key]}">`, `<a href="${R[key]}" aria-current="page">`);
  // on the Studio page the closing band and the footer stay in Studio's light colours
  if (key === 'studio') return header + '\n<main>\n' + body.replace('id="trayectoria" data-branch="space"', 'id="trayectoria" data-branch="studio"') + '\n</main>\n' + footer.replace('data-branch="space"', 'data-branch="studio"') + '\n';
  return header + '\n<main>\n' + body + '\n</main>\n' + footer + '\n';
}

mkdirSync(new URL('src/generated/', root), { recursive: true });
for (const [lang, href] of Object.entries(LANGS)) {
  const dict = lang === 'es' ? {} : JSON.parse(read(`src/i18n/${lang}.json`));
  // longest keys first so a short key never eats part of a longer one
  const sorted = Object.fromEntries(Object.entries(dict).sort((a, b) => b[0].length - a[0].length));
  let page = translateHtml(html, sorted)
    .replace(`hreflang="${lang}" lang="${lang}"`, `hreflang="${lang}" lang="${lang}" aria-current="page"`);
  const full = fill(page, lang);
  writeFileSync(new URL(`src/generated/home.${lang}.html`, root), full);
  writeFileSync(new URL(`src/generated/main.${lang}.js`, root), fill(translateJs(js, sorted), lang));
  for (const [key, def] of Object.entries(PAGES)) writeFileSync(new URL(`src/generated/${key}.${lang}.html`, root), sectionPage(full, lang, key, def));
  void href;
}
console.log('i18n: generated es, en, gl');
