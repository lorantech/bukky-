import crypto from "crypto";
import { FilterQuery } from "mongoose";
import { Category } from "../models/Category";
import { Product, type IProduct } from "../models/Product";
import { ApiError } from "../utils/ApiError";

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const uniqueSlug = async (base: string, scope: { excludeId?: string } = {}): Promise<string> => {
  const stem = slugify(base) || crypto.randomBytes(4).toString("hex");
  let slug = stem;
  let n = 2;
  for (;;) {
    const query: FilterQuery<IProduct> = { slug };
    if (scope.excludeId) query._id = { $ne: scope.excludeId };
    const [p, c] = await Promise.all([
      Product.findOne(query).select("_id").lean(),
      Category.findOne(query).select("_id").lean(),
    ]);
    if (!p && !c) return slug;
    slug = `${stem}-${n++}`;
  }
};

export const toSafeCategory = (c: { _id: unknown; name: string; slug: string; description: string | null; image: string | null; sortOrder: number }) => ({
  id: String(c._id),
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: c.image,
  sortOrder: c.sortOrder,
});

export const toSafeProduct = (p: IProduct & { category?: { name?: string; slug?: string } | null }) => ({
  id: p._id.toString(),
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: p.price,
  compareAtPrice: p.compareAtPrice,
  category: typeof p.category === "object" && p.category !== null && "name" in p.category
    ? { id: String((p.category as { _id?: unknown })._id ?? p.category), name: (p.category as { name?: string }).name ?? "", slug: (p.category as { slug?: string }).slug ?? "" }
    : { id: String(p.category), name: "", slug: "" },
  images: p.images,
  sizes: p.sizes,
  colors: p.colors,
  stock: p.stock,
  status: p.status,
  featured: p.featured,
  fabric: p.fabric,
  care: p.care,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

export const getProducts = async (input: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  status?: "active" | "all";
}) => {
  const page = Math.max(1, input.page ?? 1);
  const limit = Math.min(60, Math.max(1, input.limit ?? 12));
  const skip = (page - 1) * limit;

  const filter: FilterQuery<IProduct> = {};
  if (input.status !== "all") filter.status = "active";
  if (input.featured) filter.featured = true;
  if (input.category) {
    const cat = await Category.findOne({ slug: input.category.toLowerCase() }).select("_id");
    if (!cat) throw ApiError.notFound("Category not found");
    filter.category = cat._id;
  }
  if (input.search) filter.$text = { $search: input.search };

  const [items, total] = await Promise.all([
    Product.find(filter).populate("category", "name slug").sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  return { products: items.map((p) => toSafeProduct(p)), pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};
