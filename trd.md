# TRD — Technical Requirements Document (Full-Stack)

## 1. Technology Stack

### Frontend
| Layer | Choice | Notes |
|---|---|---|
| Build tool | Vite | Fast dev server, ESM-native |
| Framework | React 18 | Functional components + hooks |
| Routing | React Router v6 | Public, protected (`ProtectedRoute`), and admin (`AdminRoute`) routes |
| Styling | Tailwind CSS 3.x | Utility-first; custom theme extends design tokens |
| Animation | Framer Motion | Scroll-reveal, hover, modal transitions, counters (public site only) |
| Icons | lucide-react | Consistent single icon set, public + admin |
| API client | Axios | Central instance with `withCredentials: true`, response/error interceptors |
| Carousel | `embla-carousel-react` or `swiper` | Testimonials, Similar Properties |
| Lightbox | `yet-another-react-lightbox` or custom modal gallery | Property image gallery |
| Forms | Native controlled inputs (+ `react-hook-form` optional for Admin forms with many fields) | Now submits to real endpoints |
| State | React Context + `useReducer` | Auth, Filters, Favorites, Compare, Recently Viewed |
| Linting/Formatting | ESLint + Prettier | Standard React + Tailwind plugin |
| Deployment | Vercel / Netlify | Static build output (`dist/`) |

### Backend
| Layer | Choice | Notes |
|---|---|---|
| Runtime | Node.js LTS | |
| Framework | Express.js | REST API |
| ORM | Prisma | Schema-first, migrations, type-safe client |
| Database | PostgreSQL | Managed instance (Supabase/Neon/Railway) |
| Auth | `jsonwebtoken` + `bcrypt` | JWT (httpOnly cookie) + password hashing |
| Validation | `zod` | Request body/query schemas per route |
| File upload | `multer` (memory) + Cloudinary SDK | Property/agent images |
| Security middleware | `helmet`, `cors`, `express-rate-limit` | Locked CORS origin, rate-limited auth/lead routes |
| Email (optional) | Resend or Nodemailer + SMTP | Booking confirmations, password reset |
| Deployment | Render / Railway / Fly.io | Node service, env-var secrets |

## 2. Environment & Setup
- Node.js LTS (18+) for both frontend and backend.
- **Frontend:** `npm create vite@latest` (React template) → Tailwind per official guide. Env var: `VITE_API_BASE_URL` (points to backend, e.g. `http://localhost:4000/api` in dev).
- **Backend:** `npm init` → Express, Prisma, bcrypt, jsonwebtoken, zod, multer, cloudinary, helmet, cors, express-rate-limit, dotenv. `npx prisma init` to scaffold `schema.prisma`.
- **Backend `.env` (never committed):**
  ```
  DATABASE_URL=postgresql://user:pass@host:5432/dbname
  JWT_SECRET=...
  JWT_EXPIRES_IN=15m
  REFRESH_TOKEN_SECRET=...            # if using refresh-token strategy
  REFRESH_TOKEN_EXPIRES_IN=7d
  CLOUDINARY_CLOUD_NAME=...
  CLOUDINARY_API_KEY=...
  CLOUDINARY_API_SECRET=...
  CORS_ORIGIN=https://your-frontend-domain.com
  EMAIL_API_KEY=...                    # optional
  ```
- Local development: either point `DATABASE_URL` at a local Postgres instance, or use a free-tier managed Postgres (Supabase/Neon) from day one to avoid environment drift.

## 3. Database Schema (Prisma)

```prisma
// schema.prisma (core models — abbreviated for readability)

enum Role {
  USER
  AGENT
  ADMIN
}

enum ListingType {
  BUY
  RENT
}

enum LeadType {
  SCHEDULE_VISIT
  BOOK_SITE_VISIT
  CONTACT
  NEWSLETTER
}

enum LeadStatus {
  NEW
  CONTACTED
  CLOSED
}

model User {
  id            String     @id @default(uuid())
  name          String
  email         String     @unique
  passwordHash  String
  phone         String?
  avatarUrl     String?
  role          Role       @default(USER)
  favorites     Favorite[]
  leads         Lead[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Property {
  id            String      @id @default(uuid())
  slug          String      @unique
  title         String
  type          String      // Apartment, Villa, Independent House, Commercial, Office, Shop, Plot
  listingType   ListingType
  status        String      // Ready to Move, Under Construction, etc.
  price         Int
  city          String
  locality      String
  address       String
  area          Int
  areaUnit      String      @default("sqft")
  bhk           Int
  bathrooms     Int
  parking       Int
  furnishing    String
  amenities     String[]
  images        String[]    // Cloudinary URLs
  floorPlans    String[]
  videoTourUrl  String?
  tourUrl360    String?
  description   String
  nearbySchools String[]
  nearbyHospitals String[]
  nearbyMetro   String[]
  lat           Float?
  lng           Float?
  isFeatured    Boolean     @default(false)
  popularityScore Int       @default(0)
  agentId       String?
  agent         Agent?      @relation(fields: [agentId], references: [id])
  favorites     Favorite[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Project {
  id             String   @id @default(uuid())
  slug           String   @unique
  name           String
  builder        String
  startingPrice  Int
  possessionDate DateTime
  city           String
  locality       String
  images         String[]
  description    String
  amenities      String[]
  unitTypes      String[]
  statusStage    String   // Under Construction | RERA Approved | Nearing Possession | Ready
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Agent {
  id              String     @id @default(uuid())
  name            String
  photoUrl        String
  phone           String
  whatsapp        String
  email           String
  role            String     // e.g. "Senior Property Consultant"
  city            String
  experienceYears Int
  properties      Property[]
  createdAt       DateTime   @default(now())
}

model Favorite {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
  createdAt  DateTime @default(now())

  @@unique([userId, propertyId])
}

model Lead {
  id          String     @id @default(uuid())
  type        LeadType
  name        String
  email       String
  phone       String
  message     String?
  propertyId  String?    // set for SCHEDULE_VISIT
  preferredDate DateTime?
  preferredTime String?
  status      LeadStatus @default(NEW)
  userId      String?    // set if submitted by a logged-in user
  user        User?      @relation(fields: [userId], references: [id])
  createdAt   DateTime   @default(now())
}

model Testimonial {
  id       String @id @default(uuid())
  name     String
  photoUrl String
  rating   Int
  review   String
}

model BlogPost {
  id       String   @id @default(uuid())
  slug     String   @unique
  title    String
  coverUrl String
  excerpt  String
  content  String
  author   String
  date     DateTime @default(now())
}

model FAQ {
  id       String @id @default(uuid())
  question String
  answer   String
}
```

> **Note on BHK:** `bhk` is the single stored/filterable bedroom-count field — there is intentionally no separate `bedrooms` column, closing the earlier redundancy for good at the schema level (see `rules.md` §5.1).

## 4. API Specification (selected endpoints)

### Auth
```
POST /api/auth/register
Body: { name, email, password, phone? }
→ 201 { success: true, data: { user } }   // sets httpOnly auth cookie

POST /api/auth/login
Body: { email, password }
→ 200 { success: true, data: { user } }   // sets httpOnly auth cookie

POST /api/auth/logout
→ 200 { success: true }                   // clears cookie

GET /api/auth/me
Headers: cookie
→ 200 { success: true, data: { user } } | 401 { success: false, error: "Not authenticated" }
```

### Properties
```
GET /api/properties?listingType=BUY&city=Mumbai&bhk=3&minPrice=&maxPrice=&type=&furnishing=&readyToMove=&amenities=Pool,Gym&sort=price_asc&page=1&limit=12
→ 200 { success: true, data: { items: Property[], total, page, totalPages } }

GET /api/properties/:id
→ 200 { success: true, data: Property } | 404 { success: false, error: "Property not found" }

POST /api/properties        (Admin)
PUT  /api/properties/:id    (Admin)
DELETE /api/properties/:id  (Admin)
```

### Favorites
```
GET /api/favorites                    (Authenticated) → Property[]
POST /api/favorites { propertyId }    (Authenticated) → Favorite
DELETE /api/favorites/:propertyId     (Authenticated) → { success: true }
```

### Leads
```
POST /api/leads
Body: { type: "SCHEDULE_VISIT" | "BOOK_SITE_VISIT" | "CONTACT" | "NEWSLETTER",
        name, email, phone, message?, propertyId?, preferredDate?, preferredTime? }
→ 201 { success: true, data: { lead } }

GET /api/leads?type=&status=&page=&limit=       (Admin)
PATCH /api/leads/:id  { status }                (Admin)
```

### Users (Admin)
```
GET /api/users?role=&page=&limit=
PATCH /api/users/:id/role  { role: "USER" | "AGENT" | "ADMIN" }
```

### Uploads
```
POST /api/uploads/image   (Admin, multipart/form-data, field "image")
→ 200 { success: true, data: { url } }   // Cloudinary secure_url
```

All list endpoints return the shared pagination shape `{ items, total, page, totalPages }`. All endpoints return the shared envelope `{ success, data? , error? }`.

## 5. Key Functional Implementations

### 5.1 Auth Flow
1. `POST /api/auth/register` — validate body (zod), check email uniqueness, hash password with `bcrypt.hash(password, 10)`, create `User`, sign a JWT (`jsonwebtoken.sign({ userId, role }, JWT_SECRET, { expiresIn: '15m' })`), set as `httpOnly`, `secure`, `sameSite: 'lax'` cookie.
2. `POST /api/auth/login` — verify email exists, `bcrypt.compare(password, user.passwordHash)`, sign + set cookie same as above.
3. `GET /api/auth/me` — `verifyToken` middleware reads cookie, verifies JWT, attaches `req.user`, controller returns the current user (id, name, email, role — never `passwordHash`).
4. `POST /api/auth/logout` — clears the cookie.
5. **Refresh strategy (decide in Phase 0/1):** either (a) a longer-lived httpOnly refresh cookie + `POST /api/auth/refresh` to reissue access tokens, or (b) a single moderately-lived session cookie (e.g. 7 days) if refresh-token complexity isn't justified at this scale. Document the chosen approach here once decided.

### 5.2 Middleware
```js
// verifyToken
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

// requireRole
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
  };
}
```

### 5.3 Property Filtering (server-side, Prisma)
`buildPropertyWhereClause(queryParams)` translates query params into a Prisma `where` object (listingType, city, locality, type, price range via `gte`/`lte`, `bhk`, bathrooms, area range, furnishing, `status: 'Ready to Move'` toggle, `amenities: { hasEvery: [...] }`). Combined with `orderBy` for sort (`price_asc`/`price_desc`/`createdAt desc`/`popularityScore desc`) and `skip`/`take` for pagination. Zero-result queries return an empty `items` array with `total: 0` — the frontend renders the shared `<EmptyState />`.

### 5.4 EMI Calculator (unchanged, still client-side)
```
EMI = [P × r × (1+r)^n] / [(1+r)^n − 1]
```
`P` = principal (price − down payment), `r` = monthly interest rate, `n` = tenure in months. Purely a frontend utility (`emiCalculator.js`) — no backend involvement, since it's just arithmetic on values the user enters.

### 5.5 Image Upload
1. Admin selects image(s) in the property/project/agent form.
2. Frontend `POST /api/uploads/image` (multipart) per file, or a batch endpoint if preferred.
3. Backend: `multer` receives file in memory → streams buffer to Cloudinary via SDK → returns `secure_url`.
4. Frontend stores the returned URL(s) in the property/project/agent form state, submitted as part of the create/update payload (`images: string[]`).

### 5.6 Leads (Schedule Visit / Book Site Visit / Contact / Newsletter)
Single `POST /api/leads` endpoint differentiated by `type`. Validation schema varies slightly by type (e.g., `SCHEDULE_VISIT` requires `propertyId` + `preferredDate`/`preferredTime`; `NEWSLETTER` only requires `email`). If `req.user` exists (logged in), `userId` is attached automatically; guests can still submit leads without an account. On success, optionally trigger a confirmation email (stretch) and always return `{ success: true }` so the frontend can show its existing success-state UI.

### 5.7 Favorites
`GET/POST/DELETE /api/favorites` — all scoped to `req.user.id` via `verifyToken`. `FavoritesContext` on the frontend calls these instead of reading `localStorage` directly for logged-in users; for a logged-out visitor, clicking the heart icon opens the login/register prompt instead of hitting the API.

### 5.8 Recently Viewed & Compare (unchanged — still client-only)
`RecentlyViewedContext` and `CompareContext` remain `localStorage`-backed exactly as in the frontend-only version; they don't need server persistence for this scope.

### 5.9 Share
Unchanged — `navigator.share` with copy-link fallback, entirely client-side.

### 5.10 404 / Not Found Handling
- **Frontend:** catch-all `<Route path="*" element={<NotFound />} />`; `PropertyDetails`/`ProjectDetails`/`AgentDetails` render `<NotFound />` when the API returns 404 for the requested `:id`.
- **Backend:** a final Express middleware returns `{ success: false, error: 'Not found' }` with status 404 for unmatched routes; a global `errorHandler` middleware catches thrown errors and returns a consistent `{ success: false, error }` shape (never leaking stack traces in production).

## 6. Map & Media Placeholders (unchanged from frontend-only scope)
- **Map (Property Details):** non-keyed `<iframe>` (OpenStreetMap) or styled static image for a fixed/dummy location derived from the property's `lat`/`lng`.
- **Map (Listing — Map view):** same static/no-key approach, rendering multiple pins from the current page's `items` (using each property's `lat`/`lng` mapped to marker positions).
- **Video tour / 360° tour:** placeholder card with play-icon overlay → modal with a muted sample clip or "Coming soon" state.

## 7. Non-Functional Requirements
- **Performance:** server-side pagination on all list endpoints; Prisma query review to avoid N+1s (`include`/`select` scoping); indexes on `Property.city`, `Property.type`, `Property.price`, `Property.bhk` for filter performance; frontend route-level code splitting, image lazy-loading, `backdrop-filter` fallback.
- **Accessibility:** WCAG 2.1 AA target for contrast; full keyboard operability; ARIA roles on modals/accordions/carousels/data tables; `prefers-reduced-motion` respected.
- **Security:** see `architecture.md` §8 and `rules.md` §6 — bcrypt hashing, httpOnly JWT cookie, server-side role checks, input validation, rate limiting, locked CORS, no secrets in bundles/logs.
- **Browser support:** latest 2 versions of Chrome, Firefox, Safari, Edge; iOS Safari + Android Chrome.
- **SEO (frontend, static-level):** semantic headings, descriptive `<title>`/meta per route.
- **Locale/currency:** India/INR, Lakh/Crore formatting via `formatCurrency.js`, applied identically across public site and Admin Panel.

## 8. Open Technical Decisions (finalize during Phase 0/1)
- **Token strategy:** single session cookie vs. access+refresh token pair — pick one and document the final choice here.
- Carousel library choice (Embla vs Swiper).
- Lightbox library vs custom modal gallery.
- Whether `react-hook-form` is used for Admin forms (many fields) even if public-site forms stay native-controlled.
- Monorepo (`/frontend`, `/backend` in one repo) vs. two separate repos.
- Whether email notifications (booking confirmation, password reset) ship in MVP (Phase 5/6) or are deferred as stretch.
- Managed Postgres provider choice (Supabase vs. Neon vs. Railway) — affects connection-pooling setup.
- Date/time picker for `ScheduleVisitModal`: custom vs. small library.
