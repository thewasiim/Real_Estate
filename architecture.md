# Architecture — Luxury Real Estate Web Application (Full-Stack)

## 1. Architectural Style
A classic **three-tier architecture**: React SPA frontend, Node.js/Express REST API backend, PostgreSQL database — deployed as three separate, independently scalable services.

```
Browser
  └── React SPA (Vite build) — frontend service
        ├── React Router (page-level routing)
        ├── Context/State layer (auth, filters, favorites, compare, recently-viewed)
        ├── API client layer (axios/fetch wrapper, auth token handling)
        ├── Component layer (UI, sections, cards, modals, Admin Panel)
        └── Framer Motion (animation layer, cross-cutting)
              │
              │  HTTPS (REST, JSON)
              ▼
Node.js + Express API — backend service
        ├── Routes (properties, projects, agents, auth, leads, favorites, users, uploads)
        ├── Controllers (request handling, validation)
        ├── Middleware (auth/JWT verification, role guard, error handler, rate limiter)
        ├── Services (business logic)
        ├── Prisma Client (DB access layer)
        └── Cloudinary SDK (image upload)
              │
              ▼
PostgreSQL Database (managed, e.g. Supabase/Neon/Railway)
```

## 2. Tech Stack

### Frontend
- **Build tool:** Vite
- **Framework:** React 18 (functional components + hooks)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** lucide-react
- **API client:** Axios instance with interceptors (attaches JWT, handles 401 → redirect to login)
- **State management:** React Context + `useReducer` for auth, filters, favorites, compare, recently-viewed; server data fetched/cached via a lightweight data-fetching pattern (e.g., a small `useQuery`-style hook, or React Query if the team wants caching/retries out of the box)

### Backend
- **Runtime:** Node.js (LTS)
- **Framework:** Express.js
- **ORM:** Prisma (schema-first, type-safe queries, migrations)
- **Database:** PostgreSQL
- **Auth:** `jsonwebtoken` (JWT) + `bcrypt` (password hashing)
- **Validation:** `zod` or `express-validator` on all request bodies
- **File upload:** `multer` (memory storage) → Cloudinary SDK for persistent image hosting
- **Email (optional/stretch):** Resend or Nodemailer + SMTP provider
- **Security middleware:** `helmet`, `cors` (locked to frontend origin), `express-rate-limit` on auth/lead endpoints

### Infra / Deployment
- Frontend: Vercel or Netlify (static build, calls backend via `VITE_API_BASE_URL` env var)
- Backend: Render, Railway, or Fly.io (Node service)
- Database: managed Postgres (Supabase, Neon, or Railway Postgres)
- Image storage: Cloudinary (free tier sufficient for demo/portfolio scale)
- Environment variables (backend): `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_*`, `CORS_ORIGIN`, `EMAIL_*` (optional)

## 3. Folder Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api/                     # NEW — API client layer
│   │   │   ├── axiosClient.js       # base instance, JWT interceptor
│   │   │   ├── propertiesApi.js
│   │   │   ├── projectsApi.js
│   │   │   ├── agentsApi.js
│   │   │   ├── authApi.js
│   │   │   ├── leadsApi.js
│   │   │   └── favoritesApi.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # NOW REAL — holds JWT/user, login/register/logout hit authApi
│   │   │   ├── FilterContext.jsx
│   │   │   ├── FavoritesContext.jsx # NOW backed by favoritesApi for logged-in users
│   │   │   ├── CompareContext.jsx
│   │   │   └── RecentlyViewedContext.jsx
│   │   ├── hooks/
│   │   │   ├── useFetch.js          # replaces useMockFetch — real API calls, loading/error state
│   │   │   ├── useScrollNavbar.js
│   │   │   ├── useCountUp.js
│   │   │   └── useDebounce.js
│   │   ├── layout/                  # Navbar, Footer, BackToTop (Navbar now shows real auth state)
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── property/            # cards, filters, sort, CompareBar/Table
│   │   │   ├── project/
│   │   │   ├── agent/
│   │   │   ├── home/
│   │   │   ├── shared/              # EMICalculator, ScheduleVisitModal, BookVisitModal,
│   │   │   │                        # ShareButton, MapEmbed, Carousel, ProtectedRoute
│   │   │   └── admin/                # NEW — DataTable, AdminForm, AdminSidebar, AdminStatCard
│   │   ├── pages/
│   │   │   ├── Home.jsx, Properties.jsx, PropertyDetails.jsx, Favorites.jsx,
│   │   │   ├── Projects.jsx, ProjectDetails.jsx, Agents.jsx, AgentDetails.jsx,
│   │   │   ├── About.jsx, Blog.jsx, BlogPost.jsx, Contact.jsx,
│   │   │   ├── Login.jsx, Register.jsx, Profile.jsx,        # Login/Register now real
│   │   │   ├── NotFound.jsx
│   │   │   └── admin/                # NEW
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProperties.jsx (+ AdminPropertyForm.jsx)
│   │   │       ├── AdminProjects.jsx
│   │   │       ├── AdminAgents.jsx
│   │   │       ├── AdminLeads.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx        # public routes + <ProtectedRoute> + <AdminRoute>
│   │   └── utils/
│   │       ├── formatCurrency.js
│   │       └── emiCalculator.js
│
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express app entry
│   │   ├── config/
│   │   │   ├── db.js                 # Prisma client instance
│   │   │   └── cloudinary.js
│   │   ├── middleware/
│   │   │   ├── auth.js               # verifyToken
│   │   │   ├── requireRole.js        # role guard (ADMIN, AGENT)
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js           # zod/express-validator wrapper
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── properties.routes.js
│   │   │   ├── projects.routes.js
│   │   │   ├── agents.routes.js
│   │   │   ├── leads.routes.js
│   │   │   ├── favorites.routes.js
│   │   │   ├── users.routes.js
│   │   │   └── uploads.routes.js
│   │   ├── controllers/              # one per route group above
│   │   ├── services/                 # business logic, separated from controllers
│   │   └── utils/
│   │       ├── hashPassword.js
│   │       ├── generateToken.js
│   │       └── sendEmail.js          # optional/stretch
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js                   # seeds demo properties/agents/testimonials
│   └── package.json
│
└── (root-level) README.md, docker-compose.yml (optional, for local Postgres)
```

## 4. Routing Map (Frontend)
| Path | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/properties` | Property Listing | Public |
| `/properties/:id` | Property Details | Public |
| `/favorites` | Saved Properties | Authenticated |
| `/profile` | User Profile | Authenticated |
| `/projects`, `/projects/:id` | Projects | Public |
| `/agents`, `/agents/:id` | Agents | Public |
| `/about`, `/blog`, `/blog/:slug`, `/contact` | Content pages | Public |
| `/login`, `/register` | Auth | Public (redirect if already logged in) |
| `/admin` | Admin Dashboard | Admin only |
| `/admin/properties`, `/admin/projects`, `/admin/agents`, `/admin/leads`, `/admin/users` | Admin CRUD | Admin only |
| `*` | 404 | Public |

## 5. API Routes (Backend) — see `trd.md` §4 for full request/response detail
| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Authenticated |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/properties` | Public (query params for filters/sort/pagination) |
| GET | `/api/properties/:id` | Public |
| POST/PUT/DELETE | `/api/properties/:id` | Admin |
| GET | `/api/projects`, `/api/projects/:id` | Public |
| POST/PUT/DELETE | `/api/projects/:id` | Admin |
| GET | `/api/agents`, `/api/agents/:id` | Public |
| POST/PUT/DELETE | `/api/agents/:id` | Admin |
| GET/POST | `/api/favorites` | Authenticated |
| DELETE | `/api/favorites/:propertyId` | Authenticated |
| POST | `/api/leads` (scheduleVisit / bookVisit / contact / newsletter — `type` field) | Public |
| GET | `/api/leads` | Admin |
| PATCH | `/api/leads/:id` | Admin (update status) |
| GET | `/api/users` | Admin |
| PATCH | `/api/users/:id/role` | Admin |
| POST | `/api/uploads/image` | Admin (Cloudinary upload) |

## 6. State Management Design (Frontend)
- **AuthContext** — `{ user, token, isLoggedIn, isAdmin, login, register, logout, loading }`. Token stored in an httpOnly cookie set by the backend (preferred) so the frontend never touches raw JWT in JS-accessible storage; `AuthContext` hydrates `user` via `GET /api/auth/me` on app load.
- **FilterContext** — same shape as before, but now serializes to query params for `GET /api/properties`.
- **FavoritesContext** — for logged-in users, source of truth is the backend (`GET/POST/DELETE /api/favorites`); local optimistic update on toggle, reconciled with API response.
- **CompareContext / RecentlyViewedContext** — remain client-side (`localStorage`), unaffected by the backend addition.
- **ProtectedRoute / AdminRoute** — wrapper components that check `AuthContext` and redirect to `/login` (or `/` with a toast) if unauthorized.

## 7. Data Flow (Real Fetch)
1. Component mounts → calls `useFetch('/properties', { params: filters })`.
2. Hook sets `loading: true`, calls the Axios client, which attaches the auth cookie automatically (`withCredentials: true`).
3. Backend validates query params, queries Postgres via Prisma, returns paginated JSON.
4. Hook returns `{ data, loading, error }`; component renders skeleton while `loading`, error state on failure, real cards on success.

## 8. Security Architecture
- Passwords hashed with `bcrypt` (cost factor ≥ 10) — never stored or logged in plaintext.
- JWT access token short-lived (e.g., 15 min) + refresh token (httpOnly cookie, longer-lived) rotation strategy, OR a single httpOnly session cookie if refresh-token complexity isn't needed for this scale — decide in Phase 1 (see `trd.md` §8).
- All admin/mutating routes protected by `verifyToken` + `requireRole('ADMIN')` middleware.
- Input validation on every POST/PUT/PATCH route (zod schemas) — never trust client input directly into Prisma queries.
- `helmet` for secure headers, `cors` locked to the deployed frontend origin, `express-rate-limit` on `/api/auth/*` and `/api/leads` to deter brute-force/spam.
- Environment secrets (`JWT_SECRET`, `DATABASE_URL`, Cloudinary keys) never committed — `.env` git-ignored, real values only in deployment platform's secret manager.

## 9. Animation & Accessibility Architecture
Unchanged from the frontend-only version — see the original sections (scroll-reveal, navbar transition, counters, glassmorphism restricted usage, ARIA/keyboard requirements). The Admin Panel is exempt from glassmorphism/marketing-motion styling (utilitarian dashboard aesthetic) but must still meet the same accessibility bar (contrast, keyboard nav, focus states).

## 10. Deployment
- **Frontend:** `vite build` → Vercel/Netlify, env var `VITE_API_BASE_URL` pointing at the deployed backend.
- **Backend:** Node service on Render/Railway/Fly.io; `prisma migrate deploy` run on release; health-check endpoint `GET /api/health`.
- **Database:** managed Postgres instance; connection pooling (e.g., Prisma Data Proxy or PgBouncer) recommended if traffic grows.
- **Images:** Cloudinary — frontend/backend never store binary image data locally in production.
- **CI (optional):** lint + test on push; migration check before deploy.
