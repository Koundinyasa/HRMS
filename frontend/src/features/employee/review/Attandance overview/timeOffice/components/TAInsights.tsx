import type { ReactNode } from "react";

import {
  AlarmClockCheck,
  CalendarX2,
  Timer,
  TrendingUp,
} from "lucide-react";

import type {
  TAInsightsProps,
} from "../types/attendanceOverview.types";

import {
  insightBreakdown,
  weeklyHours,
} from "../constants/regularization.constants";

function InsightCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  tone:
    | "sky"
    | "emerald"
    | "red"
    | "amber";
}) {
  const toneMap: Record<string, string> = {
    sky: "bg-sky-100 text-sky-700",
    emerald:
      "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    amber:
      "bg-amber-100 text-amber-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneMap[tone]}`}
        >
          {icon}
        </span>

        <div>
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="text-lg font-bold text-slate-800">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {sub}
      </p>
    </div>
  );
}

export default function TAInsights({
  employeeName,
  month,
}: TAInsightsProps) {
  const maxHours =
    Math.max(
      ...weeklyHours.map(
        (week) => week.hours,
      ),
    );

  const totalBreakdown =
    insightBreakdown.reduce(
      (sum, item) =>
        sum + item.value,
      0,
    );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          icon={
            <TrendingUp className="h-4 w-4" />
          }
          label="Attendance rate"
          value="62%"
          sub={`${employeeName.split(" ")[0]} · ${month}`}
          tone="sky"
        />

        <InsightCard
          icon={
            <Timer className="h-4 w-4" />
          }
          label="Avg hours / day"
          value="08h 12m"
          sub="Across 12.5 present days"
          tone="emerald"
        />

        <InsightCard
          icon={
            <CalendarX2 className="h-4 w-4" />
          }
          label="Absent days"
          value="7.5"
          sub="Highest in Week 4"
          tone="red"
        />

        <InsightCard
          icon={
            <AlarmClockCheck className="h-4 w-4" />
          }
          label="Late-in incidents"
          value="1"
          sub="Aug 25 · 10:01 check-in"
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">
              Weekly work hours
            </h3>

            <span className="text-xs text-slate-400">
              {month}
            </span>
          </div>

          <div className="flex h-44 items-end gap-4">
            {weeklyHours.map(
              (week) => (
                <div
                  key={week.label}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-semibold text-slate-600">
                    {week.hours}h
                  </span>

                  <div className="flex w-full items-end justify-center">
                    <div
                      className="w-8 rounded-t-md bg-sky-500"
                      style={{
                        height: `${Math.max(
                          (week.hours /
                            maxHours) *
                            120,
                          6,
                        )}px`,
                      }}
                    />
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {week.label}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Status breakdown
          </h3>

          <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
            {insightBreakdown.map(
              (item) => (
                <div
                  key={item.label}
                  className={item.color}
                  style={{
                    width: `${
                      totalBreakdown > 0
                        ? (item.value /
                            totalBreakdown) *
                          100
                        : 0
                    }%`,
                  }}
                  title={`${item.label}: ${item.value} days`}
                />
              ),
            )}
          </div>

          <ul className="space-y-2.5">
            {insightBreakdown.map(
              (item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 text-slate-600">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                    />
                    {item.label}
                  </span>

                  <span className="font-semibold text-slate-800">
                    {item.value} days
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
