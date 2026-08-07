# PRD — Luxury Real Estate Web Application (Full-Stack)

## 1. Overview
A premium, fully responsive **dynamic web application** for luxury real estate — React frontend, Node.js/Express backend, PostgreSQL database, and real JWT-based authentication. Properties, projects, agents, bookings, favorites, and leads are all persisted in a real database and managed through real APIs. An **Admin Panel** allows authorized staff to manage listings, leads, and users.

This supersedes the earlier frontend-only version of this project. Anywhere older docs said "no backend / no database / no real auth," that constraint is now removed.

## 2. Goals
- Ship a real, usable property portal: visitors browse live data from the database; registered users save favorites and track bookings; agents/admins manage listings.
- Real authentication with roles: **Visitor (guest)**, **User (registered)**, **Agent**, **Admin**.
- Real lead capture: Schedule Visit, Book Site Visit, Contact, and Newsletter forms persist to the database and (optionally) trigger email notifications.
- Admin Panel for full CRUD on properties, projects, agents, and leads.
- Maintain the premium design language (Apple-minimalism + minimal luxury + glassmorphism + micro-interactions) across all new dynamic screens, including the Admin Panel.
- Fully responsive, accessible, secure, and production-deployable (frontend + backend + database as separate deployable services).

## 3. Non-Goals (still out of scope)
- Payment processing / booking-fee collection (no Razorpay/Stripe integration in this phase).
- Real-time chat or push notifications.
- Third-party CRM integration.
- Multi-tenant / multi-agency support (single agency/brand for now).
- Mobile native apps (web-responsive only).

## 4. Target Users (Personas & Roles)
- **Guest/Visitor** — browses properties/projects, uses filters, views details; cannot save favorites or book without registering (or can as a guest lead, TBD in Phase design).
- **Registered User** — everything a guest can do, plus: save favorites, view booking/visit history, manage profile.
- **Agent** — has a public profile; can be assigned to properties; (stretch) can view leads assigned to them via a lightweight agent dashboard.
- **Admin** — full CRUD on properties, projects, agents, blog posts, FAQs, testimonials; views and manages all leads/bookings; manages user roles.

## 5. Scope — Pages & Features

### 5.1 Global (unchanged from design, now backed by real data)
- Sticky Navbar, Footer — same as before, but Login/Register now perform **real** authentication; a logged-in user sees their name/avatar and a dropdown (Profile, Favorites, Logout).

### 5.2 Public Site (Homepage, Listing, Details, Projects, Agents, Blog, About, Contact)
- Same UX/design as previously scoped, but **all data is fetched from the backend API**, not local JSON — properties, projects, agents, testimonials, blog posts, and FAQs are stored in and served from the database.
- Search bar, filters, sort, and pagination on `/properties` now hit a real `GET /api/properties` endpoint with query params, not client-side array filtering.
- Favorites (heart icon) require login; if a guest clicks favorite, prompt to log in/register.
- Compare and Recently Viewed can remain client-side (`localStorage`) for guests, and sync to the user's account once logged in (stretch goal).
- Schedule Visit, Book Site Visit, Contact, and Newsletter forms submit to real API endpoints and persist as **Lead** records; show a real success/error state based on the API response.

### 5.3 Authentication
- **Register** — name, email, password (hashed with bcrypt), phone; creates a `User` record with role `USER`.
- **Login** — email + password → JWT access token (+ refresh token strategy) stored via httpOnly cookie (preferred) or secure client storage.
- **Logout** — clears session/token.
- **Forgot/Reset Password** (stretch) — email-based reset flow.
- **Protected routes:** `/favorites`, `/profile`, `/admin/*` require authentication; `/admin/*` additionally requires `role = ADMIN`.

### 5.4 User Profile (`/profile`)
- View/edit name, phone, avatar (optional upload).
- View booking/visit request history (their own Leads).
- View saved Favorites (same page as before, now DB-backed).

### 5.5 Admin Panel (`/admin`, protected)
- **Dashboard** — quick stats (total properties, total leads this week, total users) — reuses the "animated stats counter" visual language from the homepage.
- **Properties management** — table/list view, Create/Edit/Delete property (multi-image upload, amenities checklist, all fields from the Property schema).
- **Projects management** — same CRUD pattern.
- **Agents management** — CRUD, assign agents to properties.
- **Leads management** — table of all Schedule Visit / Book Site Visit / Contact submissions, with status (New, Contacted, Closed), filterable by type/date.
- **Users management** — list users, change role (promote to Agent/Admin), deactivate account.
- **Blog / Testimonials / FAQ management** — basic CRUD for content sections.
- Admin Panel follows the same visual system (`design.md`) but as a utilitarian dashboard layout — data tables, forms, and a left-side navigation instead of the marketing-site chrome.

## 6. Data Model (Real, Persisted)
Now defined as a relational schema (PostgreSQL via Prisma). See `trd.md` §3 for full schema: `User`, `Property`, `Project`, `Agent`, `Lead`, `Favorite`, `Testimonial`, `BlogPost`, `FAQ`.

## 7. Success Criteria
- All public pages read real data from the API; no more hardcoded JSON in the frontend.
- Full auth flow works: register → login → session persists across refresh → logout.
- Admin can create a property in the Admin Panel and see it appear live on `/properties` and the homepage without a redeploy.
- All lead forms (Schedule Visit, Book Site Visit, Contact) create real `Lead` rows visible in the Admin Panel.
- Passwords are never stored in plaintext; JWT/session handling follows standard security practice (see `rules.md`).
- Lighthouse: Performance ≥ 80, Accessibility ≥ 95, Best Practices ≥ 90 (slightly relaxed performance target vs. the static version, due to real network calls).

## 8. Constraints
- Frontend: React + Tailwind CSS + Framer Motion + React Router.
- Backend: Node.js + Express, REST API.
- Database: PostgreSQL, accessed via Prisma ORM.
- Auth: JWT-based, bcrypt password hashing.
- Image storage: Cloudinary (or equivalent) — not stored as binary blobs in the DB.
- Frontend and backend are deployed as separate services (frontend: Vercel/Netlify; backend: Render/Railway; DB: managed Postgres, e.g. Supabase/Neon/Railway).

## 9. Assumptions
- Single brand/agency; no multi-tenancy.
- Email sending (booking confirmations, password reset) is optional/stretch — can be stubbed/logged in early phases and wired to a real provider (e.g., Resend/SendGrid) later.
- Locale = India, currency = INR, Lakh/Crore formatting (unchanged from the frontend-only version).
- Existing frontend-only design system (`design.md`) carries over; only new backend-driven behavior and the Admin Panel are additive.

## 10. Out of Scope / Future Considerations
- Payments/booking fees.
- Multi-agency/marketplace model.
- Real-time notifications, chat, or CRM sync.
- Advanced analytics dashboard beyond basic admin stats.
- Native mobile apps.
