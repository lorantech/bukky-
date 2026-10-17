"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND, whatsappUrl } from "@/lib/brand";
import { subscribe } from "@/services/store";
import { useToast } from "@/components/ui/Toast";

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const toast = useToast();

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const msg = await subscribe(email);
      toast.success(msg);
      setEmail("");
    } catch {
      toast.error("Could not subscribe — try again");
    }
  };

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container-page section-py">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="editorial-h3 text-ivory text-xl">
              {BRAND.wordmark}
            </Link>
            <p className="mt-4 text-sm text-ivory/60 max-w-xs">
              {BRAND.description}
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="label text-champagne hover:text-ivory"
              >
                WhatsApp
              </a>
              <a href={`https://instagram.com/${BRAND.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="label text-champagne hover:text-ivory">
                Instagram
              </a>
              <a href={`https://tiktok.com/@${BRAND.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="label text-champagne hover:text-ivory">
                TikTok
              </a>
            </div>
            <form onSubmit={join} className="mt-6 max-w-xs">
              <p className="label !text-ivory/60 mb-3">Style letters</p>
              <div className="flex border-b border-ivory/25 focus-within:border-champagne transition-colors">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Your email" className="flex-1 bg-transparent py-3 text-sm placeholder:text-ivory/30 focus:outline-none" />
                <button type="submit" className="label !text-champagne pl-4 hover:!text-ivory">Join</button>
              </div>
            </form>
          </div>

          <div>
            <h4 className="label mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li><Link href="/shop" className="hover:text-ivory">All Products</Link></li>
              <li><Link href="/custom-orders" className="hover:text-ivory">Custom Orders</Link></li>
              <li><Link href="/track" className="hover:text-ivory">Track Order</Link></li>
              <li><Link href="/wishlist" className="hover:text-ivory">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="label mb-4">About</h4>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li><Link href="/about" className="hover:text-ivory">Our Story</Link></li>
              <li><Link href="/about#atelier" className="hover:text-ivory">Atelier</Link></li>
              <li><Link href="/faq" className="hover:text-ivory">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="label mb-4">Concierge</h4>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li><a href={`mailto:${BRAND.email}`} className="hover:text-ivory">{BRAND.email}</a></li>
              <li><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">Chat on WhatsApp</a></li>
              <li><Link href="/admin/login" className="hover:text-ivory">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory/40">
            &copy; {year} {BRAND.wordmark}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-ivory/40">
            <Link href="/privacy" className="hover:text-ivory">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ivory">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}