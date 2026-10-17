"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/brand";
import { usePrefersReducedMotion } from "@/lib/motion";

export function CartDrawer() {
  const { items, subtotal, open, setOpen, setQuantity, remove } = useCart();
  const reduced = usePrefersReducedMotion();

  const list = (
    <div className="flex-1 overflow-y-auto divide-y divide-line">
      {items.map((item) => (
        <div key={`${item.productId}|${item.size}|${item.color}`} className="flex gap-4 p-5">
          <Link
            href={`/product/${item.slug}`}
            onClick={() => setOpen(false)}
            className="relative w-20 aspect-[3/4] bg-line/40 flex-shrink-0 overflow-hidden"
          >
            {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />}
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-serif text-base leading-tight">{item.name}</p>
                {(item.size || item.color) && (
                  <p className="mt-1 text-xs text-muted">{[item.size, item.color].filter(Boolean).join(" · ")}</p>
                )}
              </div>
              <button onClick={() => remove(item.productId, item.size, item.color)} aria-label="Remove" className="p-1 text-muted hover:text-burgundy">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center border border-line">
                <button onClick={() => setQuantity(item.productId, item.quantity - 1, item.size, item.color)} className="p-2 hover:bg-charcoal/5" aria-label="Decrease">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <button onClick={() => setQuantity(item.productId, item.quantity + 1, item.size, item.color)} className="p-2 hover:bg-charcoal/5" aria-label="Increase">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm font-semibold text-gold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const empty = (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16">
      <ShoppingBag className="w-10 h-10 text-champagne mb-4" strokeWidth={1} />
      <p className="font-serif text-2xl">Your bag is empty</p>
      <p className="mt-2 text-sm text-muted">Beautiful things await in the collection.</p>
      <button onClick={() => setOpen(false)} className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase border-b border-champagne pb-1 hover:text-burgundy">
        Continue shopping <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  const footer = items.length > 0 && (
    <div className="border-t border-line p-5 bg-ivory">
      <div className="flex items-center justify-between mb-1">
        <span className="label">Subtotal</span>
        <span className="font-serif text-2xl">{formatPrice(subtotal)}</span>
      </div>
      <p className="text-xs text-muted mb-4">Delivery calculated at checkout.</p>
      <Link href="/checkout" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full bg-charcoal text-ivory py-4 text-xs font-semibold tracking-[0.18em] uppercase hover:bg-burgundy transition-colors">
        Proceed to checkout <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );

  const head = (
    <div className="flex items-center justify-between p-5 border-b border-line">
      <span className="label">Your Bag ({items.length})</span>
      <button onClick={() => setOpen(false)} aria-label="Close bag" className="p-2 hover:text-burgundy"><X className="w-5 h-5" /></button>
    </div>
  );

  if (reduced) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-charcoal/50" onClick={() => setOpen(false)} />
        <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-ivory flex flex-col" role="dialog" aria-modal="true" aria-label="Shopping bag">
          {head}
          {items.length === 0 ? empty : (<>{list}{footer}</>)}
        </aside>
      </div>
    );
  }


  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="absolute right-0 top-0 h-full w-full max-w-md bg-ivory flex flex-col shadow-2xl" role="dialog" aria-modal="true" aria-label="Shopping bag">
            {head}
            {items.length === 0 ? empty : (<>{list}{footer}</>)}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
