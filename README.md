# EduAcademy — Next-Generation E-Learning & Course Marketplace

EduAcademy is a full-stack, commercial-grade online education platform designed for modern learners and instructors. Built with a React 19 / Vite frontend, an Express REST API backend, and backed by Supabase Cloud (PostgreSQL, Authentication, and Storage).

---

## 🏛 System Architecture

```
                               ┌────────────────────────┐
                               │   End User / Browser   │
                               └───────────┬────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       [https://www.MYDOMAIN.com]                     [https://api.MYDOMAIN.com]
         Frontend Application                            Backend REST API
       (Vercel / Netlify / CDN)                         (Render / Railway / VPS)
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           ▼
                                ┌─────────────────────┐
                                │   Supabase Cloud    │
                                │  PostgreSQL + Auth  │
                                │  Storage + Realtime │
                                └─────────────────────┘
```

---

## 🚀 Environments & Getting Started

### 1. Local Development (`localhost`)
Standard development servers:
```bash
# Terminal 1: Start Express API (port 5000)
npm run server

# Terminal 2: Start Vite Dev Server (port 5173)
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 2. Local Demo Experience (`mycourse.test`)
Demonstrate the platform locally without exposing port numbers or localhost URLs:
```bash
# Windows: Double-click start-demo.bat
# Or via terminal:
npm run dev:all
```
- Frontend: `http://mycourse.test` (Port 80)
- Backend API: `http://api.mycourse.test` (Port 80)
- Detailed instructions: See [LOCAL_DEMO_SETUP.md](./LOCAL_DEMO_SETUP.md)

### 3. Production Deployment (`https://www.MYDOMAIN.com`)
- Target Frontend: `https://www.MYDOMAIN.com`
- Target Backend API: `https://api.MYDOMAIN.com`
- Complete production guide: See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)

---

## 📦 Project Structure

```text
├── public/                 # Static assets, robots.txt, sitemap.xml, _redirects
├── server/                 # Express backend REST API
│   ├── config/             # Environment, Database, and Supabase client configs
│   ├── controllers/        # Business logic controllers
│   ├── middleware/         # Auth, RBAC, Validation, Error handling, CORS
│   ├── routes/             # API v1 route modules
│   ├── utils/              # JWT, password hashing, user store
│   ├── proxy.js            # Port 80 local reverse proxy
│   └── server.js           # Server entry point
├── src/                    # React 19 Frontend
│   ├── components/         # Reusable UI components & layouts
│   ├── context/            # Auth, Cart, and Toast contexts
│   ├── lib/                # API client (Axios) and Supabase client
│   ├── pages/              # Public, Auth, Checkout, User, Instructor, Admin pages
│   ├── routes/             # Client-side router & RBAC route guards
│   └── services/           # Service layer integrating Frontend with Backend API
├── supabase/               # 35 PostgreSQL migrations, RLS policies, seed data
├── tests/                  # Backend API & integration test suite
├── LOCAL_DEMO_SETUP.md     # Local domain configuration manual
├── PRODUCTION_DEPLOYMENT.md# Complete cloud deployment guide
└── render.yaml / vercel.json / Procfile # Cloud deployment manifests
```

---

## 🧪 Testing & Verification

```bash
# Run backend integration tests (22 tests)
npm test

# Run frontend production build
npm run build

# Run linter
npm run lint
```

---

## 📄 License
MIT License. Created for EduAcademy Platform.
