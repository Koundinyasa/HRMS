import {
  PieChart,
  Cell,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import type { BarShapeProps } from "recharts";
import type { AgeRangeDatum, DeptDatum, TenureDatum } from "../types/dashboard.types";
 
// Figma palette
const GREEN = "#1DB884";
const PURPLE = "#5B35E8";
const TENURE_TOP = "#3D0A91";
const TENURE_BOTTOM = "#0A7CF0";
const GRID_ORANGE = "#F6A26B";
 
// ---------- Employee Composition (semi-circle gauge) ----------
export function EmployeeCompositionChart({
  men,
  women,
}: {
  men: number;
  women: number;
}) {
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<"men" | "women" | null>(
    null
  );
  const [hoveredSegment, setHoveredSegment] = useState<"men" | "women" | null>(
    null
  );
 
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);
 
  const COLORS = [GREEN, PURPLE];
  const total = men + women || 1;
  const menFraction = men / total;
  const highlightedSegment = hoveredSegment ?? selectedSegment;
  const centerX = 130;
  const baselineY = 128;
  const radius = 110;
  const boundaryAngle = Math.PI * (1 - menFraction);
  const boundaryX = centerX + radius * Math.cos(boundaryAngle);
  const boundaryY = baselineY - radius * Math.sin(boundaryAngle);
  const markerRadius = 13;
  const pointOnArc = (angle: number) =>
    `${centerX + radius * Math.cos(angle)} ${baselineY - radius * Math.sin(angle)}`;
  const greenPath = `M ${pointOnArc(Math.PI)} A ${radius} ${radius} 0 0 1 ${boundaryX} ${boundaryY}`;
  const purplePath = `M ${pointOnArc(0)} A ${radius} ${radius} 0 0 0 ${boundaryX} ${boundaryY}`;
 
  return (
    <div className="flex w-full flex-col items-center">
      <svg
        aria-label={`Employee composition: ${men}% men and ${women}% women`}
        className="h-[140px] w-full max-w-[260px] overflow-visible"
        viewBox="0 0 260 140"
        role="img"
      >
        <path
          d={greenPath}
          fill="none"
          stroke={COLORS[0]}
          strokeWidth={highlightedSegment === "men" ? 27 : 22}
          strokeLinecap="round"
          pathLength="1000"
          strokeDasharray="1000"
          strokeDashoffset={isAnimated ? 0 : 1000}
          opacity={highlightedSegment && highlightedSegment !== "men" ? 0.35 : 1}
          className="cursor-pointer transition-[stroke-dashoffset,stroke-width,opacity] duration-[1100ms] ease-out motion-reduce:transition-none"
          onMouseEnter={() => setHoveredSegment("men")}
          onMouseLeave={() => setHoveredSegment(null)}
          onClick={() =>
            setSelectedSegment((current) => (current === "men" ? null : "men"))
          }
        />
        <path
          d={purplePath}
          fill="none"
          stroke={COLORS[1]}
          strokeWidth={highlightedSegment === "women" ? 27 : 22}
          strokeLinecap="round"
          pathLength="1000"
          strokeDasharray="1000"
          strokeDashoffset={isAnimated ? 0 : 1000}
          opacity={
            highlightedSegment && highlightedSegment !== "women" ? 0.35 : 1
          }
          className="cursor-pointer transition-[stroke-dashoffset,stroke-width,opacity] duration-[1100ms] ease-out motion-reduce:transition-none"
          onMouseEnter={() => setHoveredSegment("women")}
          onMouseLeave={() => setHoveredSegment(null)}
          onClick={() =>
            setSelectedSegment((current) =>
              current === "women" ? null : "women"
            )
          }
        />
        <circle
          cx={boundaryX}
          cy={boundaryY}
          r={markerRadius}
          fill={COLORS[0]}
          stroke="white"
          strokeWidth="4"
          className="transition-all delay-[1000ms] duration-300 motion-reduce:transition-none"
          style={{
            opacity: isAnimated ? 1 : 0,
            transform: isAnimated ? "scale(1)" : "scale(0.5)",
            transformOrigin: `${boundaryX}px ${boundaryY}px`,
          }}
        />
      </svg>
 
      <div className="mt-4 flex w-full items-center justify-between px-1">
        <button
          type="button"
          aria-pressed={selectedSegment === "men"}
          onClick={() =>
            setSelectedSegment((current) => (current === "men" ? null : "men"))
          }
          onMouseEnter={() => setHoveredSegment("men")}
          onMouseLeave={() => setHoveredSegment(null)}
          className={`flex items-center gap-2.5 rounded-md px-1.5 py-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            highlightedSegment === "men" ? "bg-emerald-50" : "hover:bg-slate-50"
          }`}
        >
          <span
            className="h-[18px] w-[18px] shrink-0 rounded-full"
            style={{ backgroundColor: COLORS[0] }}
          />
          <div className="text-left leading-tight">
            <p className="text-[13px] text-slate-800">{men}%</p>
            <p className="text-[9px] text-slate-700">Men</p>
          </div>
        </button>
        <button
          type="button"
          aria-pressed={selectedSegment === "women"}
          onClick={() =>
            setSelectedSegment((current) =>
              current === "women" ? null : "women"
            )
          }
          onMouseEnter={() => setHoveredSegment("women")}
          onMouseLeave={() => setHoveredSegment(null)}
          className={`flex items-center gap-2.5 rounded-md px-1.5 py-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
            highlightedSegment === "women" ? "bg-violet-50" : "hover:bg-slate-50"
          }`}
        >
          <span
            className="h-[18px] w-[18px] shrink-0 rounded-full"
            style={{ backgroundColor: COLORS[1] }}
          />
          <div className="text-left leading-tight">
            <p className="text-[13px] text-slate-800">{women}%</p>
            <p className="text-[9px] text-slate-700">Women</p>
          </div>
        </button>
      </div>
      <span className="mt-2 text-[12px] text-slate-700">Total Current Employees</span>
    </div>
  );
}
 
// ---------- Age Range (grouped bars) ----------
const CHART_TOP = 4; // must match margin.top in AgeRangeChart
const RISE_MS = 650; // phase 1: bottom -> top of chart
const FALL_MS = 800; // phase 2: top -> real value
const BAR_STAGGER_MS = 0; // 0 = all bars move together; try 40-60 for a wave
 
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
// small, subtle spring when settling at the real value
const easeOutBack = (p: number) => {
  const c1 = 1.1;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};
 
function SettlingBar({ x, y, width, height, fill, index }: BarShapeProps) {
  const bottom = y + height;
  const fullHeight = Math.max(bottom - CHART_TOP, height); // height of the plot area
  const delay = (index ?? 0) * BAR_STAGGER_MS;
 
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
  const [currentHeight, setCurrentHeight] = useState(
    prefersReducedMotion ? height : 0
  );
 
  useEffect(() => {
    if (height <= 0) return;
    if (prefersReducedMotion) {
      setCurrentHeight(height);
      return;
    }
 
    let frame = 0;
    const start = performance.now() + delay;
 
    const tick = (now: number) => {
      const t = now - start;
 
      if (t < 0) {
        setCurrentHeight(0);
      } else if (t < RISE_MS) {
        // 1) all bars go from the bottom up to the top
        setCurrentHeight(fullHeight * easeOutCubic(t / RISE_MS));
      } else if (t < RISE_MS + FALL_MS) {
        // 2) then come down to their respective value
        const p = (t - RISE_MS) / FALL_MS;
        setCurrentHeight(fullHeight + (height - fullHeight) * easeOutBack(p));
      } else {
        setCurrentHeight(height); // exact data height
        return;
      }
      frame = requestAnimationFrame(tick);
    };
 
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [height, fullHeight, delay, prefersReducedMotion]);
 
  if (height <= 0 || currentHeight <= 0.5) return null;
 
  const top = bottom - currentHeight;
  const radius = Math.min(width / 2, currentHeight / 2, 6);
  const path = [
    `M ${x} ${bottom}`,
    `L ${x} ${top + radius}`,
    `Q ${x} ${top} ${x + radius} ${top}`,
    `L ${x + width - radius} ${top}`,
    `Q ${x + width} ${top} ${x + width} ${top + radius}`,
    `L ${x + width} ${bottom}`,
    "Z",
  ].join(" ");
 
  return (
    <path
      d={path}
      fill={fill}
      className="cursor-pointer drop-shadow-sm transition-[filter] duration-150 hover:brightness-110 hover:drop-shadow-md"
    />
  );
}
 
export function AgeRangeChart({ data }: { data: AgeRangeDatum[] }) {
  // New data (or a gender filter that changes the data) => new key => animation replays
  const replayKey = useMemo(() => JSON.stringify(data), [data]);
 
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        key={replayKey}
        data={data}
        barGap={6}
        barCategoryGap="30%"
        margin={{ top: CHART_TOP, right: 4, left: 4, bottom: 0 }}
      >
        <XAxis
          dataKey="range"
          tick={{ fontSize: 10, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
          tickMargin={6}
        />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Bar
          dataKey="men"
          barSize={12}
          fill={GREEN}
          shape={(props: BarShapeProps) => <SettlingBar {...props} />}
          isAnimationActive={false}
        />
        <Bar
          dataKey="women"
          barSize={12}
          fill={PURPLE}
          shape={(props: BarShapeProps) => <SettlingBar {...props} />}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
 
// ---------- Department Distribution (donut) ----------
export function DepartmentDonutChart({
  data,
  total,
}: {
  data: DeptDatum[];
  total: number;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height={184}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={62}
            outerRadius={90}
            paddingAngle={0}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute flex flex-col items-center">
        <span className="text-[28px] font-semibold leading-none text-slate-900">{total}</span>
        <span className="mt-1.5 text-[12px] text-slate-700">Employees</span>
      </div>
    </div>
  );
}
 
// ---------- Tenure Distribution (single bar) ----------
export function TenureDistributionChart({
  data,
  avgTenure,
}: {
  data: TenureDatum[];
  avgTenure: string;
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const chartData = [{ label: "Total", count: total }];
 
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-stretch">
        <div className="flex w-8 shrink-0 items-center justify-center">
          <span
            className="whitespace-nowrap text-[16px] text-slate-900"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Number of Employees
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={44} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tenureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TENURE_TOP} />
                  <stop offset="30%" stopColor={TENURE_TOP} />
                  <stop offset="30%" stopColor={TENURE_BOTTOM} />
                  <stop offset="100%" stopColor={TENURE_BOTTOM} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_ORANGE} strokeWidth={1} vertical={false} />
              <XAxis dataKey="label" hide />
              <YAxis
                width={40}
                tick={{ fontSize: 10, fill: "#475569" }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="count" fill="url(#tenureGradient)" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 flex flex-col items-center">
        <span className="text-[17px] font-semibold text-slate-900">
          Tenure Distribution
        </span>
        <span className="mt-1.5 rounded-sm bg-[#E6F6E1] px-2 py-0.5 text-[13px] text-slate-800">
          Avg. Tenure: {avgTenure}
        </span>
      </div>
    </div>
  );
}
 