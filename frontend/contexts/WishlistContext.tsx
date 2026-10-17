"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useToast } from "@/components/ui/Toast";

interface WishlistContextType {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string, name?: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "bukky-wishlist-v1";

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const toggle = useCallback(
    (productId: string, name?: string) => {
      setIds((prev) => {
        if (prev.includes(productId)) {
          toast.success(name ? `${name} removed from wishlist` : "Removed from wishlist");
          return prev.filter((id) => id !== productId);
        }
        toast.success(name ? `${name} saved to wishlist` : "Saved to wishlist");
        return [...prev, productId];
      });
    },
    [toast]
  );

  const value = useMemo(() => ({ ids, has, toggle }), [ids, has, toggle]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
