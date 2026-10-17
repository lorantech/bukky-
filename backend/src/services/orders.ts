import crypto from "crypto";
import { Order, type IOrder, type OrderStatus } from "../models/Order";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";
import { paymentProvider, toKobo } from "./payments";

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { productId: string; quantity: number; size?: string; color?: string }[];
  deliveryAddress?: string;
  notes?: string;
  isCustomOrder?: boolean;
  measurements?: Record<string, string>;
  customerId?: string;
  deliveryFee?: number;
}

export const toSafeOrder = (o: IOrder) => ({
  id: o._id.toString(),
  reference: o.reference,
  customerName: o.customerName,
  customerEmail: o.customerEmail,
  customerPhone: o.customerPhone,
  items: o.items,
  subtotal: o.subtotal,
  deliveryFee: o.deliveryFee,
  total: o.total,
  status: o.status,
  isCustomOrder: o.isCustomOrder,
  measurements: o.measurements,
  notes: o.notes,
  deliveryAddress: o.deliveryAddress,
  paidAt: o.paidAt,
  createdAt: o.createdAt,
  updatedAt: o.updatedAt,
});

export const createOrder = async (input: CreateOrderInput): Promise<IOrder> => {
  const isCustom = input.isCustomOrder ?? false;

  let items: IOrder["items"];
  let subtotal: number;

  if (isCustom && input.items.length === 0) {
    // Bespoke order with no catalog items yet — deposit/quote handled by atelier.
    // A zero-value placeholder keeps the shape consistent until pricing is confirmed.
    items = [];
    subtotal = 0;
  } else {
    if (!input.items.length) throw ApiError.badRequest("Order must have at least one item");

    const ids = input.items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids }, status: "active" });
    if (products.length !== ids.length) throw ApiError.badRequest("One or more products are unavailable");

    const byId = new Map(products.map((p) => [p._id.toString(), p]));
    items = input.items.map((i) => {
      const p = byId.get(i.productId);
      if (!p) throw ApiError.badRequest("Product not found");
      if (i.quantity < 1) throw ApiError.badRequest("Quantity must be at least 1");
      if (p.stock < i.quantity) throw ApiError.badRequest(`Insufficient stock for ${p.name}`);
      return {
        product: p._id,
        name: p.name,
        price: p.price,
        quantity: i.quantity,
        size: i.size ?? null,
        color: i.color ?? null,
        image: p.images[0]?.url ?? null,
      };
    });
    subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  }
  const deliveryFee = Math.max(0, input.deliveryFee ?? 0);
  const reference = `BC-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

  const order = await Order.create({
    reference,
    customer: input.customerId ?? null,
    customerName: input.customerName,
    customerEmail: input.customerEmail.toLowerCase(),
    customerPhone: input.customerPhone,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    isCustomOrder: input.isCustomOrder ?? false,
    measurements: input.measurements ?? null,
    notes: input.notes ?? null,
    deliveryAddress: input.deliveryAddress ?? null,
  });
  return order;
};

export const initializeOrderPayment = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found");
  if (order.status !== "pending") throw ApiError.badRequest("Order is no longer payable");
  const { authorizationUrl, reference } = await paymentProvider.initialize({
    email: order.customerEmail,
    amountKobo: toKobo(order.total),
    reference: order.paystackReference ?? order.reference,
  });
  order.paystackReference = reference;
  await order.save();
  return { authorizationUrl, reference, order: toSafeOrder(order) };
};

export const verifyOrderPayment = async (reference: string) => {
  const result = await paymentProvider.verify(reference);
  const order = await Order.findOne({ $or: [{ paystackReference: reference }, { reference }] });
  if (!order) throw ApiError.notFound("Order not found");
  if (result.paid) {
    if (result.amountKobo !== toKobo(order.total)) {
      throw ApiError.badRequest("Paid amount does not match order total");
    }
    if (order.status === "pending") {
      order.status = "paid";
      order.paidAt = new Date();
      for (const item of order.items) {
        await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
      }
      await order.save();
    }
  }
  return { paid: result.paid, order: toSafeOrder(order) };
};

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["tailoring", "cancelled"],
  tailoring: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const transitionOrder = async (orderId: string, to: OrderStatus): Promise<IOrder> => {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found");
  if (!TRANSITIONS[order.status].includes(to)) {
    throw ApiError.badRequest(`Cannot move order from ${order.status} to ${to}`);
  }
  order.status = to;
  await order.save();
  return order;
};
