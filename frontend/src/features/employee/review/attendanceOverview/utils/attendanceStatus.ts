// Turns the attendance rows returned by the server into a day number -> status code map.
// Pure functions (no React), used by useAttendanceOverview.

type AttendanceRow = Record<string, unknown>;

const getAttendanceStatus = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "-";
  }

  const status = String(value).trim().toUpperCase();

  if (!status) return "-";

  // Keep the backend attendance codes exactly as they are.
  // P = Present, AB = Absent, H/HD = Holiday, WO = Week Off.
  if (
    status === "P" ||
    status === "AB" ||
    status === "A" ||
    status === "H" ||
    status === "HD" ||
    status === "WO" ||
    status === "W" ||
    status === "LV" ||
    status === "LOP"
  ) {
    return status;
  }

  // Backend may return descriptive values.
  if (status === "PRESENT") return "P";
  if (status === "ABSENT") return "AB";
  if (status === "HOLIDAY") return "H";
  if (status === "WEEK OFF" || status === "WEEK-OFF") return "WO";

  return status;
};

export const extractStatusByDay = (
  source: unknown,
): Record<number, string> => {
  const result: Record<number, string> = {};

  const records: unknown[] = Array.isArray(source)
    ? source
    : source && typeof source === "object"
      ? [source]
      : [];

  for (const item of records) {
    if (!item || typeof item !== "object") continue;

    const row = item as AttendanceRow;

    const metricName = String(
      row.MetricName ??
        row.metricName ??
        row.Metric ??
        row.metric ??
        row.Name ??
        row.name ??
        "",
    )
      .trim()
      .toLowerCase();

    const isWorkStatusRow =
      metricName === "work status" ||
      metricName === "status" ||
      metricName.includes("workstatus") ||
      metricName.includes("attendance");

    if (isWorkStatusRow) {
      for (let day = 1; day <= 31; day += 1) {
        const value =
          row[`Day${day}`] ??
          row[`day${day}`];

        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
        ) {
          result[day] = getAttendanceStatus(value);
        }
      }
    }

    // Also support responses such as:
    // { Day: 1, Status: "P" }
    // { day: 2, WorkStatus: "AB" }
    const dayValue =
      row.Day ??
      row.day ??
      row.DayNumber ??
      row.dayNumber;

    const statusValue =
      row.Status ??
      row.status ??
      row.WorkStatus ??
      row.workStatus ??
      row.AttendanceStatus ??
      row.attendanceStatus;

    const dayNumber = Number(dayValue);

    if (
      Number.isInteger(dayNumber) &&
      dayNumber >= 1 &&
      dayNumber <= 31 &&
      statusValue !== undefined &&
      statusValue !== null
    ) {
      result[dayNumber] =
        getAttendanceStatus(statusValue);
    }

    // Also support overview keys such as:
    // "1 Tue": "P", "2 Wed": "AB", "6 Sun": "WO".
    for (const [key, value] of Object.entries(row)) {
      const match = key.match(/^(\d{1,2})(?:\s|$)/);

      if (!match) continue;

      const dayNumberFromKey = Number(match[1]);

      if (
        dayNumberFromKey >= 1 &&
        dayNumberFromKey <= 31 &&
        value !== undefined &&
        value !== null
      ) {
        const normalized =
          getAttendanceStatus(value);

        if (normalized !== "-") {
          result[dayNumberFromKey] =
            normalized;
        }
      }
    }
  }

  return result;
};
