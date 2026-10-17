"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/store/ProductCard";
import { RevealWords } from "@/components/store/Cinematic";
import { getCategoryImage, getFeaturedImages, HERO_IMAGES } from "@/lib/media";
import type { Product, Category } from "@/services/store";

const FALLBACK_CATS: Category[] = [
  { id: "1", name: "Agbada", slug: "agbada", description: null, image: null, sortOrder: 1 },
  { id: "2", name: "Senator Wear", slug: "senator", description: null, image: null, sortOrder: 2 },
  { id: "3", name: "Ready-to-Wear", slug: "ready-to-wear", description: null, image: null, sortOrder: 3 },
  { id: "4", name: "Custom Designs", slug: "custom", description: null, image: null, sortOrder: 4 },
];

export function CategoryRail({ categories }: { categories: Category[] }) {
  const list = categories.length > 0 ? categories : FALLBACK_CATS;
  return (
    <section className="section-py bg-ivory">
      <div className="container-page">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="label">Shop by world</span>
            <RevealWords as="h2" text="The Collections" className="editorial-h2 mt-3 block" />
          </div>
          <Link href="/shop" className="hidden sm:inline-flex items-center gap-2 label !text-charcoal hover:!text-burgundy">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {list.map((c, i) => {
            const catImage = getCategoryImage(c.slug);
            return (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}>
                <Link href={`/shop?category=${c.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-charcoal">
                    <Image src={c.image ?? catImage.src} alt={c.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover object-top opacity-90 transition-all duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07] group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
                      <div>
                        <p className="label !text-champagne !text-[0.6rem]">0{i + 1}</p>
                        <h3 className="font-serif text-xl md:text-2xl text-ivory mt-1">{c.name}</h3>
                      </div>
                      <span className="w-10 h-10 flex items-center justify-center border border-ivory/40 text-ivory transition-all duration-300 group-hover:bg-ivory group-hover:text-charcoal">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturedGrid({ products }: { products: Product[] }) {
  const featuredImages = getFeaturedImages(4);
  return (
    <section className="section-py bg-ivory border-t border-line">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <span className="label">The Edit</span>
            <RevealWords as="h2" text="Coveted Pieces" className="editorial-h2 mt-3 block" />
          </div>
          <Button href="/shop" variant="ghost">View all</Button>
        </div>
        {products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredImages.map((img, i) => (
              <div key={i} className="group">
                <div className="aspect-[3/4] relative overflow-hidden bg-charcoal mb-4">
                  <Image src={img.src} alt={img.alt} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 label !text-champagne">Look 0{i + 1}</span>
                </div>
                <p className="label">From the atelier</p>
                <p className="text-sm text-muted mt-1">Shop the full collection</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}