// Videos with byte-range support (HTTP 206), which Safari on iPhone and iPad needs to play them.
// The files live in /_video/; this route reads them from the static assets and serves the requested slice.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const TYPES: Record<string, string> = { mp4: 'video/mp4', webm: 'video/webm' };

async function serve(file: string | undefined, request: Request, head: boolean): Promise<Response> {
  const m = /^([a-z0-9-]+)\.(mp4|webm)$/.exec(file ?? '');
  if (!m) return new Response('Not found', { status: 404 });
  const assets = (env as unknown as { ASSETS: { fetch: (u: URL) => Promise<Response> } }).ASSETS;
  const src = await assets.fetch(new URL('/_video/' + m[0], request.url));
  if (!src.ok) return new Response('Not found', { status: 404 });
  const buf = await src.arrayBuffer(), size = buf.byteLength;
  const base: Record<string, string> = { 'Content-Type': TYPES[m[2]], 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=86400' };
  const r = /^bytes=(\d*)-(\d*)$/.exec((request.headers.get('Range') ?? '').trim());
  if (r && (r[1] !== '' || r[2] !== '')) {
    let start: number, end: number;
    if (r[1] === '') { start = Math.max(0, size - Number(r[2])); end = size - 1; }
    else { start = Number(r[1]); end = r[2] === '' ? size - 1 : Math.min(Number(r[2]), size - 1); }
    if (start >= size || start > end) return new Response(null, { status: 416, headers: { ...base, 'Content-Range': `bytes */${size}` } });
    return new Response(head ? null : buf.slice(start, end + 1), { status: 206, headers: { ...base, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) } });
  }
  return new Response(head ? null : buf, { status: 200, headers: { ...base, 'Content-Length': String(size) } });
}

export const GET: APIRoute = ({ params, request }) => serve(params.file, request, false);
export const HEAD: APIRoute = ({ params, request }) => serve(params.file, request, true);
