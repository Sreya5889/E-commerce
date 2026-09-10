/**
 * EduAcademy - Zero-Dependency Local Reverse Proxy
 * Maps:
 *   http://mycourse.test      -> Vite Dev Server (http://127.0.0.1:5173)
 *   http://api.mycourse.test  -> Express API Server (http://127.0.0.1:5000)
 *
 * Runs on Port 80, eliminating port numbers from URLs for professional demonstrations.
 * Supports WebSockets for Vite HMR (Hot Module Replacement).
 */

import http from 'node:http';

const PROXY_PORT = parseInt(process.env.PROXY_PORT || '80', 10);
const FRONTEND_TARGET = { host: '127.0.0.1', port: 5173 };
const BACKEND_TARGET = { host: '127.0.0.1', port: 5000 };

function getTarget(req) {
  const host = (req.headers.host || '').toLowerCase();
  const url = req.url || '';

  // API routing: api.mycourse.test OR path /api/* OR /health
  if (host.startsWith('api.mycourse.test') || url.startsWith('/api') || url.startsWith('/health')) {
    return { ...BACKEND_TARGET, isApi: true };
  }
  return { ...FRONTEND_TARGET, isApi: false };
}

const server = http.createServer((req, res) => {
  const target = getTarget(req);

  const proxyReq = http.request(
    {
      hostname: target.host,
      port: target.port,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        'x-forwarded-for': req.socket.remoteAddress,
        'x-forwarded-host': req.headers.host,
        'x-forwarded-proto': 'http',
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );

  proxyReq.on('error', (err) => {
    const serviceName = target.isApi ? 'Backend API (port 5000)' : 'Frontend App (port 5173)';
    console.error(`[Proxy Error] Unable to connect to ${serviceName} for ${req.method} ${req.url}: ${err.message}`);

    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>EduAcademy Demo - 502 Bad Gateway</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center; }
            .card { max-width: 540px; margin: 60px auto; background: #1e293b; padding: 32px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            h1 { color: #f43f5e; font-size: 24px; }
            p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
            code { background: #334155; padding: 4px 8px; border-radius: 6px; font-family: monospace; color: #38bdf8; }
            .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; background: #334155; color: #e2e8f0; font-size: 13px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>502 Bad Gateway</h1>
            <p>The reverse proxy could not connect to <strong>${serviceName}</strong>.</p>
            <p>Make sure the service is running:</p>
            <p><code>npm run dev:all</code></p>
            <div class="badge">EduAcademy Local Demo Proxy</div>
          </div>
        </body>
        </html>
      `);
    }
  });

  req.pipe(proxyReq, { end: true });
});

// WebSocket Proxy (for Vite Hot Module Replacement)
server.on('upgrade', (req, socket, head) => {
  const target = getTarget(req);

  const proxyReq = http.request({
    hostname: target.host,
    port: target.port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  });

  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    proxySocket.on('error', (err) => {
      console.error('[WebSocket Proxy Error]:', err.message);
      socket.destroy();
    });
    socket.on('error', (err) => {
      console.error('[Client WebSocket Error]:', err.message);
      proxySocket.destroy();
    });

    socket.write(
      `HTTP/1.1 101 Switching Protocols\r\n` +
      Object.entries(proxyRes.headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\r\n') +
      `\r\n\r\n`
    );

    if (proxyHead && proxyHead.length) socket.write(proxyHead);
    if (head && head.length) proxySocket.write(head);

    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.on('error', (err) => {
    console.error('[WebSocket Upgrade Error]:', err.message);
    socket.destroy();
  });

  proxyReq.end();
});

server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🌐 EduAcademy Local Reverse Proxy Active on Port ${PROXY_PORT}`);
  console.log(`   Frontend : http://mycourse.test`);
  console.log(`   Backend  : http://api.mycourse.test`);
  console.log(`   Health   : http://api.mycourse.test/health`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EACCES') {
    console.error(`❌ [Permission Error] Port ${PROXY_PORT} requires Administrator privileges.`);
    console.error(`   Run your terminal as Administrator, or launch start-demo.bat.`);
  } else if (err.code === 'EADDRINUSE') {
    console.error(`❌ [Port Conflict] Port ${PROXY_PORT} is already in use by another process (e.g. IIS, Skype, or Docker).`);
    console.error(`   You can still access the project via:`);
    console.error(`   Frontend : http://mycourse.test:5173`);
    console.error(`   Backend  : http://api.mycourse.test:5000`);
  } else {
    console.error(`❌ [Proxy Server Error]:`, err);
  }
  process.exit(1);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
