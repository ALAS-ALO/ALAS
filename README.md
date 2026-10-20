# ALAS · web

Web de ALAS (Studio + Space) en Astro, en español, inglés y gallego. Se publica en Vercel.

## Estructura

- `src/content/home.html` — el contenido de la página, en español (texto original).
- `src/scripts/main.js` — animaciones, diagramas y formulario (textos en español).
- `src/i18n/en.json`, `src/i18n/gl.json` — traducciones. Cada línea es `"texto en español": "traducción"`.
  Para corregir una traducción, cambia el texto de la derecha. Si cambias un texto en español,
  cambia también su clave en los dos ficheros.
- `src/i18n/meta.json` — título y descripción de cada idioma (buscadores y redes sociales).
- `scripts/i18n.mjs` — genera las versiones `/`, `/en/` y `/gl/` antes de cada build.
- `src/pages/api/contacto.ts` — recibe el formulario y crea un Lead en la base «Clientes» de Notion.
- `public/` — vídeos, favicon e imagen para redes sociales (`og.png`).

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Valor |
|---|---|
| `NOTION_TOKEN` | El secreto de la integración «Web ALAS» de Notion. La integración debe estar conectada a la base «Clientes». |
| `SITE_URL` | El dominio definitivo, p. ej. `https://alas.studio` (se usa en el sitemap y en las etiquetas para buscadores). |

## Comandos

```sh
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # genera la web en dist/ y .vercel/output
```

## Publicar

Cada `git push` a la rama `main` se publica solo en Vercel.
