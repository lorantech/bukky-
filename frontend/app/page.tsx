"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/store/Hero";
import { CategoryRail, FeaturedGrid } from "@/components/store/HomeSections";
import { AtelierBand, TestimonialBand, ConciergeBand } from "@/components/store/HomeBands";
import { FilmBand } from "@/components/store/FilmBand";
import { getFeaturedProducts, getCategories, type Product, type Category } from "@/services/store";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getFeaturedProducts().then(setProducts).catch(() => setProducts([]));
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <main>
      <Hero />
      <CategoryRail categories={categories} />
      <FeaturedGrid products={products} />
      <FilmBand />
      <AtelierBand />
      <TestimonialBand />
      <ConciergeBand />
    </main>
  );
}

