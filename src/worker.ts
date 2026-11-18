// Worker entry: the old workers.dev address answers with a permanent redirect
// to the main domain (same path and query); everything else is the Astro site.
import { handle } from '@astrojs/cloudflare/handler';

const SITE = 'https://alaslab.com';
const OLD_HOSTS = new Set(['alas.lopezoteroadrian.workers.dev']);

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);
    if (OLD_HOSTS.has(url.hostname)) {
      return new Response(null, {
        status: 301,
        headers: { Location: SITE + url.pathname + url.search, 'Cache-Control': 'public, max-age=86400' },
      });
    }
    return handle(request, env, ctx);
  },
};
