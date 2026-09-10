# EduAcademy — Professional Local Demo Setup Guide

This guide describes how to run and demonstrate the complete **EduAcademy** e-learning platform locally using clean, professional domains:

- **Frontend Application**: [http://mycourse.test](http://mycourse.test)
- **Backend API**: [http://api.mycourse.test](http://api.mycourse.test)
- **Supabase**: Cloud Supabase Project (Auth, PostgreSQL Database & Storage)

> [!NOTE]
> `.test` is a reserved top-level domain (RFC 2606 & RFC 6761) designated specifically for testing and local development. It will never conflict with public internet domain names.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **Web Browser**: Chrome, Edge, Safari, or Firefox
- **OS**: Windows, macOS, or Linux

---

## 2. Hosts File Configuration

To enable your computer to resolve `mycourse.test` and `api.mycourse.test` locally to `127.0.0.1`, add the host entries.

### Option A: Automatic Setup (Windows)
Run the automated script included in this repository:
1. Double-click `setup-hosts.bat` (or right-click `setup-hosts.ps1` -> *Run with PowerShell*).
2. Click **Yes** on the Windows User Account Control (UAC) prompt to allow administrator access.
3. The script verifies and automatically appends the entries if missing, and flushes your Windows DNS cache.

### Option B: Manual Setup

#### Windows
1. Open **Notepad** as Administrator (*Start menu -> type "Notepad" -> right click -> Run as Administrator*).
2. Open file: `C:\Windows\System32\drivers\etc\hosts`.
3. Add the following lines to the bottom of the file:
   ```hosts
   # EduAcademy Local Demo Domains
   127.0.0.1 mycourse.test
   127.0.0.1 api.mycourse.test
   ```
4. Save the file.
5. In PowerShell or Command Prompt, flush your DNS resolver cache:
   ```powershell
   ipconfig /flushdns
   ```

#### macOS / Linux
1. Open Terminal and edit `/etc/hosts` with `sudo`:
   ```bash
   sudo nano /etc/hosts
   ```
2. Add the following lines:
   ```hosts
   # EduAcademy Local Demo Domains
   127.0.0.1 mycourse.test
   127.0.0.1 api.mycourse.test
   ```
3. Save (`Ctrl+O`, `Enter`) and exit (`Ctrl+X`).
4. Flush DNS:
   - macOS: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
   - Linux: `sudo systemd-resolve --flush-caches`

---

## 3. Architecture & Reverse Proxy Routing

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Browser / Demo Visitor                          │
│                                                                        │
│    http://mycourse.test                  http://api.mycourse.test      │
└───────────────────┬──────────────────────────────────┬─────────────────┘
                    │ (Port 80 HTTP)                   │ (Port 80 HTTP)
                    ▼                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│             EduAcademy Local Reverse Proxy (server/proxy.js)           │
│             Zero dependencies, WebSocket-enabled for HMR               │
└───────────────────┬──────────────────────────────────┬─────────────────┘
                    │                                  │
                    ▼ (Forward to 127.0.0.1:5173)      ▼ (Forward to 127.0.0.1:5000)
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│          Vite Frontend App           │   │      Express REST API       │
│         (React 19, Tailwind)         │   │   (JWT, RBAC, Controllers)  │
└──────────────────────────────────────┘   └──────────────┬──────────────┘
                                                          │
                                                          ▼
                                           ┌─────────────────────────────┐
                                           │       Supabase Cloud        │
                                           │   PostgreSQL / Auth / RLS   │
                                           └─────────────────────────────┘
```

- **Port 80 Reverse Proxy**: Listens on default HTTP port 80. Routes requests destined for `api.mycourse.test` (or `/api/*` and `/health`) to port 5000, and all other traffic to port 5173.
- **Vite `allowedHosts`**: Configured in `vite.config.js` to allow `mycourse.test` and `.mycourse.test`, preventing Vite host-header blocking.
- **Express CORS**: Specifically whitelists `http://mycourse.test` and subdomains with `credentials: true`.
- **Direct Port Fallback**: If port 80 is unavailable or occupied by another service on your machine, you can directly access `http://mycourse.test:5173` and `http://api.mycourse.test:5000`.

---

## 4. Environment Variables Checklist

Configuration file: `.env`

```env
# --------------------------------------------------------------------
# 1. Server & Security Settings
# --------------------------------------------------------------------
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://mycourse.test
JWT_SECRET=super-secret-jwt-token-key-min-32-chars

# --------------------------------------------------------------------
# 2. Frontend API & Public Configuration (Vite)
# --------------------------------------------------------------------
VITE_API_URL=http://api.mycourse.test/api/v1
VITE_PAYMENT_PUBLIC_KEY=pk_test_placeholder_payment_key

# --------------------------------------------------------------------
# 3. Supabase Cloud Configuration
# (From Supabase Dashboard -> Project Settings -> API)
# --------------------------------------------------------------------
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# --------------------------------------------------------------------
# 4. Direct Database Connection
# --------------------------------------------------------------------
DATABASE_URL=postgresql://postgres:[password]@db.<your-project-id>.supabase.co:5432/postgres
```

---

## 5. Supabase Dashboard Configuration

If you are using Supabase Auth (Email confirmation, OAuth Google Login, or password recovery):

1. Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2. **Site URL**:
   Set to:
   ```
   http://mycourse.test
   ```
3. **Redirect URLs**:
   Add the following patterns to the whitelist:
   ```
   http://mycourse.test/**
   http://mycourse.test/auth/callback
   http://mycourse.test/reset-password
   http://mycourse.test:5173/**
   ```
4. Click **Save**.

---

## 6. Startup Commands

### Option A: One-Click Demo Launcher (Windows)
Double-click:
```
start-demo.bat
```
This automatically verifies your hosts file, starts the Backend, Frontend, and Reverse Proxy concurrently, and opens `http://mycourse.test` in your default browser.

### Option B: Single Command via npm
Run from your terminal:
```bash
npm run dev:all
```
*(Alias: `npm run demo`)*

### Option C: Separate Terminals (Manual)

If you prefer viewing individual service logs in separate terminal windows:

**Terminal 1 (Backend API)**:
```bash
npm run server
```
*Listens on `http://127.0.0.1:5000` / `http://api.mycourse.test:5000`.*

**Terminal 2 (Frontend Vite)**:
```bash
npm run dev
```
*Listens on `http://127.0.0.1:5173` / `http://mycourse.test:5173`.*

**Terminal 3 (Reverse Proxy - Port 80)**:
```bash
npm run proxy
```
*Binds port 80 to proxy `http://mycourse.test` -> 5173 and `http://api.mycourse.test` -> 5000.*

---

## 7. Demo Walkthrough: Presenting the Application

When presenting to another person:

1. **Launch**: Double-click `start-demo.bat` (or run `npm run demo`).
2. **Open Browser**: Navigate to `http://mycourse.test`.
3. **Showcase Flow**:
   - **Homepage**: Browse course catalog, categories grid, featured instructors, and pricing tiers.
   - **Catalog & Filter**: Go to [http://mycourse.test/courses](http://mycourse.test/courses), test search, category pills, level filters, and price sorting.
   - **Registration**: Click **Sign Up**, register an account (`http://mycourse.test/register`). Notice real JWT minting and instant session establishment without "Failed to fetch".
   - **Cart & Checkout**: Add a course to cart at [http://mycourse.test/cart](http://mycourse.test/cart), apply coupon `UDEMY50`, and simulate checkout at [http://mycourse.test/checkout](http://mycourse.test/checkout).
   - **Classroom / Learning**: Access [http://mycourse.test/dashboard](http://mycourse.test/dashboard) and enter the video classroom (`/learn/:courseId`), mark lessons complete, and view the live syllabus.
   - **Instructor Studio**: Navigate to [http://mycourse.test/instructor](http://mycourse.test/instructor) to show student analytics and the 6-step Course Creator wizard.

The viewer will only see `http://mycourse.test` throughout the entire experience.

---

## 8. Troubleshooting & FAQ

### Issue: "This site can’t be reached" (DNS resolution error)
- **Cause**: The hosts file entries are missing or not reloaded.
- **Fix**: Run `setup-hosts.bat` as Administrator, or run `ipconfig /flushdns` in Command Prompt. Make sure you can ping `ping mycourse.test` and get replies from `127.0.0.1`.

### Issue: Port 80 is occupied (EADDRINUSE)
- **Cause**: Another service such as World Wide Web Publishing Service (IIS), Skype, or Docker is bound to port 80.
- **Fix**: You can either:
  1. Stop IIS: Run `net stop was /y` in an Administrator command prompt.
  2. Or use the direct demo ports:
     - Frontend: `http://mycourse.test:5173`
     - Backend: `http://api.mycourse.test:5000`

### Issue: Vite displays "Blocked request: Host is not allowed"
- **Cause**: Outdated Vite configuration without `server.allowedHosts`.
- **Fix**: Already solved! `vite.config.js` is pre-configured with `allowedHosts: ['mycourse.test', '.mycourse.test', 'api.mycourse.test', 'localhost', '127.0.0.1']`.

### Issue: CORS error when making API requests
- **Cause**: Origin not recognized by Express.
- **Fix**: Already solved! `server/app.js` permits `http://mycourse.test`, `http://api.mycourse.test`, and all subdomains matching `*.mycourse.test` on any port.

---

## 9. How to Reset or Revert

If you wish to remove the local demo configuration:
1. Edit `C:\Windows\System32\drivers\etc\hosts` (as Admin) and remove the two lines:
   ```hosts
   127.0.0.1 mycourse.test
   127.0.0.1 api.mycourse.test
   ```
2. In `.env`, change:
   - `FRONTEND_URL=http://localhost:5173`
   - `VITE_API_URL=http://localhost:5000/api/v1`
3. Flush DNS: `ipconfig /flushdns`.
