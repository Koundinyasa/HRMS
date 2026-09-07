import { useEffect, useRef, useState } from "react";
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
import type { AgeRangeDatum, DeptDatum, TenureDatum } from "../types/dashboard.types";

// ---------- Employee Composition (semi-circle gauge) ----------
export function EmployeeCompositionChart({
  men,
  women,
}: {
  men: number;
  women: number;
}) {
  const data = [
    { name: "Men", value: men },
    { name: "Women", value: women },
  ];
  const COLORS = ["#10B981", "#7C3AED"];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Where the two arc segments actually meet, based on the real split —
  // not a fixed top-center point. Recharts sweeps from 180° (left) down to
  // 0° (right) through 90° (top); the Men segment ends, proportionally,
  // at 180° - menFraction * 180°.
  const total = men + women || 1;
  const menFraction = men / total;
  const boundaryDeg = 180 - menFraction * 180;
  const boundaryRad = (boundaryDeg * Math.PI) / 180;

  const HEIGHT = 140;
  const STROKE_MID_RADIUS = (70 + 95) / 2; // midpoint between innerRadius/outerRadius
  const cx = width / 2;
  const cy = HEIGHT; // Pie is anchored with cy="100%"
  const markerX = cx + STROKE_MID_RADIUS * Math.cos(boundaryRad);
  const markerY = cy - STROKE_MID_RADIUS * Math.sin(boundaryRad);

  return (
    <div ref={wrapperRef} className="relative flex flex-col items-center">
      <ResponsiveContainer width="100%" height={HEIGHT}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Joint marker — positioned at the real boundary between segments */}
      {width > 0 && (
        <div
          className="absolute w-4 h-4 rounded-full bg-white shadow-md"
          style={{
            left: markerX,
            top: markerY,
            transform: "translate(-50%, -50%)",
            border: `3px solid ${COLORS[0]}`,
          }}
        />
      )}

      <div className="flex items-center justify-between w-full px-4 -mt-4">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: COLORS[0] }}
          />
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-800">{men}%</p>
            <p className="text-xs text-slate-400">Men</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="leading-tight text-right">
            <p className="text-sm font-bold text-slate-800">{women}%</p>
            <p className="text-xs text-slate-400">Women</p>
          </div>
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: COLORS[1] }}
          />
        </div>
      </div>
      <span className="text-xs text-slate-400 mt-2">Total Current Employees</span>
    </div>
  );
}

// ---------- Age Range (grouped bars) ----------
export function AgeRangeChart({ data }: { data: AgeRangeDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barGap={3}>
        <XAxis
          dataKey="range"
          tick={{ fontSize: 10, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Bar dataKey="men" fill="#10B981" radius={[3, 3, 0, 0]} />
        <Bar dataKey="women" fill="#6366F1" radius={[3, 3, 0, 0]} />
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
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={62}
            outerRadius={92}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center pointer-events-none">
        <span className="text-2xl font-bold text-slate-800">{total}</span>
        <span className="text-xs text-slate-400">Employees</span>
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
    <div>
      <div className="flex items-stretch">
        <div className="flex items-center justify-center shrink-0 w-5">
          <span
            className="text-[12px] font-bold text-slate-600 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Number of Employees
          </span>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={64} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="tenureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6D28D9" />
                  <stop offset="45%" stopColor="#6D28D9" />
                  <stop offset="45%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#FED7AA" vertical={false} />
              <XAxis dataKey="label" hide />
              <YAxis
                width={32}
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="count" fill="url(#tenureGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex flex-col items-center mt-3">
        <span className="text-xs text-slate-500 font-medium">
          Tenure Distribution
        </span>
        <span className="text-[11px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full mt-1">
          Avg. Tenure: {avgTenure}
        </span>
      </div>
    </div>
  );
}