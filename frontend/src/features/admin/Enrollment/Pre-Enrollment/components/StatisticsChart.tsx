import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DotProps } from "recharts";

type TrendDotProps = DotProps & {
  payload?: { week?: string };
};

const data = [
  { week: "Week 01", value: 22 },
  { week: "", value: 25 },
  { week: "", value: 31 },
  { week: "", value: 38 },
  { week: "Week 02", value: 43 },
  { week: "", value: 47 },
  { week: "", value: 50 },
  { week: "Week 03", value: 52 },
  { week: "", value: 49 },
  { week: "", value: 42 },
  { week: "", value: 31 },
  { week: "Week 04", value: 18 },
];

export default function StatisticsChart() {
  return (
    <div className="mt-5 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.10)]">

      {/* Header */}
      <div className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:pt-5">

        <div>
          <h2 className="text-[15px] font-semibold leading-5 text-slate-900">
            Onboarding Trends
          </h2>

          <p className="mt-1 text-[11px] leading-4 text-slate-400">
            Monthly active verification flow &amp; completed candidates
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 pt-1">
          <span className="h-2 w-2 rounded-full bg-orange-500" />

          <span className="text-[11px] font-medium text-slate-400">
            Verification Volume
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="mx-3 mt-4 h-[200px] bg-[#FFF9F6] sm:mx-6 sm:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 18,
              right: 0,
              left: 0,
              bottom: 4,
            }}
          >
            <defs>
              <linearGradient
                id="orangeTrendGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#FF6B00"
                  stopOpacity={0.03}
                />

                <stop
                  offset="100%"
                  stopColor="#FF6B00"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            {/* Horizontal dotted grid */}
            <CartesianGrid
              vertical={false}
              stroke="#E5E7EB"
              strokeDasharray="3 3"
            />

            {/* Bottom labels */}
            {/* <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94A3B8",
                fontSize: 10,
              }}
              interval={0}
              padding={{
                left: 21,
                right: 21,
              }}
            /> */}
            <XAxis
  dataKey="week"
  axisLine={false}
  tickLine={false}
  tick={{
    fill: "#94A3B8",
    fontSize: 10,
  }}
  interval={0}
  padding={{
    left: 25,
    right: 25,
  }}
/>
<XAxis
  dataKey="week"
  axisLine={false}
  tickLine={false}
  tick={{
    fill: "#94A3B8",
    fontSize: 10,
  }}
  interval={0}
  padding={{
    left: 25,
    right: 25,
  }}
/>

            {/* Hidden Y axis */}
            <YAxis
              hide
              domain={[0, 60]}
            />

            {/* Tooltip */}
            <Tooltip
              cursor={false}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                fontSize: "11px",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              }}
            />

            {/* Orange Trend */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FF6900"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="url(#orangeTrendGradient)"
              dot={(props: TrendDotProps) => {
                const { cx, cy, payload } = props;

                if (
                  payload.week === "Week 02" ||
                  payload.week === "Week 03"
                ) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={2.5}
                      fill="#FF6900"
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                    />
                  );
                }

                return <g />;
              }}
              activeDot={{
                r: 4,
                fill: "#FF6900",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom spacing */}
      <div className="h-4" />
    </div>
  );
}
