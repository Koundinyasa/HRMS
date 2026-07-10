import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StatCardConfig } from "../types/dashboard.types";

interface StatsCardProps {
  config: StatCardConfig;
  value: number;
  change: number;
}

export default function StatsCard({ config, value, change }: StatsCardProps) {
  const Icon = (Icons[config.icon as keyof typeof Icons] ??
    Icons.Circle) as LucideIcon;

  const displayValue =
    value == null
      ? "—"
      : config.format === "currency"
      ? `Rs ${value.toLocaleString("en-IN")}`
      : value.toLocaleString("en-IN");

  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{
            width: 38,
            height: 38,
            background: config.iconBg, // ✅ per-card color, matches Figma
          }}
        >
          <Icon className="text-white" size={18} />
        </div>

        {change !== 0 && (
          <span
            className={`text-xs font-semibold ${
              isPositive ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {isPositive ? "+" : ""}
            {change}
            {config.format === "currency" ? "" : "%"}
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-semibold text-slate-800 leading-tight">
          {displayValue}
        </p>
        <p className="text-xs text-slate-500 mt-1">{config.label}</p>
      </div>
    </div>
  );
}