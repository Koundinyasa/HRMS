import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
  const COLORS = ["#10B981", "#6366F1"];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"          // ✅ anchor center to bottom of chart area
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
      <div className="flex items-center gap-8 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold text-slate-700">
            {men}%
          </span>
          <span className="text-xs text-slate-400">Men</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-sm font-semibold text-slate-700">
            {women}%
          </span>
          <span className="text-xs text-slate-400">Women</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Age Range (grouped bars) ----------
interface AgeRangeDatum {
  range: string;
  men: number;
  women: number;
}

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
interface DeptDatum {
  name: string;
  value: number;
  color: string;
}

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
interface TenureDatum {
  label: string;
  count: number;
}

export function TenureDistributionChart({
  data,
  avgTenure,
}: {
  data: TenureDatum[];
  avgTenure: string;
}) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid stroke="#FED7AA" vertical={false} />
          <XAxis dataKey="label" hide />
          <YAxis
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Number of Employees",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "#94A3B8" },
            }}
          />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-col items-center -mt-2">
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