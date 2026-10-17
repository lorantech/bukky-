# Requirements — Bukky Collection Foundation

## 1. DESIGN SYSTEM
- R1.1 Tailwind config exposes CSS variables for color, typography, spacing, borders, radius, motion tokens.
- R1.2 Fonts loaded with next/font (Cormorant Garamond for headlines, Manrope for body).
- R1.3 web/lib/motion.ts exports shared easing curve and reusable variants: fadeUp, reveal, stagger, imageMask, parallax helper.
- R1.4 motion.ts respects prefers-reduced-motion (disables transforms/animation when set).
- R1.5 web/lib/brand.ts is the single source of truth for brand name ("Bukky Collection"), tagline, WhatsApp number, and social links. No hardcoding elsewhere.

## 2. UI PRIMITIVES (components/ui)
- R2.1 Button with subtle magnetic hover and loading state.
- R2.2 Input (with label, error state, accessible).
- R2.3 Modal (accessible, focus trap, close on Esc/backdrop).
- R2.4 Drawer (slide-in, mobile-first).
- R2.5 Toast system (react-hot-toast based, success/error/info).
- R2.6 Skeleton (loading states).
- R2.7 Counter (animated number on viewport entry).
- R2.8 Dialog for confirmations (accessible).

## 3. STOREFRONT SHELL
- R3.1 Sticky header transitions transparent-to-solid on scroll.
- R3.2 Mega-style category navigation on desktop.
- R3.3 Full-screen animated mobile menu.
- R3.4 Search overlay.
- R3.5 Cart icon with item count badge.
- R3.6 Wishlist icon.
- R3.7 Page transitions (Framer Motion).
- R3.8 Premium footer: logo, navigation, shop, about, contact, FAQ, privacy, terms, social, newsletter, WhatsApp CTA.
- R3.9 WhatsApp CTA integrated into brand design (not a random floating button).

## 4. API FOUNDATION
- R4.1 Express app with helmet, cors (FRONTEND_URL), JSON parsing.
- R4.2 Rate limiting on auth, review, newsletter, upload endpoints.
- R4.3 Central errorHandler middleware.
- R4.4 ApiError class.
- R4.5 asyncHandler wrapper.
- R4.6 validate(zod) middleware.
- R4.7 Env validation with Zod, fail fast on missing vars.
- R4.8 MongoDB connection via Mongoose.
- R4.9 Health route.
- R4.10 Typed API client in web/services.

## 5. AUTH
- R5.1 User model with role (admin | customer).
- R5.2 register/login/logout/me endpoints.
- R5.3 bcrypt password hashing.
- R5.4 JWT stored in httpOnly, Secure, SameSite cookie. Never localStorage.
- R5.5 requireAuth and requireRole middleware.
- R5.6 Next.js middleware protects /admin.
- R5.7 Admin login page.
- R5.8 Seed script creates first admin from ADMIN_EMAIL / ADMIN_PASSWORD (no default password).
- R5.9 Non-admins rejected by both Next.js middleware and API.

## 6. PROJECT ARTIFACTS
- R6.1 .env.example files for web and api.
- R6.2 .gitignore.
- R6.3 README skeleton (overview, stack, structure, install, env vars, dev commands).
- R6.4 Both apps start with a single dev command each.

## 7. ACCEPTANCE
- A1 Both apps start with a single dev command each.
- A2 Shell renders responsively on mobile and desktop.
- A3 Admin can log in and reach a protected /admin placeholder.
- A4 Non-admins are rejected by both Next.js middleware and the API.