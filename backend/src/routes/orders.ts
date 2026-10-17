import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/errorHandler";
import { Order, type OrderStatus } from "../models/Order";
import { ApiError } from "../utils/ApiError";
import { createOrder, initializeOrderPayment, toSafeOrder, transitionOrder, verifyOrderPayment } from "../services/orders";

const router = Router();

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  size: z.string().max(20).optional(),
  color: z.string().max(40).optional(),
});

const orderBody = z.object({
  customerName: z.string().min(1).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5).max(30),
  items: z.array(orderItemSchema).max(30).default([]),
  deliveryAddress: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  isCustomOrder: z.boolean().optional(),
  measurements: z.record(z.string().max(20), z.string().max(60)).optional(),
  deliveryFee: z.number().nonnegative().optional(),
}).refine((d) => d.isCustomOrder || d.items.length > 0, {
  message: "Order must have at least one item",
  path: ["items"],
});

router.post(
  "/",
  validate({ body: orderBody }),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const order = await createOrder({ ...req.body, customerId: req.user?.id });
    res.status(201).json({ order: toSafeOrder(order) });
  })
);

router.get(
  "/mine",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const filter = req.user ? { $or: [{ customer: req.user.id }, { customerEmail: req.user.email }] } : { _id: null };
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ orders: orders.map(toSafeOrder) });
  })
);

router.get(
  "/:reference",
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({
      $or: [{ reference: req.params.reference.toUpperCase() }, { paystackReference: req.params.reference }],
    });
    if (!order) throw ApiError.notFound("Order not found");
    res.json({ order: toSafeOrder(order) });
  })
);

router.post(
  "/:id/pay",
  validate({ params: z.object({ id: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    res.json(await initializeOrderPayment(req.params.id));
  })
);

router.get(
  "/verify/:reference",
  asyncHandler(async (req, res) => {
    res.json(await verifyOrderPayment(req.params.reference));
  })
);

// Admin
router.get(
  "/",
  authenticate,
  requireRole("admin"),
  validate({
    query: z.object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
      status: z.enum(["pending", "paid", "tailoring", "shipped", "delivered", "cancelled"]).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const q = req.query as { page?: number; limit?: number; status?: OrderStatus };
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(100, Math.max(1, q.limit ?? 20));
    const filter = q.status ? { status: q.status } : {};
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Order.countDocuments(filter),
    ]);
    res.json({ orders: orders.map(toSafeOrder), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  })
);

router.patch(
  "/:id/status",
  authenticate,
  requireRole("admin"),
  validate({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({ status: z.enum(["paid", "tailoring", "shipped", "delivered", "cancelled"]) }),
  }),
  asyncHandler(async (req, res) => {
    const order = await transitionOrder(req.params.id, req.body.status as OrderStatus);
    res.json({ order: toSafeOrder(order) });
  })
);

export const orderRouter = router;
