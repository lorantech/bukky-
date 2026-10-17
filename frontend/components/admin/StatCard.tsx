import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-ivory/5 border border-line p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="label">{label}</span>
        <Icon className="w-5 h-5 text-champagne" />
      </div>
      <div className="editorial-h3 text-ivory">{value}</div>
      {trend && <p className="text-xs text-ivory/50 mt-1">{trend}</p>}
    </div>
  );
}