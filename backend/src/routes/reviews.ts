import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/errorHandler";
import { Product } from "../models/Product";
import { Review } from "../models/Review";
import { ApiError } from "../utils/ApiError";

const router = Router();

router.get(
  "/product/:productId",
  validate({ params: z.object({ productId: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.productId, approved: true }).sort({ createdAt: -1 }).limit(50);
    const stats = await Review.aggregate([
      { $match: { product: req.params.productId, approved: true } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    res.json({
      reviews: reviews.map((r) => ({
        id: r._id.toString(),
        customerName: r.customerName,
        rating: r.rating,
        title: r.title,
        body: r.body,
        videoUrl: r.videoUrl,
        createdAt: r.createdAt,
      })),
      average: stats[0]?.avg ? Math.round(stats[0].avg * 10) / 10 : null,
      count: stats[0]?.count ?? 0,
    });
  })
);

router.post(
  "/",
  validate({
    body: z.object({
      productId: z.string().min(1),
      customerName: z.string().min(1).max(120),
      rating: z.number().int().min(1).max(5),
      title: z.string().max(160).optional(),
      body: z.string().min(1).max(2000),
      videoUrl: z.string().url().optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.body.productId).select("_id");
    if (!product) throw ApiError.notFound("Product not found");
    const review = await Review.create({
      product: product._id,
      customerName: req.body.customerName,
      rating: req.body.rating,
      title: req.body.title ?? null,
      body: req.body.body,
      videoUrl: req.body.videoUrl ?? null,
    });
    res.status(201).json({ ok: true, id: review._id.toString(), message: "Thanks — your review is awaiting approval" });
  })
);

// Admin moderation
router.get(
  "/",
  authenticate,
  requireRole("admin"),
  validate({
    query: z.object({
      approved: z.enum(["true", "false"]).optional(),
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const q = req.query as { approved?: string; page?: number; limit?: number };
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(100, Math.max(1, q.limit ?? 20));
    const filter = q.approved !== undefined ? { approved: q.approved === "true" } : {};
    const [reviews, total] = await Promise.all([
      Review.find(filter).populate("product", "name slug").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Review.countDocuments(filter),
    ]);
    res.json({
      reviews: reviews.map((r) => ({
        id: r._id.toString(),
        product: r.product,
        customerName: r.customerName,
        rating: r.rating,
        title: r.title,
        body: r.body,
        videoUrl: r.videoUrl,
        approved: r.approved,
        createdAt: r.createdAt,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  })
);

router.patch(
  "/:id/approve",
  authenticate,
  requireRole("admin"),
  validate({ params: z.object({ id: z.string().min(1) }), body: z.object({ approved: z.boolean() }) }),
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) throw ApiError.notFound("Review not found");
    review.approved = req.body.approved;
    await review.save();
    res.json({ ok: true, approved: review.approved });
  })
);

router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  validate({ params: z.object({ id: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) throw ApiError.notFound("Review not found");
    res.json({ ok: true });
  })
);

export const reviewRouter = router;
