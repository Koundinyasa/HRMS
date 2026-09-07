import { useState } from "react";
import { format, getDaysInMonth, parse } from "date-fns";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { FileSpreadsheet, History, SlidersHorizontal } from "lucide-react";
import RegularizationLayout from "./RegularizationLayout";
import PunchFilterBar from "../../components/PunchFilterBar";
import DailyLogModal from "../../components/DailyLogModal";
import DropdownSelect from "../../../../components/DropdownSelect";
import { DAY_STYLES } from "../../constants/regularization.mock";
import { useGetAttendanceMatrixQuery, useGetDailyLogQuery } from "../../api/regularizationApi";
import type { PunchFilters } from "../../types/timeoffice.types";

const BULK_ACTIONS = ["Revert", "Bulk Correction", "Exception", "Process"] as const;

/** Calendar columns for the given "yyyy-MM" month, each carrying the ISO date the cell represents. */
const buildMonthDays = (month: string) => {
  const start = parse(month, "yyyy-MM", new Date());
  return Array.from({ length: getDaysInMonth(start) }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
    return { day: i + 1, weekday: format(date, "EEE"), iso: format(date, "yyyy-MM-dd") };
  });
};

export default function AttendancePage() {
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));
  const [filters, setFilters] = useState<PunchFilters>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<{ empId: string; date: string } | null>(null);
  const [leaveType, setLeaveType] = useState("");

  const monthDays = buildMonthDays(month);
  const { data: rows = [] } = useGetAttendanceMatrixQuery({ month });
  const { data: activeLog } = useGetDailyLogQuery(active ? { employeeId: active.empId, date: active.date } : skipToken);

  const toggleAll = (checked: boolean) => setSelected(checked ? new Set(rows.map((r) => r.empId)) : new Set());
  const toggleOne = (empId: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(empId);
      else next.delete(empId);
      return next;
    });

  return (
    <RegularizationLayout>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <input
          type="month"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm text-slate-700 outline-none"
        />
        <div className="flex items-center gap-2">
          <DropdownSelect
            options={[{ label: "Select Leave Type", value: "" }]}
            value={leaveType}
            onChange={setLeaveType}
            menuClassName="w-44"
            className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm text-slate-700"
          />
          <button type="button" title="Export to Excel" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600">
            <FileSpreadsheet size={16} />
          </button>
          <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500">
            <SlidersHorizontal size={16} />
          </button>
          <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500">
            <History size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 flex-wrap">
        {BULK_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            disabled={selected.size === 0 && action !== "Process"}
            className={`h-9 px-4 rounded-lg text-sm font-medium disabled:opacity-40 ${
              action === "Exception" || action === "Process" ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600"
            }`}
          >
            {action}
          </button>
        ))}
      </div>

      <PunchFilterBar rows={[]} filters={filters} onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))} onClear={() => setFilters({})} />

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#EAF1FE] sticky top-0">
            <tr>
              <th className="text-left font-semibold text-slate-700 px-3 py-2 whitespace-nowrap sticky left-0 bg-[#EAF1FE] z-10">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={rows.length > 0 && selected.size === rows.length} onChange={(e) => toggleAll(e.target.checked)} />
                  Dates
                </label>
              </th>
              {monthDays.map(({ day }) => (
                <th key={day} className="font-semibold text-slate-600 px-1.5 py-1 text-center w-9">{day}</th>
              ))}
            </tr>
            <tr>
              <th className="text-left font-semibold text-slate-700 px-3 py-2 sticky left-0 bg-[#EAF1FE] z-10">Emp Id / Name</th>
              {monthDays.map(({ day, weekday }) => (
                <th key={day} className="font-normal text-slate-400 px-1.5 py-1 text-center text-[11px]">{weekday}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.empId} className="border-t border-slate-100">
                <td className="px-3 py-2 sticky left-0 bg-white z-10 whitespace-nowrap">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selected.has(row.empId)}
                      onChange={(e) => toggleOne(row.empId, e.target.checked)}
                    />
                    <span>
                      <span className="block text-xs text-slate-400">{row.empId}</span>
                      <span className="block font-medium text-slate-700">{row.name}</span>
                    </span>
                  </label>
                </td>
                {row.days.map((cell, i) => (
                  <td key={i} className="px-1 py-1.5 text-center">
                    <button
                      type="button"
                      title={cell.tooltip}
                      onClick={() => setActive({ empId: row.empId, date: monthDays[i]?.iso ?? monthDays[0].iso })}
                      className={`h-7 w-7 rounded-full text-[8px] font-semibold flex items-center justify-center mx-auto leading-none ${DAY_STYLES[cell.code].className}`}
                    >
                      {DAY_STYLES[cell.code].label}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={monthDays.length + 1} className="px-4 py-12 text-center text-slate-400">No data found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-end gap-4 px-4 py-3 text-sm text-slate-500">
          <span>Rows per page 10</span>
          <span>{rows.length === 0 ? 0 : 1} to {rows.length} of {rows.length}</span>
        </div>
      </div>

      {active && activeLog && (
        <DailyLogModal log={activeLog} employeeId={active.empId} date={active.date} onClose={() => setActive(null)} />
      )}
    </RegularizationLayout>
  );
}
