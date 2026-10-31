












import { useEffect, useState } from "react";
import { getIcon } from "@/shared/icons/lucideByName";
import type { StatsCardProps } from "../types/dashboard.types";

export default function StatsCard({ config, value, change, onClick }: StatsCardProps) {
  const Icon = getIcon(config.icon);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (value == null) return;

    const startTime = performance.now();
    const duration = 900;
    let frameId = 0;

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setAnimatedValue(Math.round(value * easedProgress));
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  const displayValue =
    value == null
      ? "—"
      : config.format === "currency"
      ? `Rs ${animatedValue.toLocaleString("en-IN")}`
      : animatedValue.toLocaleString("en-IN");

  const isPositive = change >= 0;

  return (
    <div
      onClick={onClick}
      className={`flex min-h-[159px] min-w-0 flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_6px_rgba(15,23,42,0.06),0_10px_28px_rgba(15,23,42,0.14)] transition-shadow ${
        onClick ? "cursor-pointer hover:shadow-[0_4px_10px_rgba(15,23,42,0.08),0_16px_36px_rgba(15,23,42,0.20)]" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ background: config.iconBg }}
        >
          <Icon className="text-white" size={20} strokeWidth={2} />
        </div>

        {change !== 0 && (
          <span
            className={`pt-1 text-[13px] font-medium ${
              isPositive ? "text-[#27AE60]" : "text-[#EB3B3B]"
            }`}
          >
            {isPositive ? "+" : ""}
            {change}
            {config.format === "currency" ? "" : "%"}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[26px] font-semibold leading-tight tabular-nums text-slate-900">
          {displayValue}
        </p>
        <p className="mt-1.5 text-[13px] leading-tight text-slate-700">{config.label}</p>
      </div>
    </div>
  );
}