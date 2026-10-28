import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ATTENDANCE_OVERVIEW_SERIES,
  PUNCH_MODE_COLORS,
  formatMinutes,
} from "../constants/timeoffice.constants";
import type {
  AttendanceOverviewPoint,
  IrregularityPoint,
  WorkingHoursPoint,
} from "../types/timeoffice.types";

const AXIS = { fontSize: 11, fill: "#64748B" } as const;

function ChartCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function AttendanceOverviewChart({ data }: { data: AttendanceOverviewPoint[] }) {
  return (
    <ChartCard title="Attendance Overview">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="date" tick={AXIS} axisLine={false} tickLine={false}
            label={{ value: "Date", position: "insideBottom", offset: -4, style: AXIS }} />
          <YAxis tick={AXIS} axisLine={false} tickLine={false}
            label={{ value: "Number of Employees", angle: -90, position: "insideLeft", style: AXIS }} />
          <Tooltip cursor={{ fill: "#F8FAFC" }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
          {ATTENDANCE_OVERVIEW_SERIES.map((series) => (
            <Bar key={series.key} dataKey={series.key} name={series.label} fill={series.color} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PunchModeChart({ data }: { data: { mode: string; count: number }[] }) {
  return (
    <ChartCard title="Punch Mode Distribution">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="mode" outerRadius={90} stroke="none">
            {data.map((slice) => (
              <Cell key={slice.mode} fill={PUNCH_MODE_COLORS[slice.mode] ?? "#94A3B8"} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** Late In and Early Out sit side by side under one classification selector. */
export function IrregularityCharts({
  data,
  action,
}: {
  data: IrregularityPoint[];
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800">Attendance Irregularities (Last 7 Days)</h3>
        {action}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SingleBarChart data={data} dataKey="lateIn" title="Late In" color="#A78BFA" yLabel="Employee Count" />
        <SingleBarChart data={data} dataKey="earlyOut" title="Early Out" color="#38BDF8" yLabel="Employee Count" />
      </div>
    </div>
  );
}

export function WorkingHoursCharts({ data }: { data: WorkingHoursPoint[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-slate-800">Average Working Hours (Last 7 Days)</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SingleBarChart data={data} dataKey="avgWorkMinutes" title="Avg Work Hours" color="#A78BFA"
          yLabel="Hours" tickFormatter={formatMinutes} />
        <SingleBarChart data={data} dataKey="avgOtMinutes" title="Avg OT Hours" color="#38BDF8"
          yLabel="Hours" tickFormatter={formatMinutes} />
      </div>
    </div>
  );
}

function SingleBarChart({
  data,
  dataKey,
  title,
  color,
  yLabel,
  tickFormatter,
}: {
  data: readonly { date: string }[];
  dataKey: string;
  title: string;
  color: string;
  yLabel: string;
  tickFormatter?: (value: number) => string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-3">
      <p className="text-xs font-medium text-slate-600 mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="date" tick={AXIS} axisLine={false} tickLine={false}
            label={{ value: "Date", position: "insideBottom", offset: -4, style: AXIS }} />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={tickFormatter}
            label={{ value: yLabel, angle: -90, position: "insideLeft", style: AXIS }} />
          <Tooltip
            cursor={{ fill: "#F8FAFC" }}
            formatter={(value) => (tickFormatter ? tickFormatter(Number(value)) : String(value))}
          />
          <Bar dataKey={dataKey} fill={color} radius={[3, 3, 0, 0]} maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
