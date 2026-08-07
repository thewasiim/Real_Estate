# Design System — Luxury Real Estate Website

## 1. Design Philosophy (Blend Ratio) — UPDATED
- **55% Apple-inspired minimalism** — clean typography, large imagery, smooth scroll, generous whitespace, restrained UI chrome. This is the dominant style across the entire site.
- **20% Minimal luxury** — black/white/gray editorial layout (asymmetric grids, confident negative space). The soft-gold luxury accent is retired in favor of the new Apple-style accent color (§2).
- **15% Glassmorphism** — used sparingly, only on the search bar, floating cards, and modals.
- **10% Micro-interactions** — hover zoom on images, card elevation on hover, animated counters, scroll-reveal via Framer Motion.

> **Style note:** The site is clean Apple-style only. The color and typography system in §2 and §3 remains the foundation throughout.

## 2. Color Palette — Apple-style, minimal
| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Primary background |
| `--color-bg-alt` | `#F5F5F7` (Apple's signature light gray) | Section alternation |
| `--color-ink` | `#1D1D1F` (Apple near-black) | Primary text/headings |
| `--color-ink-muted` | `#6E6E73` (Apple secondary gray) | Secondary/body text |
| `--color-border` | `#D2D2D7` | Card borders, dividers |
| `--color-accent` | `#0071E3` (Apple system blue) | The single accent color: primary buttons, links, active states, focus rings, badges |
| `--color-accent-soft` | `#0071E3` at 8–12% opacity | Subtle backgrounds/highlights |
| `--color-glass-bg` | `rgba(255,255,255,0.6)` | Glassmorphic surfaces |
| `--color-glass-border` | `rgba(255,255,255,0.4)` | Glass edge |

**Rules:** No neon, no heavy gradients, bold black borders, hard offset drop-shadows, or blocky sharp-cornered elements — the site is clean Apple-minimal end to end. Gold is gone — `--color-accent` (blue) is the only color accent, used the same way gold used to be: never a dominant fill, always a highlight. Dark sections (e.g. footer) use `--color-ink` background with white text, blue accent line. All corners use the existing soft radius scale (§5) — nothing goes to a `0` sharp corner.

## 3. Typography — Apple-style
- **Display/Headings font:** the Apple system font stack — `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif`. On Apple devices this renders actual SF Pro; everywhere else it falls back to "Inter" (self-hosted or Google Fonts), which is the closest free-license match to SF Pro's proportions and legibility. Drop the earlier serif/"Playfair Display" display treatment entirely — no serif anywhere in the system now.
- **Body font:** same stack as headings (`-apple-system, ... "Inter", ...`) — Apple's own sites use one consistent type family across display and body, not two separate fonts. Keep body weight at 400, headings at 600–800.
- **Scale (example, rem-based):**
  - H1 (hero): 3.5–6rem, tight/negative tracking (-0.02em to -0.04em, Apple's hallmark tight kerning on large type), font-weight 600–700
  - H2 (section titles): 2.5–3.25rem, tight tracking
  - H3 (card titles): 1.25–1.5rem, font-weight 600
  - Body: 1rem–1.0625rem, 1.5–1.6 line-height, font-weight 400
  - Small/meta: 0.875rem
- Generous letter-spacing on eyebrow/label text (uppercase, small, `--color-ink-muted` or `--color-accent`).

## 4. Spacing & Layout
- Base spacing unit: 4px scale (Tailwind default) but sections use large multiples — section vertical padding: 96–140px desktop, 56–72px mobile.
- Max content width: ~1280–1440px container, centered, with responsive gutters (24px mobile, 40–64px desktop).
- Editorial asymmetry allowed in "Why Choose Us" / "About" style sections (e.g., 60/40 image-text split) — but grids (properties, categories, amenities) stay clean and aligned.

## 5. Radius, Shadow & Elevation
- Radius scale: `--radius-sm: 8px`, `--radius-md: 16px`, `--radius-lg: 24px` (cards/images), `--radius-full` for pills/badges/avatars.
- Shadow scale:
  - Resting card: soft, low-opacity (`0 4px 20px rgba(0,0,0,0.06)`)
  - Hover/elevated: slightly larger + slightly darker (`0 12px 32px rgba(0,0,0,0.12)`), paired with a small `translateY(-4px)` and image scale (`scale(1.04–1.08)`).

## 6. Glassmorphism Usage (Restricted)
Applies **only** to:
1. Homepage search bar (over hero image)
2. Floating cards (e.g., stat chips floating over hero/gallery imagery)
3. Modals (Schedule Visit, Login/Register, Lightbox chrome)

Glass recipe: `background: var(--color-glass-bg); backdrop-filter: blur(16–20px); border: 1px solid var(--color-glass-border); box-shadow: 0 8px 32px rgba(0,0,0,0.08);`

**Fallback (fix):** wrap the blur in `@supports (backdrop-filter: blur(1px))`; when unsupported (or on low-end mobile where it's throttled), fall back to a higher-opacity solid `--color-bg` background with the same border/shadow so the surface stays legible without the blur cost.

Never apply glass to: navbar in solid state, standard property cards, section backgrounds, footer.

Modals using glass: Schedule Visit (property-specific), Book Site Visit (global), Login/Register, Lightbox chrome. Compare table and Contact form use a solid modal surface, not glass, to keep dense data legible.

## 7. Iconography
- Single icon family throughout (lucide-react) — consistent stroke width (~1.5–1.75px).
- Category/amenity icons sit inside a soft circular or rounded-square tile (`--color-bg-alt` background, accent icon or ink icon on hover).

## 8. Imagery
- Unsplash source, consistent color grading preference (warm-neutral, editorial real-estate/architecture tone).
- Hero images: full-bleed, subtle dark gradient overlay at bottom only (for text legibility) — not a heavy gradient across the whole image.
- Card images: fixed aspect ratio (e.g., 4:3 or 16:10), `object-fit: cover`, rounded corners matching card radius, zoom-on-hover contained via `overflow-hidden`.

## 9. Navbar Behavior
- **Over hero (top of Home):** transparent background, white/light text and icons, no shadow.
- **Fix — guaranteed legibility over hero:** since white nav text assumes a sufficiently dark hero image, apply a consistent subtle top-to-transparent dark gradient overlay (e.g., `rgba(0,0,0,0.35)` fading to `0` by ~200px down) behind the navbar on every hero image, regardless of the underlying photo's own brightness — never rely on the photo alone for contrast.
- **On scroll (any page, or non-hero pages by default):** solid white background, ink-colored text, `--radius` unaffected, subtle bottom shadow, smooth 250–350ms transition (background-color + box-shadow + text color).
- "Book Site Visit" (global, no property context) is always styled as the primary accent/ink filled CTA in the navbar, distinct from nav links and visually distinct from the property-specific "Schedule Visit" button used on Property Details pages, so the two never look like the same action.

## 10. Buttons & CTAs
- **Primary:** solid `--color-ink` (or `--color-accent` on dark backgrounds) background, white text, rounded (`--radius-full` or `--radius-md`), subtle hover darken + slight lift.
- **Secondary/Outline:** 1px `--color-border` or ink border, transparent background, fills or inverts on hover.
- **Ghost/text links:** underline-on-hover with accent-colored underline.

## 11. Cards (Property/Project/Agent/Blog)
- White surface, `--radius-lg`, soft shadow, image on top (rounded top corners), content padding 20–24px.
- Property card content order: image (with status badge top-left, favorite+share icons top-right, small "Compare" checkbox bottom-left of image on hover/focus) → title/name → location (with pin icon) → price (bold, accent or ink highlight) → meta row (area, BHK, beds, baths, parking as icon+label chips — **BHK only, no separate bedroom count chip**) → "View Details" button/link.
- Hover: image scale-up (contained), card lift + shadow increase, "View Details" affordance becomes more prominent (e.g., arrow slide-in).
- Project cards additionally include a slim possession **status timeline** bar (Under Construction → RERA Approved → Nearing Possession → Ready) beneath the price row, using ink for completed steps and `--color-border` for upcoming ones, current step marked in `--color-accent`.

### 11a. Empty States (new)
- Centered layout: simple line-art icon (ink, ~64–96px) → short headline ("No properties match your filters") → one muted supporting line → a single primary action button (e.g., "Reset Filters" / "Explore Properties"). Keeps the restrained, editorial tone — no illustration clutter, no color outside the palette.

### 11b. Compare Table (new)
- Solid white surface (not glass), `--radius-md`, appears as a modal or slide-up panel. Sticky first column (property thumbnail + name), remaining columns per compared property. Differing values may be subtly highlighted with `--color-accent-soft` background to aid scanning.

## 12. Motion Guidelines

### 12.1 Core rules (apply to everything below)
- **Scroll-reveal (base pattern, used throughout):** fade + slight translateY (16–24px), staggered by 60–100ms for grouped items, trigger via `whileInView`, `viewport={{ once: true }}`. This is the shared `<Reveal>` wrapper referenced in `architecture.md` §7 — every section-entrance animation in this doc builds on it.
- **Counters (base pattern):** animate from 0 to target over ~1.2–1.6s using an ease-out curve when the section first enters view.
- Respect `prefers-reduced-motion: reduce` globally — disable non-essential transforms, keep only opacity fades.
- Every animation stays subtle and premium — `ease-out`/`ease-in-out`, 200–600ms durations. Nothing bouncy, cartoonish, or attention-grabbing for its own sake.
- Motion should always communicate something (hierarchy, feedback, continuity) — never decorative motion with no purpose.

### 12.2 Hero & Navigation
- **Parallax hero image:** hero image scrolls slightly slower than the text/content on top of it (~10–15% offset), giving subtle depth. Framer Motion `useScroll` + `useTransform`.
- **Hero text reveal on load:** heading fades up word-by-word or line-by-line on initial page load (staggered ~80–120ms per unit) — not letter-by-letter (too slow/gimmicky at this scale).
- **Magnetic buttons (desktop only):** primary hero/CTA buttons shift a few px toward the cursor as it approaches, snapping back on mouse-leave. Skip entirely on touch devices.
- **Navbar link underline:** on hover, an underline slides in from the left rather than appearing instantly (`scaleX` transform, `transform-origin: left`).

### 12.3 Property/Project/Agent Cards & Grids
- **Staggered grid entrance:** on `/properties`, `/projects`, `/agents`, and Homepage grid sections, cards fade + translateY-up in a staggered sequence (50–80ms per card) as the grid enters view or after a filter/sort change — not all at once.
- **Image crossfade on hover:** if a property has multiple images, hovering the card crossfades from the primary image to a secondary one (arms 300–400ms crossfade); reverts on mouse-leave. Skip on touch (no hover state) — tap instead opens the gallery.
- **Smooth filter/sort transitions:** when filters or sort order change, outgoing cards fade out and incoming cards fade in with a layout-aware transition (Framer Motion `layout` + `AnimatePresence`) rather than an abrupt re-render/jump.
- **Price/stat number count-up:** price values (and the homepage stats counters) animate from 0 to the actual value over ~0.8–1.2s using an ease-out curve when they first enter view — already covered for stats counters; extend the same pattern lightly to price displays on card hover or detail-page load.

### 12.4 Scroll-Based
- **Scroll-linked image scale (Ken Burns):** large hero/gallery images slowly scale (1.0 → 1.05–1.08) as the user scrolls past them, for a subtle cinematic feel — same technique as the hero, reused in the Property Details gallery.
- **Sticky icon-grid reveal:** in "Why Choose Us," "Premium Amenities," and "Property Categories" sections, icons reveal one-by-one (staggered) as the section crosses into view, rather than all appearing at once.
- **Scroll progress indicator (Property Details only):** a thin fixed progress bar at the very top of the viewport fills as the user scrolls through Gallery → Description → Amenities → Floor Plan → EMI → Map → Similar Properties, giving a sense of how much content remains.

### 12.5 Interactive Elements
- **EMI calculator live chart:** as the user adjusts loan amount/rate/tenure sliders, a small donut or bar chart (principal vs. interest split) animates its transition to the new values in real time rather than snapping.
- **Favorite (heart) icon:** on click, a quick scale-bounce (e.g. `1 → 1.3 → 1`) plus a brief radiating pulse/particle burst around the icon — similar to the like-button pattern on Instagram/Twitter. Keep the bounce fast (~250–350ms total) so it doesn't feel sluggish.
- **Compare bar:** when a property is added to Compare, the floating `CompareBar` slides up smoothly from the bottom edge (if not already visible); each newly added item gets a small bounce/pop-in animation within the bar.
- **Map pin drop (Listing → Map view):** when the map view loads, pins drop in one-by-one (staggered ~40–60ms), rather than all appearing simultaneously.

### 12.6 Page & Modal Transitions
- **Route transitions:** page changes (React Router) use a subtle crossfade or slight slide (200–300ms) between pages via Framer Motion's `AnimatePresence` wrapping the route outlet — never a hard, jarring cut.
- **Modals:** fade + scale-in (0.95 → 1), backdrop fade — unchanged from the base rule.
- **Image gallery lightbox:** opening/closing animates a scale+fade from the clicked thumbnail's position outward (a "shared element" feel), rather than the lightbox just appearing centered with no visual link to what was clicked.
- **Carousel/slider transitions** (Testimonials, Similar Properties): ease-in-out, 400–600ms — unchanged from the base rule.

### 12.7 Loading States
- **Skeleton shimmer:** loading skeletons use a subtle left-to-right shimmer gradient sweep (instead of a static flat gray block) to read as "actively loading" rather than broken/empty.

## 13. Responsive Breakpoints (Tailwind defaults, mobile-first)
- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.
- Nav collapses to a hamburger/drawer below `lg`.
- Property grids: 1 col (mobile) → 2 col (`md`) → 3 col (`lg`) → 4 col optional at `xl` for dense sections.
- Filter sidebar (Listing page) becomes a top filter bar / slide-over drawer below `lg`.

## 14. Accessibility & Contrast
- Body text on white: minimum 4.5:1 contrast (near-black on white easily passes).
- Accent color never used as the sole carrier of meaning (always paired with icon/text/underline) to remain colorblind-safe.
- Focus states: visible 2px outline (ink or accent) on all interactive elements, never `outline: none` without a replacement.

## 15. Admin Panel Visual Language (new — full-stack scope)
The Admin Panel is a **utilitarian dashboard**, not a marketing surface — it borrows the same color tokens, radius scale, and type system, but drops glassmorphism, hero-style imagery, and heavy motion in favor of density and clarity.
- **Layout:** fixed left sidebar (nav: Dashboard, Properties, Projects, Agents, Leads, Users, Blog/Testimonials/FAQ) + topbar (admin name/avatar, logout) + main content area with a max-width data table or form.
- **Color:** same palette (white/black/soft gray/accent blue), but the accent color is used more functionally here — e.g., active sidebar item, primary "Save"/"Create" buttons, status badges (New = accent, Contacted = ink, Closed = muted gray).
- **Tables:** `--radius-md`, striped or bordered rows (`--color-border`), sticky header row, row-hover highlight (`--color-bg-alt`), inline action icons (edit/delete) using the same lucide-react set.
- **Forms (Create/Edit Property, etc.):** grouped into clear sections (Basic Info, Location, Pricing, Amenities, Media) with the same input styling as the public site's Schedule Visit/Contact forms — consistent radius, border, focus states.
- **Image upload:** drag-and-drop zone with thumbnail previews, upload progress indicator, delete-per-image control.
- **Motion:** minimal — simple fade/opacity transitions only (table refresh, modal open/close); no scroll-reveal, no hover-zoom theatrics. This is a workspace, not a showcase.

## 16. Auth-State Navbar Treatment (new)
- **Logged out:** Navbar shows "Login" (text link) + "Register" (or a combined "Login/Register" dropdown) as before.
- **Logged in:** replaced by a small circular avatar (initials or uploaded photo) + name, opening a dropdown on click/tap: Profile, Favorites, (Admin Panel — only if role = ADMIN), Logout. Uses the same dropdown/menu styling as other on-site menus (solid white surface, `--radius-md`, soft shadow — not glass, since it sits over the solid navbar state in practice).
