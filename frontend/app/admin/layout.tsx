import { type ReactNode } from "react";
import { AuthProvider, LoginRequired } from "@/contexts/AuthContext";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LoginRequired>
        <div className="min-h-screen bg-charcoal text-ivory">
          <AdminNav />
          <main className="container-page section-py">{children}</main>
        </div>
      </LoginRequired>
    </AuthProvider>
  );
}