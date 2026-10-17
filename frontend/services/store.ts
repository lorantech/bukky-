import { api } from "./api";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
}

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: { id: string; name: string; slug: string };
  images: ProductImage[];
  sizes: string[];
  colors: string[];
  stock: number;
  status: string;
  featured: boolean;
  fabric: string | null;
  care: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get("/categories");
  return res.data.categories;
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}): Promise<{ products: Product[]; pagination: Pagination }> {
  const res = await api.get("/products", { params });
  return res.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await api.get("/products/featured");
  return res.data.products;
}

export async function getProduct(slug: string): Promise<Product> {
  const res = await api.get(`/products/${slug}`);
  return res.data.product;
}

export interface OrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { productId: string; quantity: number; size?: string; color?: string }[];
  deliveryAddress?: string;
  notes?: string;
  isCustomOrder?: boolean;
  measurements?: Record<string, string>;
  deliveryFee?: number;
}

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { product: string; name: string; price: number; quantity: number; size: string | null; color: string | null; image: string | null }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  isCustomOrder: boolean;
  measurements: Record<string, string> | null;
  notes: string | null;
  deliveryAddress: string | null;
  paidAt: string | null;
  createdAt: string;
}

export async function createOrder(input: OrderInput): Promise<Order> {
  const res = await api.post("/orders", input);
  return res.data.order;
}

export async function payOrder(id: string): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await api.post(`/orders/${id}/pay`);
  return res.data;
}

export async function verifyPayment(reference: string): Promise<{ paid: boolean; order: Order }> {
  const res = await api.get(`/orders/verify/${reference}`);
  return res.data;
}

export async function getOrder(reference: string): Promise<Order> {
  const res = await api.get(`/orders/${reference}`);
  return res.data.order;
}

export interface ReviewInput {
  productId: string;
  customerName: string;
  rating: number;
  title?: string;
  body: string;
  videoUrl?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string | null;
  body: string;
  videoUrl: string | null;
  createdAt: string;
}

export async function getProductReviews(productId: string): Promise<{ reviews: Review[]; average: number | null; count: number }> {
  const res = await api.get(`/reviews/product/${productId}`);
  return res.data;
}

export async function submitReview(input: ReviewInput): Promise<void> {
  await api.post("/reviews", input);
}

export async function subscribe(email: string): Promise<string> {
  const res = await api.post("/subscribe", { email });
  return res.data.message ?? "You're on the list";
}
