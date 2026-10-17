"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users, MessageSquare, Video, Bell, LogOut, X, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/video-reviews", label: "Video Reviews", icon: Video },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export function AdminNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-charcoal/90 backdrop-blur border-b border-line">
        <div className="container-page flex items-center justify-between h-16">
          <Link href="/admin" className="editorial-h3 text-ivory text-lg">
            {BRAND.wordmark}
          </Link>
          <span className="label hidden md:inline-block">Admin</span>
          <div className="flex items-center gap-3">
            <span className="label hidden sm:inline-block text-ivory/70">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" className="!text-ivory !border-ivory/30" onClick={logout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
            <button
              className="md:hidden p-2 text-ivory"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-charcoal/80 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-72 bg-charcoal border-r border-line
          transform transition-transform duration-300 md:translate-x-0 md:static md:h-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="p-4 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide
                  ${active ? "bg-burgundy text-ivory" : "text-ivory/80 hover:bg-ivory/10"}
                `}
              >
                <Icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}