"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Package, ShoppingBag, Users, MessageSquare, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

export default function AdminOverview() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="editorial-h2">Overview</h1>
        <p className="label mt-2">Welcome back, {user?.name || "Admin"}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Revenue" value="—" icon={ShoppingBag} />
        <StatCard label="Orders" value="—" icon={Package} />
        <StatCard label="Customers" value="—" icon={Users} />
        <StatCard label="Pending Reviews" value="—" icon={MessageSquare} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-ivory/5 border border-line p-6">
          <h3 className="label mb-4">Recent Orders</h3>
          <p className="text-sm text-ivory/60">No orders yet. Connect the orders API to populate this.</p>
        </div>
        <div className="bg-ivory/5 border border-line p-6">
          <h3 className="label mb-4">Pending Reviews</h3>
          <p className="text-sm text-ivory/60">No pending reviews. Connect the reviews API to populate this.</p>
        </div>
      </div>

      <div className="mt-6 bg-burgundy/10 border border-burgundy/30 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
        <p className="text-sm text-ivory/80">
          Admin dashboard placeholder. Full pages (products, orders, customers, reviews, video reviews, notifications) will be built in subsequent phases.
        </p>
      </div>
    </div>
  );
}