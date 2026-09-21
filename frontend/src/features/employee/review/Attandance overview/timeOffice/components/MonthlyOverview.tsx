import { Calendar, CheckCircle2, XCircle, ArrowRight, ArrowLeft, History } from "lucide-react";

import type {
  MonthlyOverviewProps,
} from "../types/attendanceOverview.types";

import { readString } from "../validations/regularization.validations";

function readOverviewMetric(
  overview: unknown,
  classification: string,
  keys: string[],
  fallback: string,
): string {
  if (Array.isArray(overview)) {
    const expected = classification.toLowerCase().replace(/[^a-z]/g, "");
    const row = overview.find(
      (item) =>
        item &&
        typeof item === "object" &&
        String((item as Record<string, unknown>).Classification ?? "")
          .toLowerCase()
          .replace(/[^a-z]/g, "") === expected,
    ) as Record<string, unknown> | undefined;

    if (row?.Value !== undefined && row.Value !== null) {
      return String(row.Value);
    }
  }

  return readString(overview, keys, fallback);
}

export default function MonthlyOverview({
  selectedMonth,
  overview,
  overviewStats,
  onOpenDetail,
}: MonthlyOverviewProps) {
  const iconFor = (label: string) => {
    switch (label) {
      case "Present Days":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Absent Days":
        return <XCircle className="h-4 w-4" />;
      case "Early In":
      case "Late In":
        return <ArrowRight className="h-4 w-4" />;
      case "Early Out":
        return <ArrowLeft className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          Monthly Overview
        </h3>

        <span className="flex items-center gap-1 text-xs font-medium text-sky-700">
          <Calendar className="h-3.5 w-3.5" />
          {selectedMonth}
        </span>
      </div>

      <div className="mb-2 flex divide-x divide-white/30 overflow-hidden rounded-lg bg-sky-600 text-white">
        <div className="flex-1 px-3 py-3 text-center">
          <div className="text-lg font-bold">
            {readOverviewMetric(
              overview,
              "Total Hours",
              [
                "totalHours",
                "TotalHours",
                "total_hours",
                "totalWorkHours",
                "TotalWorkHours",
              ],
              "0.00",
            )}
          </div>
          <div className="text-[11px] opacity-90">
            Total Hours
          </div>
        </div>

        <div className="flex-1 px-3 py-3 text-center">
          <div className="text-lg font-bold">
            {readOverviewMetric(
              overview,
              "Avg Hours Per Day",
              [
                "averageHoursPerDay",
                "AverageHoursPerDay",
                "avgHours",
                "AvgHours",
                "average_hours_per_day",
              ],
              "00:00",
            )}
          </div>
          <div className="text-[11px] opacity-90">
            Avg Hours
          </div>
        </div>

        <div className="flex-1 px-3 py-3 text-center">
          <div className="text-lg font-bold">
            {readOverviewMetric(
              overview,
              "OT Hours",
              [
                "overtimeHours",
                "OvertimeHours",
                "otHours",
                "OTHours",
                "overtime_hours",
              ],
              "00:00",
            )}
          </div>
          <div className="text-[11px] opacity-90">
            OT Hours
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {overviewStats.map((stat) => (
          <div
            key={stat.label}
            onClick={() => {
              const map: Record<string, Parameters<typeof onOpenDetail>[0]> = {
                "Present Days": "present",
                "Absent Days": "absent",
                "Early In": "earlyIn",
                "Late In": "lateIn",
                "Early Out": "earlyOut",
                Overstay: "overstay",
              };

              const key = map[stat.label];

              if (key) onOpenDetail(key);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();

                const map: Record<string, Parameters<typeof onOpenDetail>[0]> = {
                  "Present Days": "present",
                  "Absent Days": "absent",
                  "Early In": "earlyIn",
                  "Late In": "lateIn",
                  "Early Out": "earlyOut",
                  Overstay: "overstay",
                };

                const key = map[stat.label];

                if (key) onOpenDetail(key);
              }
            }}
            className="-mx-2 grid cursor-pointer grid-cols-[minmax(0,1fr)_190px] items-center gap-2 rounded-md px-2 py-3 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <div className="flex min-w-0 items-center gap-2 text-slate-700">
              {iconFor(stat.label)}
              <span className="truncate text-sm">
                {stat.label}
              </span>
            </div>

            <div className="grid grid-cols-[100px_82px] items-center gap-2">
              <div className="h-1.5 w-[100px] overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${stat.barColor}`}
                  style={{
                    width: `${stat.percent}%`,
                  }}
                />
              </div>

              <span
                className={`whitespace-nowrap text-right text-sm font-semibold ${stat.valueColor}`}
              >
                {stat.value} / {stat.total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
