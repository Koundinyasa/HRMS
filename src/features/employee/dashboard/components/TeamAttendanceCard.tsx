import { ChevronsUpDown } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import type { TeamAttendanceRow } from "../types/dashboard.types";

const getValue = (row: TeamAttendanceRow, key: string) => {
  const value = row[key];
  return value == null || value === "" ? "-" : String(value);
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "--";

const getNameKey = (row: TeamAttendanceRow) =>
  Object.keys(row).find((key) =>
    ["members", "member", "fullname", "employeename"].includes(
      key.toLowerCase(),
    ),
  ) ?? "Members";

const getRoleKey = (row: TeamAttendanceRow) =>
  Object.keys(row).find((key) =>
    ["designation", "role", "department"].includes(key.toLowerCase()),
  ) ?? "Designation";

const getStatusClass = (value: string) => {
  const normalized = value.toLowerCase();

  if (normalized.includes("leave")) return "text-orange-500";
  if (normalized === "wfh" || normalized.includes("home")) {
    return "h-3 w-3 rounded-full bg-blue-500";
  }
  if (normalized === "office" || normalized.includes("present")) {
    return "h-3 w-3 rounded-full bg-green-500";
  }
  if (normalized === "absent") return "h-3 w-3 rounded-full bg-red-500";
  return "text-sm text-slate-700";
};

const isColorValue = (value: string) =>
  /^#[0-9a-f]{6}$/i.test(value.trim());

export default function TeamAttendanceCard() {
  const { teamAttendance = [], teamAttendanceLoading } = useDashboard();
  const rows = teamAttendance as TeamAttendanceRow[];
  const firstRow = rows[0];
  const nameKey = firstRow ? getNameKey(firstRow) : "Members";
  const roleKey = firstRow ? getRoleKey(firstRow) : "Designation";
  const columns = firstRow
    ? Object.keys(firstRow).filter(
        (key) => key !== nameKey && key !== roleKey,
      )
    : [];

  return (
    <div
      className="rounded-2xl border w-full min-w-0 overflow-hidden p-4 shadow-sm sm:p-5 lg:p-6"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--primary-border)",
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="dashboard-subheading text-xl" style={{ color: "var(--dashboard-subheading)" }}>
          Team
        </h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500" />In Office</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-500" />Work From Home</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" />Absent</div>
        </div>
      </div>

      <div className="mb-4 mt-4 h-[2px]" style={{ backgroundColor: "var(--primary-border)" }} />

      {teamAttendanceLoading ? (
        <div className="py-8 text-center text-sm text-slate-500">Loading team attendance...</div>
      ) : rows.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500">No team attendance available.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <div
              className="grid grid-cols-[2.4fr_repeat(4,1fr)]"
              style={{ color: "var(--primary-color)" }}
            >
              <div>Members</div>
              {columns.slice(0, 4).map((column) => (
                <div key={column} className="flex items-center gap-1">
                  {column}
                  <ChevronsUpDown size={14} color="var(--primary-color)" />
                </div>
              ))}
            </div>

            <div className="max-h-[336px] overflow-y-auto">
              {rows.map((row, index) => {
                const name = getValue(row, nameKey);
                return (
                  <div
                    key={`${name}-${index}`}
                    className="grid grid-cols-[2.4fr_repeat(4,1fr)] items-center border-t py-4 sm:py-5"
                    style={{ borderColor: "var(--primary-border)" }}
                  >
                    <div className="flex items-center gap-3 pl-2 sm:gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600 sm:h-12 sm:w-12">
                        {getInitials(name)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="break-words text-sm font-medium text-slate-800 sm:text-base">{name}</h4>
                        <p className="mt-0.5 text-sm text-slate-500">{getValue(row, roleKey)}</p>
                      </div>
                    </div>
                    {columns.slice(0, 4).map((column) => {
                      const value = getValue(row, column);
                      const statusClass = getStatusClass(value);
                      return (
                        <div key={column}>
                          {isColorValue(value) ? (
                            <span
                              className="block h-3 w-3 rounded-full"
                              style={{ backgroundColor: value }}
                              aria-label={`Attendance status ${value}`}
                              title={value}
                            />
                          ) : statusClass.startsWith("h-") ? (
                            <span className={statusClass} />
                          ) : (
                            <span className={statusClass}>{value}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
