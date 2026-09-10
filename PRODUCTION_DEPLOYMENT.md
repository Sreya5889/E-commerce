# EduAcademy — Production Deployment Manual

This guide provides the complete, step-by-step procedure to deploy the **EduAcademy** full-stack e-learning e-commerce platform to commercial cloud hosting with custom domains and HTTPS.

---

## 1. Target Production Architecture

```
                               ┌────────────────────────┐
                               │   End User / Browser   │
                               └───────────┬────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       [https://www.MYDOMAIN.com]                     [https://api.MYDOMAIN.com]
         Frontend Application                            Backend REST API
       (Vercel / Netlify / CDN)                         (Render / Railway / Cloud)
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           ▼
                                ┌─────────────────────┐
                                │   Supabase Cloud    │
                                │  PostgreSQL + Auth  │
                                │  Storage + Realtime │
                                └─────────────────────┘
```

- **Frontend**: `https://www.MYDOMAIN.com` (and `https://MYDOMAIN.com`)
- **Backend API**: `https://api.MYDOMAIN.com`
- **Database & Auth**: Supabase Cloud
- **Security**: Managed SSL / HTTPS certificates provisioned automatically via DNS.

---

## 2. Prerequisites

1. A registered domain name (e.g. `MYDOMAIN.com`) from any registrar (Namecheap, GoDaddy, Cloudflare, etc.).
2. A free or paid [Supabase](https://supabase.com) account.
3. A [GitHub](https://github.com) account with your repository pushed.
4. A [Render](https://render.com) or [Railway](https://railway.app) account for backend hosting.
5. A [Vercel](https://vercel.com) or [Netlify](https://netlify.com) account for frontend hosting.

---

## 3. Step-by-Step Deployment Guide

### Phase 1: Supabase Cloud Database & Storage Setup

1. **Create Supabase Project**:
   - Log into [Supabase Dashboard](https://app.supabase.com) and click **New Project**.
   - Select your organization, choose a database password (save it securely), and select your closest cloud region.

2. **Run Database Migrations**:
   - In your Supabase Dashboard, open the **SQL Editor** from the left sidebar.
   - Open [`supabase/combined_schema.sql`](./supabase/combined_schema.sql) in this repository.
   - Copy the entire SQL content, paste it into the Supabase SQL Editor, and click **Run**.
   - *Verification*: Go to the **Table Editor** tab. You will see 30 core tables (`profiles`, `teachers`, `courses`, `enrollments`, `orders`, `payments`, `reviews`, etc.) with Row Level Security (RLS) automatically enabled and indexes provisioned.

3. **Configure Authentication & Redirects**:
   - Navigate to **Authentication** -> **URL Configuration**.
   - **Site URL**:
     ```
     https://www.MYDOMAIN.com
     ```
   - **Redirect URLs** (add each):
     ```
     https://www.MYDOMAIN.com/**
     https://www.MYDOMAIN.com/auth/callback
     https://www.MYDOMAIN.com/reset-password
     https://MYDOMAIN.com/**
     http://localhost:5173/**
     http://mycourse.test/**
     ```
   - Click **Save**.

4. **Verify Storage Buckets**:
   - Navigate to **Storage**.
   - The migration automatically provisions the required buckets:
     - `course-thumbnails` (Public)
     - `course-banners` (Public)
     - `avatars` (Public)
     - `certificates` (Public)
     - `resources` (Authenticated)
     - `videos` (Authenticated)

5. **Collect API Credentials**:
   - Navigate to **Project Settings** -> **API**.
   - Copy:
     - **Project URL**: `https://<project-ref>.supabase.co`
     - **anon/public key**: `eyJhbGci...`
     - **service_role key** *(Keep secret!)*: `eyJhbGci...`
   - Navigate to **Project Settings** -> **Database** -> **Connection string** -> **URI**:
     - Copy the Pooled or Direct connection string.

---

### Phase 2: Deploy Backend API (Render / Railway)

#### Deploying on Render

1. Log into [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Fill in the service configuration:
   - **Name**: `eduacademy-api`
   - **Language**: `Node`
   - **Branch**: `main`
   - **Root Directory**: *(Leave blank)*
   - **Build Command**: `npm install --omit=dev`
   - **Start Command**: `node server/server.js`
   - **Plan**: Free or Starter
5. **Environment Variables**:
   Under the **Environment** tab, add the following key-value pairs:

   | Variable Key | Production Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` *(Render sets this automatically)* |
   | `FRONTEND_URL` | `https://www.MYDOMAIN.com` |
   | `ALLOWED_ORIGINS` | `https://www.MYDOMAIN.com,https://MYDOMAIN.com` |
   | `SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
   | `SUPABASE_ANON_KEY` | *(Your Supabase anon key)* |
   | `SUPABASE_SERVICE_ROLE_KEY` | *(Your Supabase service role key)* |
   | `DATABASE_URL` | `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require` |
   | `JWT_SECRET` | *(Random 32+ character string, e.g. run `openssl rand -hex 32`)* |
   | `PAYMENT_SECRET_KEY` | *(Your Stripe/Razorpay secret key, if applicable)* |

6. **Health Check Path**:
   - Under **Advanced Settings**, set **Health Check Path** to `/health`.
7. Click **Create Web Service**.
8. Once deployed, Render provides a URL (e.g. `https://eduacademy-api.onrender.com`).
9. **Verify Health Endpoint**:
   ```bash
   curl -i https://eduacademy-api.onrender.com/health
   ```
   Should return `HTTP/1.1 200 OK` with `{"success": true, "status": "healthy"}`.

---

### Phase 3: Deploy Frontend Application (Vercel / Netlify)

#### Deploying on Vercel

1. Log into [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   Add the following public frontend variables:

   | Variable Key | Production Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://api.MYDOMAIN.com/api/v1` |
   | `VITE_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | *(Your Supabase public anon key)* |
   | `VITE_PAYMENT_PUBLIC_KEY`| *(Your public payment key, if applicable)* |

   > [!IMPORTANT]
   > Do **NOT** add `SUPABASE_SERVICE_ROLE_KEY` or `PAYMENT_SECRET_KEY` to Vercel. Frontend bundles are public!

6. Click **Deploy**.
7. Vercel automatically applies [`vercel.json`](./vercel.json), ensuring that SPA direct navigation (e.g. `/courses`, `/dashboard`) works without 404 errors.

---

### Phase 4: Custom Domain & DNS Setup

To link your custom domain (`MYDOMAIN.com`) to your deployments:

1. **Backend API Domain (`api.MYDOMAIN.com`)**:
   - In Render: Go to **Settings** -> **Custom Domains** -> Add `api.MYDOMAIN.com`.
   - Render will display a DNS target (e.g. `eduacademy-api.onrender.com`).
   - In your Domain Registrar DNS settings (Cloudflare, Namecheap, GoDaddy):
     - **Record Type**: `CNAME`
     - **Host / Name**: `api`
     - **Target / Value**: `eduacademy-api.onrender.com`
     - **TTL**: `Automatic` or `300`

2. **Frontend Website Domain (`www.MYDOMAIN.com` & `MYDOMAIN.com`)**:
   - In Vercel: Go to **Project Settings** -> **Domains**.
   - Add `www.MYDOMAIN.com` (recommend checking "Redirect MYDOMAIN.com to www.MYDOMAIN.com").
   - In your Domain Registrar DNS settings:
     - **Record Type**: `CNAME`
     - **Host / Name**: `www`
     - **Target / Value**: `cname.vercel-dns.com`
     - **TTL**: `Automatic` or `300`
     - **Apex / Root Domain**: `A` record pointing `@` to `76.76.21.21` (Vercel standard IP).

3. **SSL / HTTPS Certificates**:
   - Both Vercel and Render automatically provision and renew free Let's Encrypt SSL certificates once DNS records propagate (typically 5 to 30 minutes).

---

## 4. Post-Deployment Smoke Test Checklist

Once DNS has propagated, perform these live checks:

- [ ] **Frontend HTTPS**: Visit `https://www.MYDOMAIN.com`. Verify SSL padlock icon and homepage loads.
- [ ] **SPA Direct Refresh**: Navigate to `https://www.MYDOMAIN.com/courses` and refresh the browser. Confirm page reloads cleanly with 200 OK (no 404).
- [ ] **Backend Health Probe**: Open `https://api.MYDOMAIN.com/health`. Verify JSON response reports `status: "healthy"` and `database: "connected"`.
- [ ] **Production CORS Verification**: Open browser Developer Tools -> Network tab on `https://www.MYDOMAIN.com`. Confirm API requests receive headers:
  - `Access-Control-Allow-Origin: https://www.MYDOMAIN.com`
  - `Access-Control-Allow-Credentials: true`
- [ ] **User Registration**: Register a new student account at `https://www.MYDOMAIN.com/register`. Verify instant login and profile creation.
- [ ] **User Authentication**: Log out and log back in at `https://www.MYDOMAIN.com/login`. Verify session persistence on page refresh.
- [ ] **Catalog & Discovery**: Verify course search, category filters, and teacher listings.
- [ ] **Cart & Checkout**: Add a course to cart at `/cart`, apply coupon code (`UDEMY50`), and proceed through checkout `/checkout`.
- [ ] **Classroom Engine**: Access an enrolled course at `/learn/:courseId`, test video playback, mark lessons complete, and confirm progress updates in real-time.
- [ ] **Role-Based Access Control (RBAC)**:
  - Try accessing `/admin` as a student -> confirms redirect or forbidden.
  - Access `/instructor` with teacher privileges -> confirms studio access.
- [ ] **SEO & Metadata**: Inspect page source at `https://www.MYDOMAIN.com`. Confirm `robots.txt` (`https://www.MYDOMAIN.com/robots.txt`) and `sitemap.xml` (`https://www.MYDOMAIN.com/sitemap.xml`) load correctly.

---

## 5. Troubleshooting & Maintenance

### CORS Errors in Browser Console
- **Symptom**: `Access to fetch at 'https://api.MYDOMAIN.com/...' from origin 'https://www.MYDOMAIN.com' has been blocked by CORS policy`.
- **Resolution**: Verify that `FRONTEND_URL` on Render is set to `https://www.MYDOMAIN.com` (exact scheme, no trailing slash). If visitors use `https://MYDOMAIN.com`, verify `ALLOWED_ORIGINS` contains `https://MYDOMAIN.com`.

### 503 "Database Unavailable" from `/health`
- **Symptom**: `/health` returns `status: "unhealthy"`.
- **Resolution**: Check `DATABASE_URL` in your backend environment variables. Ensure the password has no unencoded special characters and `sslmode=require` is appended.

### Client-Side Direct Navigation 404s
- **Symptom**: Navigating to `https://www.MYDOMAIN.com/courses` works by clicking a link, but refreshing the page returns `404 Not Found`.
- **Resolution**: Ensure [`vercel.json`](./vercel.json) or [`public/_redirects`](./public/_redirects) is present in your deployed branch.

### Supabase OAuth / Password Reset Redirects to localhost
- **Symptom**: Clicking a password reset email link redirects to `localhost:5173`.
- **Resolution**: Update **Site URL** and **Redirect URLs** in the Supabase Dashboard -> Authentication -> URL Configuration to `https://www.MYDOMAIN.com/**`.
