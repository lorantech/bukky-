"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BRAND } from "@/lib/brand";
import { fadeUp, usePrefersReducedMotion } from "@/lib/motion";

export default function AdminLogin() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-charcoal text-ivory" />}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const reduced = usePrefersReducedMotion();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const from = searchParams.get("from") ?? "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = await login(email, password);
    if (ok) {
      router.push(from);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-charcoal text-ivory px-4">
      <motion.div
        initial={reduced ? undefined : "hidden"}
        animate={reduced ? undefined : "visible"}
        variants={fadeUp}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="editorial-h2 text-ivory">{BRAND.wordmark}</h1>
          <p className="label mt-3">Admin Console</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-ivory text-charcoal p-8">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
          <div className="mt-5">
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="mt-4 text-sm text-burgundy">{error}</p>}
          <Button type="submit" variant="primary" className="w-full mt-6" loading={loading}>
            Sign in
          </Button>
          <p className="mt-6 text-center text-xs text-muted">
            Concierge: {BRAND.email}
          </p>
        </form>
      </motion.div>
    </main>
  );
}