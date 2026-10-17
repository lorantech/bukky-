"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useToast } from "@/components/ui/Toast";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (productId: string, size?: string | null, color?: string | null) => void;
  setQuantity: (productId: string, quantity: number, size?: string | null, color?: string | null) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "bukky-cart-v1";

const keyOf = (i: Pick<CartItem, "productId" | "size" | "color">) =>
  `${i.productId}|${i.size ?? ""}|${i.color ?? ""}`;

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full — ignore */
    }
  }, [items]);

  const add = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const key = keyOf(item);
        const found = prev.find((p) => keyOf(p) === key);
        if (found) {
          return prev.map((p) => (keyOf(p) === key ? { ...p, quantity: Math.min(50, p.quantity + quantity) } : p));
        }
        return [...prev, { ...item, quantity }];
      });
      toast.success(`${item.name} added to bag`);
      setOpen(true);
    },
    [toast]
  );

  const remove = useCallback((productId: string, size?: string | null, color?: string | null) => {
    setItems((prev) => prev.filter((p) => keyOf(p) !== keyOf({ productId, size: size ?? null, color: color ?? null })));
  }, []);

  const setQuantity = useCallback(
    (productId: string, quantity: number, size?: string | null, color?: string | null) => {
      if (quantity < 1) return remove(productId, size, color);
      setItems((prev) =>
        prev.map((p) => (keyOf(p) === keyOf({ productId, size: size ?? null, color: color ?? null }) ? { ...p, quantity: Math.min(50, quantity) } : p))
      );
    },
    [remove]
  );

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    return {
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
    };
  }, [items]);

  const value = useMemo(
    () => ({ items, count, subtotal, add, remove, setQuantity, clear, open, setOpen }),
    [items, count, subtotal, add, remove, setQuantity, clear, open]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
