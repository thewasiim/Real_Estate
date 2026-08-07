# Rules — Project Conventions & Constraints (Full-Stack)

These rules apply to anyone (human or AI assistant) working on this codebase. They exist to keep the project consistent, premium-quality, and secure now that it includes a real backend and database.

> **Scope change note:** This project was originally frontend-only (no backend, no DB, no real auth). It is now a full-stack application. Rules below replace the old "hard constraints" that forbade a backend/DB/auth — those are gone. New rules cover how the backend must behave instead.

## 1. Hard Constraints (Never Violate)
1. **Never store passwords in plaintext.** Always hash with `bcrypt` before persisting; never log raw passwords, tokens, or secrets.
2. **Never commit secrets.** `.env` files are git-ignored; `JWT_SECRET`, `DATABASE_URL`, Cloudinary keys, email provider keys live only in the deployment platform's secret manager and local `.env` (never in the repo, never in client-side code/bundles).
3. **Never trust client input.** Every mutating endpoint (`POST`/`PUT`/`PATCH`/`DELETE`) validates its request body server-side (zod/express-validator) before touching Prisma — regardless of what the frontend already validated.
4. **Never expose admin-only data or actions to non-admins.** Every admin route is protected by both `verifyToken` and `requireRole('ADMIN')` middleware — never rely on the frontend hiding a button as the only protection.
5. **Only Unsplash (or explicitly license-free) imagery** for seed/demo content; real uploaded images go through Cloudinary, never stored as binary blobs in Postgres.
6. **Never fabricate real people, companies, or reviews** in seed data. All agents, testimonials, builders, and clients in seed/demo data are clearly fictional placeholder personas.
7. **No payment processing.** This project explicitly excludes real payment/booking-fee collection — do not wire up Razorpay/Stripe or similar without a scope update.

## 2. Design/Style Rules (unchanged from the visual design system)
1. **[Updated]** Color palette restricted to: **white, black, Apple-style light/soft gray, and one accent color (`--color-accent`, Apple system blue).** The earlier soft-gold accent is retired — see `design.md` §2. No neon, no heavy gradients, bold black borders, hard offset drop-shadows, or sharp/blocky corners — the site is clean Apple-minimal end to end. The Admin Panel may use a simplified utilitarian variant of the same palette (see `design.md`).
2. Glassmorphism used **only** on: search bar, floating cards, modals — always with a `backdrop-filter` fallback for low-end devices.
3. Micro-interactions stay subtle and premium — `ease-out`, 200–500ms durations.
4. Typography: generous whitespace, restrained font weights (2 font families max).
5. Rounded corners + soft shadows, consistent radius scale.
6. Every public page retains the sticky Navbar and Footer; the Admin Panel uses its own dashboard chrome (sidebar + topbar), not the marketing Navbar/Footer.

## 3. Backend Code Conventions
1. **Layered structure:** routes → controllers → services → Prisma. Controllers handle req/res only; business logic lives in services, not inline in routes.
2. **One Prisma model per real-world entity** (`User`, `Property`, `Project`, `Agent`, `Lead`, `Favorite`, `Testimonial`, `BlogPost`, `FAQ`) — see `trd.md` §3 for the schema.
3. **Consistent API response shape:** `{ success: boolean, data?: any, error?: string }` across all endpoints, so the frontend's API client can handle responses uniformly.
4. **Pagination is server-side** for `/api/properties` (and any other list endpoint expected to grow) — never return the entire table and paginate client-side once real data exists.
5. **Migrations, not manual schema edits.** All schema changes go through `prisma migrate dev` (local) / `prisma migrate deploy` (production) — never hand-edit the production database.
6. **Seed data lives in `backend/prisma/seed.js`**, reusing the same fictional persona conventions as the old mock-data files (dummy properties/agents/testimonials, Unsplash images).

## 4. Frontend Code Conventions
1. **Component style:** functional components + hooks only. No class components.
2. **File naming:** PascalCase for components, camelCase for hooks/utils/api modules.
3. **All server communication goes through `src/api/*`** — components never call `fetch`/`axios` directly; this keeps auth-header/cookie handling and error shape centralized.
4. **No prop-drilling more than 2 levels** — lift shared state (auth, filters, favorites, compare, recently-viewed) into Context instead.
5. **Loading, error, and empty states are all required** for any data-driven view — a list must handle "loading," "failed to load," and "loaded but empty" as three distinct, designed states (not just loading → data).
6. **Protected routes** (`/favorites`, `/profile`, `/admin/*`) are wrapped in `<ProtectedRoute>`/`<AdminRoute>` — never gated only by conditionally hiding a nav link.
7. **Accessibility is not optional:** every interactive element needs a keyboard path and accessible name; every `<img>` needs `alt`.
8. **Routing:** all internal navigation via `<Link>`/`useNavigate` — never raw `<a href>` for internal routes.

## 5. UX Consistency Rules (carried over from the frontend-only version)
1. **BHK is the single bedroom-count filter** — no duplicate "Bedrooms" filter control.
2. **Two distinct visit CTAs, never interchangeable:** global "Book Site Visit" (no property context) vs. property-specific "Schedule Visit" (pre-filled, date/time picker) — both now create real `Lead` rows via `POST /api/leads` with a `type` field distinguishing them.
3. **Every icon needs a real destination or action** — favorite routes to real, DB-backed favorites; share uses Web Share API/copy-link.
4. **Every list needs an explicit empty state**, including admin tables (e.g., "No leads yet").
5. **Currency/units are locale-consistent** — India/INR, Lakh/Crore formatting via `formatCurrency.js`, applied identically on the public site and in the Admin Panel.

## 6. Security & Auth Rules
1. Access tokens are short-lived; prefer httpOnly cookies over `localStorage` for token storage to reduce XSS exposure.
2. Rate-limit `/api/auth/login`, `/api/auth/register`, and `/api/leads` to deter brute-force and spam submissions.
3. CORS is locked to the deployed frontend origin(s) — never `origin: '*'` once real user data exists.
4. Role checks happen server-side on every request, not just at login time — a demoted user's existing token must fail subsequent admin-route checks (short token expiry + role re-check on each protected request achieves this).
5. Log authentication failures and admin actions (created/updated/deleted records) for basic auditability — without logging sensitive payloads (passwords, tokens).

## 7. Git & Process Rules
1. Conventional commits (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`).
2. Backend and frontend can be versioned in one monorepo (`/frontend`, `/backend`) or two repos — pick one in Phase 0 and document it in `trd.md`.
3. Each phase in `phases.md` should correspond to a mergeable, demoable milestone across both frontend and backend — avoid a frontend feature landing with no backend support (or vice versa).
4. Any deviation from `design.md`/`architecture.md` is called out explicitly, not silently introduced.

## 8. Review Checklist (before calling any feature "done")
- [ ] Responsive at 320px, 375px, 768px, 1024px, 1440px+
- [ ] Loading / error / empty states all implemented for any data-driven view
- [ ] All new API routes validate input server-side and return the standard response shape
- [ ] Admin-only routes verified to reject non-admin tokens (test with a regular user token, not just "no token")
- [ ] Passwords/secrets never appear in logs, error messages, or client bundles
- [ ] No console errors/warnings on either frontend or backend
- [ ] Palette compliance (no stray colors outside the approved set)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Every icon (favorite, share, compare) has a working destination or action
- [ ] Invalid routes/IDs resolve to a proper 404 (frontend) / 404 JSON response (backend), never a crash
