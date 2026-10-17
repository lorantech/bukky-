# Tasks — Bukky Collection Foundation

## Phase 1: Project Setup
- [x] 1.1 Create /web package.json, tsconfig, next.config, tailwind, postcss
- [x] 1.2 Create /api package.json, tsconfig, .env.example
- [x] 1.3 Create root package.json with dev scripts
- [x] 1.4 Create .gitignore
- [x] 1.5 Create README skeleton

## Phase 2: API Foundation
- [x] 2.1 Env validation with Zod (config/env.ts)
- [x] 2.2 MongoDB connection (config/db.ts)
- [x] 2.3 ApiError class and errorHandler (utils/ApiError.ts)
- [x] 2.4 asyncHandler wrapper
- [x] 2.5 validate(zod) middleware
- [x] 2.6 helmet, cors, rate limiting setup
- [x] 2.7 Express app entrypoint (src/index.ts)
- [x] 2.8 Health route

## Phase 3: Auth
- [x] 3.1 User model (models/User.ts) with role
- [x] 3.2 Auth service (services/auth.ts): register, login, logout, me
- [x] 3.3 Auth routes (routes/auth.ts)
- [x] 3.4 requireAuth, requireRole middleware
- [x] 3.5 Seed script for first admin
- [ ] 3.6 PaymentProvider interface + Paystack adapter (stub)

## Phase 4: Design System
- [x] 4.1 web/lib/brand.ts
- [x] 4.2 web/lib/motion.ts (variants, easing, prefers-reduced-motion)
- [x] 4.3 Tailwind config with CSS variables
- [x] 4.4 globals.css with design tokens
- [x] 4.5 Font loading with next/font

## Phase 5: UI Primitives
- [x] 5.1 Button (magnetic hover, loading)
- [x] 5.2 Input
- [x] 5.3 Modal
- [x] 5.4 Drawer
- [x] 5.5 Toast system
- [x] 5.6 Skeleton
- [x] 5.7 Counter
- [x] 5.8 Dialog

## Phase 6: Storefront Shell
- [x] 6.1 Sticky header (transparent-to-solid on scroll)
- [ ] 6.2 Mega category navigation (desktop)
- [x] 6.3 Full-screen mobile menu
- [x] 6.4 Search overlay
- [x] 6.5 Cart icon with count
- [x] 6.6 Wishlist icon
- [ ] 6.7 Page transitions
- [x] 6.8 Premium footer
- [x] 6.9 WhatsApp CTA

## Phase 7: Web Auth Pages
- [x] 7.1 Admin login page
- [x] 7.2 Next.js middleware protecting /admin
- [x] 7.3 Protected /admin placeholder
- [x] 7.4 Auth context/provider
- [x] 7.5 Typed API client (services/api.ts)

## Phase 8: Verification
- [ ] 8.1 API starts and health route responds
- [ ] 8.2 Web starts and shell renders responsively
- [ ] 8.3 Admin login works, reaches /admin
- [ ] 8.4 Non-admin rejected by middleware and API
- [x] 8.5 TypeScript compiles in both apps