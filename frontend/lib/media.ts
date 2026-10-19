/**
 * Media utilities for local images and videos
 * All media files are in /public/media/
 */

export interface MediaImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface MediaVideo {
  src: string;
  poster?: string;
  type?: string;
}

// Local images from /public/media/
export const MEDIA_IMAGES = {
  // Hero/landing images
  hero1: { src: "/media/image-1.jpeg", alt: "Bukky Collection - Luxury Fashion" },
  hero2: { src: "/media/image-2.jpeg", alt: "Bukky Collection - Tailored Luxury" },
  hero3: { src: "/media/image-3.jpeg", alt: "Bukky Collection - African Heritage" },
  
  // Product/category images
  agbada: { src: "/media/image-4.jpeg", alt: "Agbada Collection" },
  senator: { src: "/media/image-5.jpeg", alt: "Senator Wear" },
  readyToWear: { src: "/media/image-6.jpeg", alt: "Ready to Wear" },
  custom: { src: "/media/image-7.jpeg", alt: "Custom Designs" },
  atelier: { src: "/media/image-2.jpeg", alt: "Inside the Bukky Collection atelier" },
  
  // Category fallbacks
  category: {
    agbada: { src: "/media/image-4.jpeg", alt: "Agbada" },
    senator: { src: "/media/image-5.jpeg", alt: "Senator Wear" },
    "ready-to-wear": { src: "/media/image-6.jpeg", alt: "Ready to Wear" },
    custom: { src: "/media/image-7.jpeg", alt: "Custom Designs" },
    accessories: { src: "/media/image-1.jpeg", alt: "Accessories" },
  },
  
  // Featured products (placeholder until real products exist)
  featured: [
    { src: "/media/image-1.jpeg", alt: "Featured Piece 1" },
    { src: "/media/image-2.jpeg", alt: "Featured Piece 2" },
    { src: "/media/image-3.jpeg", alt: "Featured Piece 3" },
    { src: "/media/image-4.jpeg", alt: "Featured Piece 4" },
  ],
} as const;

// Local video
export const MEDIA_VIDEOS = {
  hero: { src: "/media/vid-1.mp4", type: "video/mp4" },
  atelier: { src: "/media/vid-1.mp4", type: "video/mp4" },
} as const;

// Helper to get category image
export function getCategoryImage(slug: string): { src: string; alt: string } {
  const key = slug.toLowerCase() as keyof typeof MEDIA_IMAGES.category;
  return MEDIA_IMAGES.category[key] || MEDIA_IMAGES.category.custom;
}

// Helper to get featured images
export function getFeaturedImages(count: number = 4) {
  return MEDIA_IMAGES.featured.slice(0, count);
}

// Hero images for rotation
export const HERO_IMAGES = [
  MEDIA_IMAGES.hero1,
  MEDIA_IMAGES.hero2,
  MEDIA_IMAGES.hero3,
] as const;