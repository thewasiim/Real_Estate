# Phases — Build Plan (Full-Stack)

Each phase is a demoable milestone. Later phases assume earlier ones are complete. Frontend and backend work is interleaved per phase so nothing lands half-connected.

## Phase 0 — Project & Backend Setup
- Scaffold monorepo: `/frontend` (Vite + React) and `/backend` (Express).
- Backend: initialize Express app, install Prisma, connect to a local/dev PostgreSQL instance, run first migration with an empty schema, add `helmet`, `cors`, `express-rate-limit`, health-check route (`GET /api/health`).
- Frontend: install Tailwind, Framer Motion, React Router, lucide-react, Axios; scaffold `App.jsx`, `AppRoutes.jsx`, base layout shell (`Navbar`, `Footer`, `BackToTop`), UI primitives (`Button`, `Modal`, `Skeleton`, etc.).
- Decide: JWT-in-httpOnly-cookie vs. access+refresh token pair (see `trd.md` §8) — lock this in before building auth.

**Deliverable:** Empty-but-connected app; frontend can successfully call `GET /api/health` on the backend.

## Phase 1 — Database Schema & Auth
- Define full Prisma schema (`User`, `Property`, `Project`, `Agent`, `Lead`, `Favorite`, `Testimonial`, `BlogPost`, `FAQ`) — see `trd.md` §3.
- Build `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` with bcrypt hashing + JWT issuance.
- Build `verifyToken` and `requireRole` middleware.
- Frontend: real `AuthContext` (register/login/logout/me), `Login.jsx`/`Register.jsx` forms wired to the API, `ProtectedRoute`/`AdminRoute` wrappers.

**Deliverable:** A user can register, log in, stay logged in across refresh, and log out — end to end.

## Phase 2 — Properties & Projects API + Seed Data
- Build `GET /api/properties` (filters, sort, pagination as query params), `GET /api/properties/:id`, and Admin-only `POST/PUT/DELETE`.
- Build the equivalent for `/api/projects` and `/api/agents`.
- Write `backend/prisma/seed.js` with realistic dummy properties/projects/agents/testimonials (Unsplash images, fictional personas) — replaces the old static JSON files as the source of truth.
- Frontend: `useFetch` hook + `src/api/*` client modules replace `useMockFetch`.

**Deliverable:** Properties/Projects/Agents are served from Postgres via real API calls; seed data renders identically to how the old mock data used to.

## Phase 3 — Homepage (Real Data)
- Rebuild Homepage sections against real API data: Hero search bar (submits to `/properties` with query params), Featured Properties, Categories, Why Choose Us, Latest Projects, Properties by Location, Amenities, Testimonials, Stats counters, Blog preview, FAQ accordion, CTA banner.
- Navbar scroll behavior (transparent → solid), now also reflecting real auth state (Login/Register vs. user avatar+dropdown).

**Deliverable:** Fully data-driven, animated, responsive Homepage.

## Phase 4 — Property Listing Page (Real Data)
- Filter sidebar/top-bar now serializes to query params sent to `GET /api/properties` (BHK as the single bedroom filter, per `rules.md`).
- Sort dropdown, Grid/List/Map view toggle (Map still static/dummy embed, multi-pin from real filtered results).
- Server-side pagination.
- Loading/error/empty states (empty = "No properties match your filters" + Reset).
- Compare (client-side `CompareContext`, unchanged) and sticky mini filter bar.

**Deliverable:** Fully functional, DB-backed filtering/sorting/pagination.

## Phase 5 — Property Details, Favorites, Leads
- Property Details page against real data: gallery/lightbox, video/360 placeholders, EMI calculator, static map, nearby list, agent card, Similar Properties.
- Favorites: `GET/POST/DELETE /api/favorites`, `FavoritesContext` now backend-backed for logged-in users; guests prompted to log in.
- `ScheduleVisitModal` (property-specific) and global `BookVisitModal` both submit to `POST /api/leads` with a `type` field; Contact page and Newsletter signup do the same.
- Recently Viewed remains client-side `localStorage`, unaffected.
- Share icon (Web Share API / copy-link) — unchanged, client-side only.

**Deliverable:** A logged-in user can favorite a property, submit a Schedule Visit request, and see both persist (favorite survives refresh; lead appears in the DB).

## Phase 6 — Admin Panel
- `AdminRoute` guard; Admin Sidebar/Topbar layout (distinct from public-site chrome).
- Admin Dashboard: quick stats (`GET` aggregate counts).
- Properties/Projects/Agents management: list views (DataTable) + Create/Edit forms (including Cloudinary image upload via `POST /api/uploads/image`) + Delete with confirmation.
- Leads management: table of all leads, filter by type/status, status update (`PATCH /api/leads/:id`).
- Users management: list users, promote/demote role (`PATCH /api/users/:id/role`).
- Blog/Testimonials/FAQ basic CRUD.

**Deliverable:** An Admin can log in, add a new property with images, and see it appear live on the public site immediately; can view and action leads submitted by real users.

## Phase 7 — Supporting Pages & Profile
- Projects listing/details, Agents listing/details, About, Blog listing/post, Contact — all on real data.
- `/profile` page: edit name/phone/avatar, view own booking/lead history.
- 404 page (frontend) + consistent 404 JSON shape (backend) for invalid IDs/routes.

**Deliverable:** Full site navigation complete on real data; every link, icon, and route resolves correctly for every role.

## Phase 8 — Polish, Security & Performance Pass
- Cross-page consistency audit against `design.md`/`rules.md` checklists (public site + Admin Panel).
- Accessibility pass (contrast, alt text, focus states, `prefers-reduced-motion`).
- Security pass: confirm rate limiting, role checks on every admin route (test with non-admin tokens), no secrets in bundles/logs, input validation on every mutating endpoint.
- Performance pass: server-side pagination confirmed on all list endpoints, image lazy-loading, code-splitting, `backdrop-filter` fallback for glass surfaces, Prisma query review (avoid N+1s, add indexes on frequently filtered columns like `city`, `type`, `price`).
- Empty/error-state audit across every data-driven view, including Admin tables.

**Deliverable:** Production-quality, secure full-stack build ready to deploy.

## Phase 9 — Deployment
- Backend: deploy to Render/Railway/Fly.io; run `prisma migrate deploy`; set all production env vars/secrets.
- Database: provision managed Postgres (Supabase/Neon/Railway); confirm connection pooling if needed.
- Frontend: deploy to Vercel/Netlify with `VITE_API_BASE_URL` pointing at the live backend; confirm CORS is locked to the deployed frontend origin.
- Final QA: full auth flow, admin CRUD, lead submission, favorites — all tested against the live deployment, not just local dev.

**Deliverable:** Live, shareable, fully functional full-stack demo URL.
