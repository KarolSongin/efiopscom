import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import { createContactHandler } from './contact.mjs';
import { createAdminHandler } from './admin.mjs';
import { createDemoStore } from './admin-store.mjs';
try {
  process.loadEnvFile('.env');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const root = path.resolve('dist');
const port = Number(process.env.PORT || 4321);
const host = process.env.HOST || '0.0.0.0';
const demoStore = createDemoStore(process.env.ADMIN_DEMO_FILE);
const admin = createAdminHandler({
  env: {
    ...process.env,
    BUILD_MODE: process.env.BUILD_MODE === 'production' ? 'production' : 'preview',
    ADMIN_ALLOWED_ORIGIN: process.env.ADMIN_ALLOWED_ORIGIN || `http://localhost:${port}`,
  },
  allowDemo: true,
  store: demoStore,
});
const contact = createContactHandler({
  demoStore,
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
      if (url.pathname === '/api/contact' || url.pathname.startsWith('/api/admin/')) {
        const request = new Request(url, {
          method: req.method,
          headers: req.headers,
          ...(req.method !== 'GET' && req.method !== 'HEAD'
            ? { body: Readable.toWeb(req), duplex: 'half' }
            : {}),
        });
        const response = await (url.pathname === '/api/contact' ? contact : admin)(request, {
          clientAddress: req.socket.remoteAddress,
        });
        const responseHeaders = Object.fromEntries(response.headers);
        delete responseHeaders['set-cookie'];
        const setCookies = response.headers.getSetCookie();
        if (setCookies.length) res.setHeader('Set-Cookie', setCookies);
        res.writeHead(response.status, responseHeaders);
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
    console.log(
      `EFIops preview on port ${port}. Admin: /admin/. Demo data is local; no outgoing enquiries in preview.`,
    ),
  );
