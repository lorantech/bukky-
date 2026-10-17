"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingBag, Heart, User } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Drawer } from "@/components/ui/Drawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { usePrefersReducedMotion } from "@/lib/motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const navItems = [
  { href: "/", label: "Shop" },
  { href: "/shop", label: "Collections" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { count: cartCount, setOpen: setCartOpen } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const reduced = usePrefersReducedMotion();

  if (!mounted) return null;

  const ink = scrolled ? "text-charcoal" : "text-ivory";
  const inkHover = "hover:text-champagne";

  return (
    <>
      <motion.header
        initial={reduced ? undefined : { y: -20, opacity: 0 }}
        animate={reduced ? undefined : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled ? "bg-ivory/95 backdrop-blur border-b border-line shadow-none" : "bg-gradient-to-b from-charcoal/60 to-transparent"}
        `}
      >
        <div className="container-page flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`md:hidden p-2 -ml-2 ${ink} ${inkHover}`}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className={`editorial-h3 text-lg md:text-xl tracking-tight ${ink}`}>
            {BRAND.wordmark}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`label ${ink} ${inkHover} transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className={`p-2 ${ink} ${inkHover}`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/wishlist" className={`relative p-2 ${ink} ${inkHover}`} aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-champagne text-charcoal text-[0.6rem] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className={`relative p-2 ${ink} ${inkHover}`} aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-burgundy text-ivory text-[0.6rem] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <Link href="/admin/login" className={`p-2 ${ink} ${inkHover}`} aria-label="Admin">
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile cart + search */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className={`p-2 ${ink}`} aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setCartOpen(true)} className={`relative p-2 ${ink}`} aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-burgundy text-ivory text-[0.6rem] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <WhatsAppButton />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} side="left" width="w-full">
      <div className="flex flex-col h-full bg-ivory">
        <div className="p-6 border-b border-line">
          <Link href="/" onClick={onClose} className="editorial-h3 text-charcoal">
            {BRAND.wordmark}
          </Link>
        </div>
        <nav className="flex-1 p-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block py-4 text-xl font-serif text-charcoal border-b border-line"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/admin/login" onClick={onClose} className="block py-4 text-xl font-serif text-charcoal border-b border-line">
            Admin
          </Link>
        </nav>
        <div className="p-6 border-t border-line space-y-4">
          <p className="label">Concierge</p>
          <a href={BRAND.whatsapp} className="block text-charcoal hover:text-burgundy">
            Chat on WhatsApp
          </a>
          <a href={`mailto:${BRAND.email}`} className="block text-charcoal hover:text-burgundy">
            {BRAND.email}
          </a>
        </div>
      </div>
    </Drawer>
  );
}