# ALAS · web

Web de ALAS (Studio + Space) en Astro, en español, inglés y gallego. Se publica en Cloudflare (Workers, plan gratuito).

## Estructura

- `src/content/home.html` — el contenido de la página, en español (texto original).
- `src/scripts/main.js` — animaciones, diagramas y formulario (textos en español).
- `src/i18n/en.json`, `src/i18n/gl.json` — traducciones. Cada línea es `"texto en español": "traducción"`.
  Para corregir una traducción, cambia el texto de la derecha. Si cambias un texto en español,
  cambia también su clave en los dos ficheros.
- `src/i18n/meta.json` — título y descripción de cada idioma (buscadores y redes sociales).
- `scripts/i18n.mjs` — genera las versiones `/`, `/en/` y `/gl/` antes de cada build.
- `src/pages/api/contacto.ts` — recibe el formulario, crea un Lead en la base «Clientes» de Notion y envía un aviso por correo (de web@alaslab.com a alaslab.soporte@gmail.com, con «Responder» dirigido a quien escribió). Si falla uno de los dos, el otro basta para no perder el contacto.
- `public/` — vídeos, favicon e imagen para redes sociales (`og.png`).

## Variables (Cloudflare → Workers & Pages → alas → Settings)

| Variable | Valor |
|---|---|
| `AVISO` | Enlace `send_email` en `wrangler.jsonc` (Cloudflare Email Routing). El destino debe estar verificado en Email Routing. |
| `NOTION_TOKEN` | Tipo **Secret**, en *Variables and Secrets*. El secreto de la integración «Web ALAS» de Notion, que debe estar conectada a la base «Clientes». |
| `SITE_URL` | En *Build → Variables and secrets*. Opcional: dominio del sitio. Por defecto `https://alaslab.com` (se usa en el sitemap y en las etiquetas para buscadores). |

## Comandos

```sh
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # genera la web en dist/
npm run preview  # la sirve como en Cloudflare (secretos locales en .dev.vars)
```

## Publicar

Cada `git push` a la rama `main` se publica solo en Cloudflare (Workers Builds: build `npm run build`, deploy `npx wrangler deploy`).
Las demás ramas generan una versión de prueba con su propio enlace.
