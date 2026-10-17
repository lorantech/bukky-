"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { formatPrice } from "@/lib/brand";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Product } from "@/services/store";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8E0D2"/><stop offset="1" stop-color="#C9BFAE"/></linearGradient></defs><rect width="600" height="800" fill="url(#g)"/><text x="300" y="400" text-anchor="middle" font-family="Georgia" font-size="28" fill="#4A1620" letter-spacing="6">BUKKY</text></svg>`
);

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const image = product.images[0]?.url ?? PLACEHOLDER;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-line/40">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={image}
            alt={product.images[0]?.alt || product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
          />
        </Link>
        {/* champagne sheen sweep */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="absolute top-3 left-3 bg-burgundy text-ivory text-[0.6rem] font-semibold tracking-[0.18em] uppercase px-3 py-1.5">
            Sale
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute top-3 left-3 bg-charcoal text-ivory text-[0.6rem] font-semibold tracking-[0.18em] uppercase px-3 py-1.5">
            Sold out
          </span>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <button
            onClick={() => toggle(product.id, product.name)}
            aria-label="Wishlist"
            className={cn(
              "w-9 h-9 flex items-center justify-center bg-ivory/95 backdrop-blur transition-colors",
              wished ? "text-burgundy" : "text-charcoal hover:text-burgundy"
            )}
          >
            <Heart className={cn("w-4 h-4", wished && "fill-current")} />
          </button>
          <button
            onClick={() => add({ productId: product.id, name: product.name, slug: product.slug, price: product.price, image: product.images[0]?.url ?? null, size: product.sizes[0] ?? null, color: product.colors[0] ?? null })}
            aria-label="Quick add"
            disabled={product.stock <= 0}
            className="w-9 h-9 flex items-center justify-center bg-charcoal text-ivory hover:bg-burgundy transition-colors disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="pt-4 space-y-1">
        <p className="label !text-[0.62rem]">{product.category.name}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg leading-snug hover:text-burgundy transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm">
          <span className="text-gold font-semibold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="ml-2 text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </p>
      </div>
    </motion.article>
  );
}
