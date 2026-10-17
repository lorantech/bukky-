"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice, whatsappUrl } from "@/lib/brand";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProduct, type Product } from "@/services/store";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { ProductReviews } from "@/components/store/ProductReviews";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [image, setImage] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();

  useEffect(() => {
    if (!params.slug) return;
    getProduct(params.slug)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes[0] ?? null);
        setColor(p.colors[0] ?? null);
      })
      .catch(() => toast.error("Product not found"));
  }, [params.slug]);

  if (!product) {
    return (
      <main className="pt-28 pb-20 container-page">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[3/4]" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
          </div>
        </div>
      </main>
    );
  }

  const wished = has(product.id);
  const images = product.images.length > 0 ? product.images : [{ url: "", alt: product.name }];

  const handleAdd = () => {
    if (product.sizes.length > 0 && !size) return toast.error("Please select a size");
    add({ productId: product.id, name: product.name, slug: product.slug, price: product.price, image: images[0].url || null, size, color }, qty);
  };

  return (
    <main className="pt-24 md:pt-32 pb-20 bg-ivory">
      <div className="container-page">
        <p className="label mb-8">{product.category.name} — Shop</p>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="relative aspect-[3/4] overflow-hidden bg-line/40">
              <AnimatePresence mode="wait">
                <motion.div key={image} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                  {images[image].url && <Image src={images[image].url} alt={images[image].alt || product.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" priority />}
                </motion.div>
              </AnimatePresence>
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((im, i) => (
                  <button key={i} onClick={() => setImage(i)} className={cn("relative aspect-[3/4] overflow-hidden bg-line/40 border", i === image ? "border-champagne" : "border-transparent")}>
                    {im.url && <Image src={im.url} alt="" fill className="object-cover" sizes="15vw" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <h1 className="editorial-h2">{product.name}</h1>
              <p className="mt-3 font-serif text-3xl text-gold">{formatPrice(product.price)}</p>
              <p className="mt-6 text-muted leading-relaxed">{product.description}</p>
              {product.sizes.length > 0 && (
                <div className="mt-8">
                  <p className="label mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button key={s} onClick={() => setSize(s)} className={cn("min-w-[3.5rem] px-4 py-3 border text-sm font-semibold", size === s ? "bg-charcoal text-ivory border-charcoal" : "border-line hover:border-charcoal")}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {product.colors.length > 0 && (
                <div className="mt-6">
                  <p className="label mb-3">Colour</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button key={c} onClick={() => setColor(c)} className={cn("px-4 py-2.5 border text-sm", color === c ? "bg-charcoal text-ivory border-charcoal" : "border-line hover:border-charcoal")}>{c}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-8 flex items-stretch gap-3">
                <div className="flex items-center border border-line">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3.5" aria-label="Decrease"><Minus className="w-4 h-4" /></button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(Math.min(50, qty + 1))} className="p-3.5" aria-label="Increase"><Plus className="w-4 h-4" /></button>
                </div>
                <Button variant="primary" className="flex-1" onClick={handleAdd} disabled={product.stock <= 0}>{product.stock <= 0 ? "Sold out" : "Add to bag"}</Button>
                <button onClick={() => toggle(product.id, product.name)} aria-label="Wishlist" className={cn("w-[3.5rem] flex items-center justify-center border", wished ? "border-burgundy text-burgundy" : "border-line")}>
                  <Heart className={cn("w-5 h-5", wished && "fill-current")} />
                </button>
              </div>
              <a href={whatsappUrl(`Hello, I'd like the ${product.name}`)} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center w-full border border-line py-3.5 text-xs font-semibold tracking-[0.16em] uppercase hover:border-charcoal">Ask concierge on WhatsApp</a>
              <p className="mt-4 text-xs text-muted">{product.stock > 0 ? `${product.stock} in stock — tailored in 7–14 days` : "Currently sold out"}</p>
            </motion.div>
          </div>
        </div>
        <ProductReviews productId={product.id} fabric={product.fabric} care={product.care} />
      </div>
    </main>
  );
}

