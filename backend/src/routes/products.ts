import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/errorHandler";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";
import { getProducts, toSafeProduct, uniqueSlug } from "../services/catalog";

const router = Router();

const imageSchema = z.object({ url: z.string().url(), alt: z.string().max(160).optional() });

const productBody = z.object({
  name: z.string().min(1).max(160),
  description: z.string().min(1).max(5000),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional().nullable(),
  categorySlug: z.string().min(1),
  images: z.array(imageSchema).max(8).default([]),
  sizes: z.array(z.string().max(20)).max(20).default([]),
  colors: z.array(z.string().max(40)).max(20).default([]),
  stock: z.number().int().min(0).default(0),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  fabric: z.string().max(300).optional().nullable(),
  care: z.string().max(1000).optional().nullable(),
});

router.get(
  "/",
  validate({
    query: z.object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(60).optional(),
      category: z.string().optional(),
      search: z.string().optional(),
      featured: z.coerce.boolean().optional(),
      status: z.enum(["active", "all"]).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const q = req.query as { page?: number; limit?: number; category?: string; search?: string; featured?: boolean; status?: "active" | "all" };
    // Public listing only shows active; admins pass status=all
    res.json(await getProducts({ ...q, status: q.status ?? "active" }));
  })
);

router.get(
  "/featured",
  asyncHandler(async (_req, res) => {
    res.json(await getProducts({ limit: 8, featured: true }));
  })
);

router.get(
  "/:slug",
  validate({ params: z.object({ slug: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug.toLowerCase() }).populate("category", "name slug");
    if (!product || product.status !== "active") throw ApiError.notFound("Product not found");
    res.json({ product: toSafeProduct(product) });
  })
);

router.post(
  "/",
  authenticate,
  requireRole("admin"),
  validate({ body: productBody }),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const cat = await Category.findOne({ slug: req.body.categorySlug.toLowerCase() });
    if (!cat) throw ApiError.badRequest("Category not found");
    const slug = await uniqueSlug(req.body.name);
    const product = await Product.create({
      name: req.body.name,
      slug,
      description: req.body.description,
      price: req.body.price,
      compareAtPrice: req.body.compareAtPrice ?? null,
      category: cat._id,
      images: req.body.images,
      sizes: req.body.sizes,
      colors: req.body.colors,
      stock: req.body.stock,
      status: req.body.status,
      featured: req.body.featured,
      fabric: req.body.fabric ?? null,
      care: req.body.care ?? null,
    });
    await product.populate("category", "name slug");
    res.status(201).json({ product: toSafeProduct(product) });
  })
);

router.put(
  "/:slug",
  authenticate,
  requireRole("admin"),
  validate({ params: z.object({ slug: z.string().min(1) }), body: productBody.partial() }),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const product = await Product.findOne({ slug: req.params.slug.toLowerCase() });
    if (!product) throw ApiError.notFound("Product not found");
    if (req.body.name && req.body.name !== product.name) {
      product.slug = await uniqueSlug(req.body.name, { excludeId: product._id.toString() });
      product.name = req.body.name;
    }
    if (req.body.categorySlug) {
      const cat = await Category.findOne({ slug: req.body.categorySlug.toLowerCase() });
      if (!cat) throw ApiError.badRequest("Category not found");
      product.category = cat._id;
    }
    const fields = ["description", "price", "compareAtPrice", "images", "sizes", "colors", "stock", "status", "featured", "fabric", "care"] as const;
    for (const f of fields) {
      if (req.body[f] !== undefined) (product as unknown as Record<string, unknown>)[f] = req.body[f];
    }
    await product.save();
    await product.populate("category", "name slug");
    res.json({ product: toSafeProduct(product) });
  })
);

router.delete(
  "/:slug",
  authenticate,
  requireRole("admin"),
  validate({ params: z.object({ slug: z.string().min(1) }) }),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const product = await Product.findOneAndDelete({ slug: req.params.slug.toLowerCase() });
    if (!product) throw ApiError.notFound("Product not found");
    res.json({ ok: true });
  })
);

export const productRouter = router;
