# Bukky Collection — Luxury Fashion Monorepo

A premium luxury boutique fashion website and e-commerce platform with a separate admin dashboard.

## Architecture

```
bukky-collection/
├── frontend/          # Next.js 15 (App Router) storefront & admin dashboard
├── backend/           # Express + Mongoose REST API
├── shared/            # Shared types, Zod schemas, utilities
├── docs/              # Documentation
├── scripts/           # Build/deploy scripts
├── turbo.json         # Turborepo configuration
├── package.json       # Root workspace config
└── .env.example       # Environment template
```

## Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + CSS Variables
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State**: React Context + Hooks
- **UI**: Custom components (Button, Input, Modal, Drawer, Toast, Skeleton, Counter, Dialog)
- **Fonts**: Cormorant Garamond (headlines) + Manrope (body)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 4
- **Language**: TypeScript (strict)
- **Database**: MongoDB + Mongoose
- **Auth**: JWT in httpOnly cookies, bcrypt
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary
- **Rate Limiting**: express-rate-limit
- **Security**: Helmet, CORS, JWT in httpOnly cookies

### Shared
- **Types**: TypeScript interfaces
- **Validation**: Zod schemas (single source of truth)
- **Utils**: Formatters, slugify, currency, etc.

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 6+
- npm 10+

### Installation

```bash
# Install all dependencies
npm install

# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Configure environment variables in .env files

# Build shared package
npm run build:shared

# Start development servers
npm run dev
```

### Development URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health**: http://localhost:4000/health
- **Admin Dashboard**: http://localhost:3000/admin
- **Admin Login**: http://localhost:3000/admin/login

## Project Structure

### Frontend (`/frontend`)
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages
│   ├── admin/             # Admin dashboard (protected)
│   ├── api/               # API routes (if needed)
│   ├── product/[slug]/    # Product detail
│   ├── shop/              # Shop listing
│   ├── track/             # Order tracking
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Primitive components
│   ├── layout/            # Header, Footer, SearchOverlay
│   ├── store/             # Store-specific components
│   └── admin/             # Admin-specific components
├── contexts/              # React Context providers
├── lib/                   # Utilities, brand config, motion
├── services/              # API clients
├── types/                 # Frontend-specific types
├── styles/                # Global styles
├── middleware.ts          # Next.js middleware (admin auth)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Backend (`/backend`)
```
backend/
├── src/
│   ├── config/            # Environment, DB, Cloudinary
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, validation, error handling
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # ApiError, asyncHandler
│   ├── scripts/           # DB scripts
│   ├── index.ts           # Entry point
│   └── app.ts             # Express app setup
├── .env.example
├── tsconfig.json
└── package.json
```

### Shared (`/shared`)
```
shared/
├── src/
│   ├── schemas/           # Zod schemas (single source of truth)
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Shared utilities
│   └── index.ts           # Barrel export
├── tsconfig.json
└── package.json
```

## Key Features

### Storefront
- Editorial luxury design (Charcoal #0E0E0D, Ivory #F4EFE6, Champagne #B79B6A)
- Mobile-first responsive design
- Framer Motion animations (fadeUp, reveal, stagger, imageMask)
- WhatsApp integration for concierge
- Product browsing, search, filtering
- Cart & Wishlist (client-side state)
- Custom orders flow
- Order tracking

### Admin Dashboard
- JWT authentication (httpOnly cookies)
- Role-based access (admin only)
- Product CRUD with image upload (Cloudinary)
- Category management
- Order management (status workflow)
- Review moderation
- Video review moderation
- Customer management
- Analytics dashboard

### API Endpoints
- `POST /api/v1/auth/register` — Register customer
- `POST /api/v1/auth/login` — Login (sets httpOnly cookie)
- `POST /api/v1/auth/logout` — Logout
- `GET /api/v1/auth/me` — Current user
- `GET /api/v1/products` — List products (filters: category, search, featured)
- `GET /api/v1/products/:slug` — Product detail
- `GET /api/v1/categories` — List categories
- `GET /api/v1/orders/:reference` — Track order
- `POST /api/v1/orders` — Create order
- Admin: `GET/POST/PUT/DELETE /api/v1/admin/*`

## Scripts

```bash
# Development
npm run dev              # Start all (frontend + backend)
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only

# Building
npm run build            # Build all packages
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only
npm run build:shared     # Build shared package

# Type checking
npm run typecheck        # Type check all packages

# Database
npm run db:push          # Push schema to MongoDB
npm run db:seed          # Seed database (creates admin)

# Production
npm run start:frontend   # Start frontend production
npm run start:backend    # Start backend production
```

## Environment Variables

### Frontend (`frontend/.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_GA_ID=
```

### Backend (`backend/.env`)
```
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/bukky_collection
JWT_SECRET=your-secure-random-32-char-string
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@bukkycollection.com
ADMIN_PASSWORD=secure-password-here
ADMIN_NAME=Bukky Collection Admin
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@bukkycollection.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Deployment

### Frontend (Vercel/Netlify)
- Build command: `npm run build:frontend`
- Output directory: `.next`
- Environment variables from `frontend/.env`

### Backend (Railway/Render/DigitalOcean)
- Build command: `npm run build:backend`
- Start command: `npm run start:backend`
- Environment variables from `backend/.env`
- MongoDB connection string required

## License

Proprietary — Bukky Collection