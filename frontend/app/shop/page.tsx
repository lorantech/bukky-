"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { RevealWords } from "@/components/store/Cinematic";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { getProducts, getCategories, type Product, type Category } from "@/services/store";
import { useToast } from "@/components/ui/Toast";

export default function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState(search);
  const toast = useToast();

  useEffect(() => {
    searchParams.then((sp) => {
      if (sp.category) setCategory(sp.category);
      if (sp.search) { setSearch(sp.search); setDebounced(sp.search); }
    }).catch(() => {});
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ category: category || undefined, search: debounced || undefined, limit: 24 })
      .then((r) => setProducts(r.products))
      .catch(() => toast.error("Could not load products"))
      .finally(() => setLoading(false));
  }, [category, debounced]);

  return (
    <main className="pt-28 md:pt-36 pb-20 bg-ivory min-h-screen">
      <div className="container-page">
        <span className="label">The Boutique</span>
        <RevealWords as="h1" text="Shop All Pieces" className="editorial-h1 mt-3 block" />
        <p className="mt-4 text-muted max-w-xl">Each piece is cut to order in our Lagos atelier. Allow 7–14 days for tailoring.</p>

        <div className="mt-10 flex flex-col lg:flex-row gap-4 lg:items-center">
          <label className="flex items-center gap-3 flex-1 border-b border-line pb-3 focus-within:border-champagne transition-colors">
            <Search className="w-5 h-5 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agbada, senator, gowns..."
              className="flex-1 bg-transparent text-lg focus:outline-none placeholder:text-muted/60"
            />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal className="w-4 h-4 text-muted flex-shrink-0" />
            <button onClick={() => setCategory("")} className={`px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase border whitespace-nowrap transition-colors ${category === "" ? "bg-charcoal text-ivory border-charcoal" : "border-line hover:border-charcoal"}`}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.slug} onClick={() => setCategory(category === c.slug ? "" : c.slug)} className={`px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase border whitespace-nowrap transition-colors ${category === c.slug ? "bg-charcoal text-ivory border-charcoal" : "border-line hover:border-charcoal"}`}>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          {loading ? (
            <SkeletonGrid count={8} />
          ) : products.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 border border-dashed border-line">
              <p className="font-serif text-3xl">Nothing found</p>
              <p className="mt-3 text-muted">Try another search — or chat with our concierge for custom pieces.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
