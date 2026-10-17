import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(10),
  price: z.number().int().positive(),
  comparePrice: z.number().int().positive().optional(),
  images: z.array(z.string().url()).min(1),
  categoryId: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }).optional(),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  fabric: z.string().optional(),
  care: z.string().optional(),
  stock: z.number().int().nonnegative(),
  featured: z.boolean(),
  active: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  image: z.string().url().optional(),
  sortOrder: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const reviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string().optional(),
  userName: z.string().min(1),
  userEmail: z.string().email().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(10),
  status: z.enum(["pending", "approved", "rejected"]),
  isVerifiedPurchase: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const videoReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string().optional(),
  userName: z.string().min(1),
  title: z.string().min(1).max(200),
  videoUrl: z.string().url(),
  platform: z.enum(["youtube", "vimeo", "instagram", "tiktok"]),
  thumbnailUrl: z.string().url().optional(),
  duration: z.number().int().positive().optional(),
  status: z.enum(["pending", "approved", "rejected"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
  image: z.string().url().optional(),
});

export const orderSchema = z.object({
  id: z.string(),
  reference: z.string(),
  userId: z.string().optional(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  status: z.enum(["pending", "confirmed", "tailoring", "shipped", "delivered", "cancelled", "refunded"]),
  items: z.array(orderItemSchema),
  subtotal: z.number().int().positive(),
  shipping: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  currency: z.string().length(3),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string().optional(),
    country: z.string().length(2),
  }).optional(),
  notes: z.string().optional(),
  paidAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["admin", "customer"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const authRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
  }),
});

export const authLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
  image: z.string().url().optional(),
});

export const wishlistItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number().int().positive(),
  image: z.string().url().optional(),
});

// Type exports
export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Review = z.infer<typeof reviewSchema>;
export type VideoReview = z.infer<typeof videoReviewSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthRegister = z.infer<typeof authRegisterSchema>["body"];
export type AuthLogin = z.infer<typeof authLoginSchema>["body"];
export type CartItem = z.infer<typeof cartItemSchema>;
export type WishlistItem = z.infer<typeof wishlistItemSchema>;