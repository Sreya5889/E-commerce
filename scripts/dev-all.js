/**
 * EduAcademy - Unified Multi-Process Runner
 * Concurrently starts:
 *   1. Backend API Server (port 5000)
 *   2. Vite Frontend Server (port 5173)
 *   3. Reverse Proxy (port 80)
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = 'node';

const processes = [];

function startProcess(name, command, args, color) {
  const proc = spawn(command, args, {
    cwd: rootDir,
    shell: isWindows,
    env: { ...process.env, FORCE_COLOR: '1' },
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  const prefix = `${color}[${name}]\x1b[0m`;

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) console.log(`${prefix} ${line.trimEnd()}`);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) console.error(`${prefix} \x1b[31m${line.trimEnd()}\x1b[0m`);
    });
  });

  proc.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${prefix} exited with code ${code}`);
    }
  });

  processes.push(proc);
  return proc;
}

console.log('====================================================');
console.log('🚀 Starting EduAcademy Complete Local Demo Platform');
console.log('====================================================\n');

// 1. Start Backend API
startProcess('BACKEND', nodeCmd, ['server/server.js'], '\x1b[32m');

// 2. Start Frontend Vite
startProcess('FRONTEND', npmCmd, ['run', 'dev'], '\x1b[36m');

// 3. Start Port 80 Reverse Proxy
setTimeout(() => {
  startProcess('PROXY', nodeCmd, ['server/proxy.js'], '\x1b[35m');
}, 1000);

// Graceful cleanup on Ctrl+C
function cleanup() {
  console.log('\n🛑 Shutting down all EduAcademy services...');
  processes.forEach((proc) => {
    try {
      if (isWindows) {
        spawn('taskkill', ['/pid', proc.pid, '/f', '/t']);
      } else {
        proc.kill('SIGTERM');
      }
    } catch {}
  });
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
