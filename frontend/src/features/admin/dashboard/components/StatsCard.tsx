import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StatsCardProps } from "../types/dashboard.types";

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
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 30,
            height: 30,
            background: config.iconBg, // ✅ per-card color, matches Figma
          }}
        >
          <Icon className="text-white" size={16} />
        </div>

        {change !== 0 && (
          <span
            className={`text-[11px] font-semibold ${
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
        <p className="text-xl font-bold text-slate-800 leading-tight">
          {displayValue}
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">{config.label}</p>
      </div>
    </div>
  );
}