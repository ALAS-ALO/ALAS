import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://alas.lopezoteroadrian.workers.dev',
  output: 'static',
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [sitemap()],
  session: false,
  i18n: { defaultLocale: 'es', locales: ['es', 'en', 'gl'], routing: { prefixDefaultLocale: false } },
});
