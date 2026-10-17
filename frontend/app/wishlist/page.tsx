"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { RevealWords } from "@/components/store/Cinematic";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProducts, type Product } from "@/services/store";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({ limit: 60 }).then((r) => setProducts(r.products.filter((p) => ids.includes(p.id)))).catch(() => {});
  }, [ids]);

  return (
    <main className="pt-28 md:pt-36 pb-20 bg-ivory min-h-screen">
      <div className="container-page">
        <span className="label">Saved pieces</span>
        <RevealWords as="h1" text="Your Wishlist" className="editorial-h1 mt-3 block" />
        {products.length === 0 ? (
          <div className="mt-12 border border-dashed border-line p-12 text-center text-muted">
            <Heart className="w-8 h-8 mx-auto mb-3 text-champagne" />
            <p>Nothing saved yet — tap the heart on any piece to keep it here.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (<ProductCard key={p.id} product={p} index={i} />))}
          </div>
        )}
      </div>
    </main>
  );
}
