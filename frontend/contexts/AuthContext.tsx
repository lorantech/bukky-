"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useToast } from "@/components/ui/Toast";
import { api, getApiErrorMessage } from "@/services/api";
import { Button } from "@/components/ui/Button";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "customer";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const refresh = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      setError(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setError(null);
      try {
        const res = await api.post("/auth/login", { email, password });
        const loggedIn: User = res.data.user;
        // Admin console is admin-only: reject non-admin sessions immediately
        // and clear the cookie so middleware doesn't bounce them around.
        if (loggedIn.role !== "admin") {
          await api.post("/auth/logout").catch(() => {});
          setUser(null);
          const msg = "This account is not an admin. Use your admin email.";
          setError(msg);
          toast.error(msg);
          return false;
        }
        setUser(loggedIn);
        toast.success(`Welcome back, ${loggedIn.name ?? "Admin"}`);
        return true;
      } catch (e) {
        const msg = getApiErrorMessage(e);
        setError(msg);
        toast.error(msg);
        return false;
      }
    },
    [toast]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      toast.success("Logged out");
    }
  }, [toast]);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, refresh, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function LoginRequired({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="label">Verifying session…</p>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="editorial-h3 mb-4">Please log in</h2>
        <p className="text-muted mb-6">Sign in to access this page.</p>
        <Button href="/admin/login">Go to login</Button>
      </div>
    );
  }
  if (user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="editorial-h3 mb-4">Admins only</h2>
        <p className="text-muted mb-6">Account {user.email} is not an admin.</p>
        <Button variant="ghost" onClick={() => logout()}>Log out</Button>
      </div>
    );
  }
  return <>{children}</>;
}