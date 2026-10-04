import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import { createContactHandler } from './contact.mjs';
const root = path.resolve('dist');
const port = Number(process.env.PORT || 4321);
const host = process.env.HOST || '0.0.0.0';
const contact = createContactHandler({
  env: {
    ...process.env,
    BUILD_MODE: 'preview',
    CONTACT_ALLOWED_ORIGIN: process.env.CONTACT_ALLOWED_ORIGIN || `http://localhost:${port}`,
  },
});
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://localhost:${port}`);
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      if (url.pathname === '/api/contact') {
        const request = new Request(url, {
          method: req.method,
          headers: req.headers,
          ...(req.method !== 'GET' && req.method !== 'HEAD'
            ? { body: Readable.toWeb(req), duplex: 'half' }
            : {}),
        });
        const response = await contact(request, { clientAddress: req.socket.remoteAddress });
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(Buffer.from(await response.arrayBuffer()));
        return;
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405);
        res.end();
        return;
      }
      const pathname = decodeURIComponent(url.pathname);
      let file = path.resolve(root, '.' + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      try {
        const stat = await fs.stat(file);
        if (stat.isDirectory()) {
          if (!pathname.endsWith('/')) {
            res.writeHead(308, { Location: pathname + '/' + url.search });
            res.end();
            return;
          }
          file = path.join(file, 'index.html');
        }
        await fs.access(file);
      } catch {
        file = path.join(root, '404.html');
        res.statusCode = 404;
      }
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      let body = await fs.readFile(file);
      res.setHeader(
        'Cache-Control',
        url.pathname.startsWith('/_astro/')
          ? 'public, max-age=31536000, immutable'
          : url.pathname.startsWith('/images/')
            ? 'public, max-age=86400'
            : 'no-cache',
      );
      if (/\.(html|css|js|json|xml|svg|txt)$/.test(file)) {
        res.setHeader('Vary', 'Accept-Encoding');
        const accepted = req.headers['accept-encoding'] || '';
        if (accepted.includes('br')) {
          body = brotliCompressSync(body);
          res.setHeader('Content-Encoding', 'br');
        } else if (accepted.includes('gzip')) {
          body = gzipSync(body);
          res.setHeader('Content-Encoding', 'gzip');
        }
      }
      res.setHeader('Content-Length', body.length);
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.writeHead(500);
      res.end('Preview server error.');
    }
  })
  .listen(port, host, () =>
    console.log(`EFIops review preview listening on port ${port}; no real outgoing enquiries.`),
  );
