import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole, AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { register, login, signToken, setAuthCookie, clearAuthCookie, toSafeUser } from "../services/auth";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 chars"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

router.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(async (req, res) => {
    const user = await register(req.body);
    const token = signToken({ userId: user._id.toString(), role: user.role });
    setAuthCookie(res, token);
    res.json({ user: toSafeUser(user) });
  })
);

router.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const user = await login(req.body);
    const token = signToken({ userId: user._id.toString(), role: user.role });
    setAuthCookie(res, token);
    res.json({ user: toSafeUser(user) });
  })
);

router.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    clearAuthCookie(res);
    res.json({ ok: true });
  })
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) throw ApiError.unauthorized();
    res.json({ user: req.user });
  })
);

// Admin-only: list users (paginated)
router.get(
  "/users",
  authenticate,
  requireRole("admin"),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select("-passwordHash"),
      User.countDocuments(),
    ]);
    res.json({
      users: users.map((u) => ({ id: u._id.toString(), email: u.email, name: u.name, role: u.role, createdAt: u.createdAt })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  })
);

export const authRouter = router;