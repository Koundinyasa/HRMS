





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
  const COLORS = [GREEN, PURPLE];
  const total = men + women || 1;
  const menFraction = men / total;
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
  const purplePath = `M ${boundaryX} ${boundaryY} A ${radius} ${radius} 0 0 1 ${pointOnArc(0)}`;

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
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d={purplePath}
          fill="none"
          stroke={COLORS[1]}
          strokeWidth="22"
          strokeLinecap="round"
        />
        <circle
          cx={boundaryX}
          cy={boundaryY}
          r={markerRadius}
          fill={COLORS[0]}
          stroke="white"
          strokeWidth="4"
        />
      </svg>

      <div className="mt-4 flex w-full items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span
            className="h-[18px] w-[18px] shrink-0 rounded-full"
            style={{ backgroundColor: COLORS[0] }}
          />
          <div className="text-left leading-tight">
            <p className="text-[13px] text-slate-800">{men}%</p>
            <p className="text-[9px] text-slate-700">Men</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="h-[18px] w-[18px] shrink-0 rounded-full"
            style={{ backgroundColor: COLORS[1] }}
          />
          <div className="text-left leading-tight">
            <p className="text-[13px] text-slate-800">{women}%</p>
            <p className="text-[9px] text-slate-700">Women</p>
          </div>
        </div>
      </div>
      <span className="mt-2 text-[12px] text-slate-700">Total Current Employees</span>
    </div>
  );
}

// ---------- Age Range (grouped bars) ----------
export function AgeRangeChart({ data }: { data: AgeRangeDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data}
        barGap={6}
        barCategoryGap="30%"
        margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
      >
        <XAxis
          dataKey="range"
          tick={{ fontSize: 10, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
          tickMargin={6}
        />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Bar dataKey="men" barSize={9} fill={GREEN} radius={[5, 5, 5, 5]} />
        <Bar dataKey="women" barSize={9} fill={PURPLE} radius={[5, 5, 5, 5]} />
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