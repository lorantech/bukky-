# Design — Bukky Collection Foundation

## Brand
- Name: Bukky Collection (wordmark: BUKKY COLLECTION)
- Tagline: Wear Your Confidence
- WhatsApp: +234 901 234 5678
- URL: https://bukkycollection.com

## Palette
- Charcoal: #0E0E0D (primary text, backgrounds)
- Ivory: #F4EFE6 (backgrounds, cards)
- Champagne: #B79B6A (accent, hairlines, icons, text on dark)
- Gold (on ivory): #8A7040 (prices, labels)
- Burgundy: #4A1620 (one section, CTAs)

## Typography
- Headlines: Cormorant Garamond, 72-140px, tracking -0.02em
- Body: Manrope, 15-16px, line-height 1.6
- Labels: 11px, 600, +0.2em, uppercase

## Layout
- 12-column grid
- Sections: 120-200px vertical padding (mobile: 64px)
- Product images: 3:4 aspect ratio
- Radius: 0-2px; 1px hairline borders; no shadows
- Spacing scale: 8px base

## Motion
- Easing: cubic-bezier(.22, 1, .36, 1)
- Reveal duration: 0.6-0.9s
- Variants: fadeUp, reveal, stagger, imageMask, parallax
- Respect prefers-reduced-motion

## Components
- Button, Input, Modal, Drawer, Toast, Skeleton, Counter, ProductCard, VideoCard, SectionLabel

## File structure
```
web/
  app/                  # routes only
  components/
    ui/                 # primitives
    layout/             # header, footer, mobile menu, search overlay
  features/             # feature code
  lib/                  # brand.ts, motion.ts, utils
  hooks/                # custom hooks
  services/             # typed API clients
  types/                # shared types
  styles/               # globals.css
api/
  src/
    controllers/
    routes/
    models/
    services/
    middleware/
    utils/
    config/
```