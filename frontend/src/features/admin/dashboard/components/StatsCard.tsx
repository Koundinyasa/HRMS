// import * as Icons from "lucide-react";
// import type { LucideIcon } from "lucide-react";
// import type { StatsCardProps } from "../types/dashboard.types";

// export default function StatsCard({ config, value, change }: StatsCardProps) {
//   const Icon = (Icons[config.icon as keyof typeof Icons] ??
//     Icons.Circle) as LucideIcon;

//   const displayValue =
//     value == null
//       ? "—"
//       : config.format === "currency"
//       ? `Rs ${value.toLocaleString("en-IN")}`
//       : value.toLocaleString("en-IN");

//   const isPositive = change >= 0;

//   return (
//     <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex flex-col gap-2">
//       <div className="flex items-center justify-between">
//         <div
//           className="flex items-center justify-center rounded-lg shrink-0"
//           style={{
//             width: 30,
//             height: 30,
//             background: config.iconBg, // ✅ per-card color, matches Figma
//           }}
//         >
//           <Icon className="text-white" size={16} />
//         </div>

//         {change !== 0 && (
//           <span
//             className={`text-[11px] font-semibold ${
//               isPositive ? "text-emerald-600" : "text-red-500"
//             }`}
//           >
//             {isPositive ? "+" : ""}
//             {change}
//             {config.format === "currency" ? "" : "%"}
//           </span>
//         )}
//       </div>

//       <div>
//         <p className="text-xl font-bold text-slate-800 leading-tight">
//           {displayValue}
//         </p>
//         <p className="text-[11px] text-slate-500 mt-0.5">{config.label}</p>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import * as Icons from "lucide-react";
// import type { LucideIcon } from "lucide-react";
// import type { StatsCardProps } from "../types/dashboard.types";

// export default function StatsCard({ config, value, change, onClick }: StatsCardProps) {
//   const Icon = (Icons[config.icon as keyof typeof Icons] ?? Icons.Circle) as LucideIcon;
//   const [animatedValue, setAnimatedValue] = useState(0);

//   useEffect(() => {
//     if (value == null) return;

//     const startTime = performance.now();
//     const duration = 900;
//     let frameId = 0;

//     const animate = (time: number) => {
//       const progress = Math.min((time - startTime) / duration, 1);
//       const easedProgress = 1 - (1 - progress) ** 3;
//       setAnimatedValue(Math.round(value * easedProgress));
//       if (progress < 1) frameId = requestAnimationFrame(animate);
//     };

//     frameId = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(frameId);
//   }, [value]);

//   const displayValue =
//     value == null
//       ? "—"
//       : config.format === "currency"
//       ? `Rs ${animatedValue.toLocaleString("en-IN")}`
//       : animatedValue.toLocaleString("en-IN");

//   const isPositive = change >= 0;

//   return (
//     <div
//       onClick={onClick}
//       className={`flex min-h-[84px] min-w-0 flex-col justify-between gap-2 rounded-[10px] border border-slate-200/80 bg-white px-2.5 py-2.5 shadow-[0_5px_14px_rgba(15,23,42,0.16)] transition-shadow ${
//         onClick ? "cursor-pointer hover:shadow-md" : ""
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         <div
//           className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px]"
//           style={{ background: config.iconBg }}
//         >
//           <Icon className="text-white" size={15} />
//         </div>

//         {change !== 0 && (
//           <span className={`text-[11px] font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
//             {isPositive ? "+" : ""}
//             {change}
//             {config.format === "currency" ? "" : "%"}
//           </span>
//         )}
//       </div>

//       <div>
//         <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold leading-tight tabular-nums text-slate-800">{displayValue}</p>
//         <p className="mt-0.5 text-[8px] leading-tight text-slate-500">{config.label}</p>
//       </div>
//     </div>
//   );
// }
















// import { useEffect, useState } from "react";
// import * as Icons from "lucide-react";
// import type { LucideIcon } from "lucide-react";
// import type { StatsCardProps } from "../types/dashboard.types";

// export default function StatsCard({ config, value, change, onClick }: StatsCardProps) {
//   const Icon = (Icons[config.icon as keyof typeof Icons] ?? Icons.Circle) as LucideIcon;
//   const [animatedValue, setAnimatedValue] = useState(0);

//   useEffect(() => {
//     if (value == null) return;

//     const startTime = performance.now();
//     const duration = 900;
//     let frameId = 0;

//     const animate = (time: number) => {
//       const progress = Math.min((time - startTime) / duration, 1);
//       const easedProgress = 1 - (1 - progress) ** 3;
//       setAnimatedValue(Math.round(value * easedProgress));
//       if (progress < 1) frameId = requestAnimationFrame(animate);
//     };

//     frameId = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(frameId);
//   }, [value]);

//   const displayValue =
//     value == null
//       ? "—"
//       : config.format === "currency"
//       ? `Rs ${animatedValue.toLocaleString("en-IN")}`
//       : animatedValue.toLocaleString("en-IN");

//   const isPositive = change >= 0;

//   return (
//     <div
//       onClick={onClick}
//       className={`flex min-h-[159px] min-w-0 flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-shadow ${
//         onClick ? "cursor-pointer hover:shadow-[0_8px_24px_rgba(15,23,42,0.14)]" : ""
//       }`}
//     >
//       <div className="flex items-start justify-between">
//         <div
//           className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
//           style={{ background: config.iconBg }}
//         >
//           <Icon className="text-white" size={20} strokeWidth={2} />
//         </div>

//         {change !== 0 && (
//           <span
//             className={`pt-1 text-[13px] font-medium ${
//               isPositive ? "text-[#27AE60]" : "text-[#EB3B3B]"
//             }`}
//           >
//             {isPositive ? "+" : ""}
//             {change}
//             {config.format === "currency" ? "" : "%"}
//           </span>
//         )}
//       </div>

//       <div className="mt-4">
//         <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[26px] font-semibold leading-tight tabular-nums text-slate-900">
//           {displayValue}
//         </p>
//         <p className="mt-1.5 text-[13px] leading-tight text-slate-700">{config.label}</p>
//       </div>
//     </div>
//   );
// }














import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StatsCardProps } from "../types/dashboard.types";

export default function StatsCard({ config, value, change, onClick }: StatsCardProps) {
  const Icon = (Icons[config.icon as keyof typeof Icons] ?? Icons.Circle) as LucideIcon;
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