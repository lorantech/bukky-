import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/errorHandler";
import { upload, uploadBufferToCloudinary, isUploadConfigured } from "../services/uploads";
import { ApiError } from "../utils/ApiError";
import { Subscriber } from "../models/Subscriber";
import { User } from "../models/User";

const router = Router();

router.post(
  "/images",
  authenticate,
  requireRole("admin"),
  upload.array("images", 8),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!isUploadConfigured()) throw ApiError.internal("Image uploads are not configured");
    const files = (req.files ?? []) as Express.Multer.File[];
    if (!files.length) throw ApiError.badRequest("No images provided");
    const urls = await Promise.all(files.map((f) => uploadBufferToCloudinary(f.buffer)));
    res.status(201).json({ urls });
  })
);

router.post(
  "/subscribe",
  validate({ body: z.object({ email: z.string().email() }) }),
  asyncHandler(async (req, res) => {
    const email = req.body.email.toLowerCase();
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
      }
      return res.json({ ok: true, message: "You're on the list" });
    }
    await Subscriber.create({ email });
    res.status(201).json({ ok: true, message: "You're on the list" });
  })
);

router.get(
  "/subscribers",
  authenticate,
  requireRole("admin"),
  asyncHandler(async (_req, res) => {
    const subs = await Subscriber.find({ active: true }).sort({ createdAt: -1 }).limit(500);
    res.json({ count: subs.length, subscribers: subs.map((s) => ({ email: s.email, createdAt: s.createdAt })) });
  })
);

router.get(
  "/customers",
  authenticate,
  requireRole("admin"),
  validate({
    query: z.object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const q = req.query as { page?: number; limit?: number };
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(100, Math.max(1, q.limit ?? 20));
    const [users, total] = await Promise.all([
      User.find({ role: "customer" }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select("-passwordHash"),
      User.countDocuments({ role: "customer" }),
    ]);
    res.json({
      customers: users.map((u) => ({ id: u._id.toString(), email: u.email, name: u.name, createdAt: u.createdAt })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  })
);

export const miscRouter = router;
