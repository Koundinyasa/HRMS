import type { AttendanceDay, AttendanceOverviewData } from "../types/regularization.types";

/**
 * Backend returns an array of employee calendar rows (or metric rows).
 * The UI components expect one overview object (or null), so pick the right
 * row for the selected employee and fill in totals from the daily rows when
 * the server did not send them.
 */
export function buildOverview(
  rawOverview: unknown,
  selectedEmployeeId: string | number | undefined,
  days: AttendanceDay[],
): AttendanceOverviewData {
  let base: Record<string, unknown> | null;

  if (!rawOverview) {
    base = null;
  } else if (Array.isArray(rawOverview)) {
    const metricRows = rawOverview.filter(
      (row) =>
        row &&
        typeof row === "object" &&
        "Classification" in row &&
        "Value" in row,
    ) as Array<Record<string, unknown>>;

    if (metricRows.length > 0) {
      base = metricRows.reduce<Record<string, unknown>>(
        (summary, row) => {
          const classification = String(row.Classification ?? "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z]/g, "");
          const keyByClassification: Record<string, string> = {
            totalhours: "totalHours",
            avghoursperday: "averageHoursPerDay",
            averagehoursperday: "averageHoursPerDay",
            othours: "overtimeHours",
            presentdays: "presentDays",
            absentdays: "absentDays",
            earlyin: "earlyIn",
            latein: "lateIn",
            earlyout: "earlyOut",
            overstay: "overstay",
          };
          const key = keyByClassification[classification];
          const [amount, total] = String(row.Value ?? "")
            .split("/")
            .map((part) => part.trim());
          const numericAmount = Number(amount);
          const numericTotal = Number(total);

          if (key) {
            summary[key] = Number.isFinite(numericAmount)
              ? numericAmount
              : amount;
          }

          if (Number.isFinite(numericTotal)) {
            summary.totalDays = numericTotal;
          }

          return summary;
        },
        {},
      );
    } else if (!selectedEmployeeId) {
      base =
        rawOverview[0] && typeof rawOverview[0] === "object"
          ? (rawOverview[0] as Record<string, unknown>)
          : null;
    } else {
      const match = rawOverview.find(
        (row) =>
          String(
            (row as Record<string, unknown>).EmployeeID ?? "",
          ) === String(selectedEmployeeId),
      );
      const selectedRow = match ?? rawOverview[0];
      base =
        selectedRow && typeof selectedRow === "object"
          ? (selectedRow as Record<string, unknown>)
          : null;
    }
  } else {
    base = rawOverview as Record<string, unknown>;
  }

  // Enrich with simple aggregates from normalized days when
  // the overview payload does not already carry totals.
  // This keeps Monthly Overview cards from staying at 0.00
  // when only the metric-style daily rows are present.
  if (base && days.length > 0) {
    const hasTotalHours =
      base.totalHours != null ||
      base.TotalHours != null ||
      base.total_hours != null ||
      base.totalWorkHours != null;

    if (!hasTotalHours) {
      // Sum workHours / grossWorkHours that look like HH:MM or numbers
      let totalMinutes = 0;
      for (const d of days) {
        const raw =
          d.workHours || d.grossWorkHours || "";
        if (!raw) continue;
        const str = String(raw).trim();
        if (str.includes(":")) {
          const [h, m] = str.split(":").map(Number);
          if (Number.isFinite(h) && Number.isFinite(m)) {
            totalMinutes += h * 60 + m;
          }
        } else {
          const n = Number(str);
          if (Number.isFinite(n)) totalMinutes += n * 60;
        }
      }
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      base = {
        ...base,
        totalHours: `${hrs}.${String(mins).padStart(2, "0")}`,
        TotalHours: `${hrs}.${String(mins).padStart(2, "0")}`,
      };
    }
  }

  return base as unknown as AttendanceOverviewData;
}
