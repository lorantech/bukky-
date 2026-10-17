import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/errorHandler";
import { Category } from "../models/Category";
import { ApiError } from "../utils/ApiError";
import { toSafeCategory, uniqueSlug } from "../services/catalog";

const router = Router();

const categoryBody = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional().nullable(),
  image: z.string().url().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const cats = await Category.find().sort({ sortOrder: 1, name: 1 });
    res.json({ categories: cats.map(toSafeCategory) });
  })
);

router.get(
  "/:slug",
  validate({ params: z.object({ slug: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    const cat = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!cat) throw ApiError.notFound("Category not found");
    res.json({ category: toSafeCategory(cat) });
  })
);

router.post(
  "/",
  authenticate,
  requireRole("admin"),
  validate({ body: categoryBody }),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const slug = await uniqueSlug(req.body.name);
    const cat = await Category.create({
      name: req.body.name,
      slug,
      description: req.body.description ?? null,
      image: req.body.image ?? null,
      sortOrder: req.body.sortOrder ?? 0,
    });
    res.status(201).json({ category: toSafeCategory(cat) });
  })
);

router.put(
  "/:slug",
  authenticate,
  requireRole("admin"),
  validate({ params: z.object({ slug: z.string().min(1) }), body: categoryBody.partial() }),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const cat = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!cat) throw ApiError.notFound("Category not found");
    if (req.body.name && req.body.name !== cat.name) {
      cat.slug = await uniqueSlug(req.body.name, { excludeId: cat._id.toString() });
      cat.name = req.body.name;
    }
    if (req.body.description !== undefined) cat.description = req.body.description;
    if (req.body.image !== undefined) cat.image = req.body.image;
    if (req.body.sortOrder !== undefined) cat.sortOrder = req.body.sortOrder;
    await cat.save();
    res.json({ category: toSafeCategory(cat) });
  })
);

router.delete(
  "/:slug",
  authenticate,
  requireRole("admin"),
  validate({ params: z.object({ slug: z.string().min(1) }) }),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const cat = await Category.findOneAndDelete({ slug: req.params.slug.toLowerCase() });
    if (!cat) throw ApiError.notFound("Category not found");
    res.json({ ok: true });
  })
);

export const categoryRouter = router;
