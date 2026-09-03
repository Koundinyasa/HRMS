import { Pencil, Trash2 } from "lucide-react";
import type { AttendanceConfig } from "../types/attendance.types";

function BoolPill({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        value ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
      }`}
    >
      {value ? "True" : "False"}
    </span>
  );
}

export default function AttendanceConfigTable({
  rows,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  rows: AttendanceConfig[];
  onToggleActive: (config: AttendanceConfig) => void;
  onEdit: (config: AttendanceConfig) => void;
  onDelete: (config: AttendanceConfig) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="font-medium text-gray-700">No attendance configurations</h3>
        <p className="mt-1 text-sm text-muted-foreground">Add one to get started.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-3 px-6 font-medium">Attendance Name</th>
          <th className="py-3 px-3 font-medium">Short Name</th>
          <th className="py-3 px-3 font-medium">Salary Calender Days</th>
          <th className="py-3 px-3 font-medium">Attendance Type</th>
          <th className="py-3 px-3 font-medium">Independent</th>
          <th className="py-3 px-3 font-medium">OT Enable</th>
          <th className="py-3 px-3 font-medium">Late In Early Out Enable</th>
          <th className="py-3 px-3 font-medium">Active</th>
          <th className="py-3 px-6 font-medium text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <tr key={c.Id} className="border-b last:border-0">
            <td className="py-3 px-6 font-medium text-gray-800">{c.Name}</td>
            <td className="py-3 px-3 text-gray-700">{c.ShortName}</td>
            <td className="py-3 px-3 text-gray-700">{c.SalaryCalendarDays}</td>
            <td className="py-3 px-3 text-gray-700">{c.AttendanceType}</td>
            <td className="py-3 px-3">
              <BoolPill value={c.Independent} />
            </td>
            <td className="py-3 px-3">
              <BoolPill value={c.OtEnable} />
            </td>
            <td className="py-3 px-3">
              <BoolPill value={c.LateInEarlyOutEnable} />
            </td>
            <td className="py-3 px-3">
              <button
                type="button"
                onClick={() => onToggleActive(c)}
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  c.Active ? "bg-emerald-500" : "bg-gray-300"
                }`}
                aria-label={`Toggle ${c.Name} active`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
                    c.Active ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </td>
            <td className="py-3 px-6">
              <div className="flex justify-end gap-3 text-violet-500">
                <Pencil
                  size={16}
                  className="cursor-pointer hover:text-violet-700"
                  onClick={() => onEdit(c)}
                  aria-label={`Edit ${c.Name}`}
                />
                <Trash2
                  size={16}
                  className="cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => onDelete(c)}
                  aria-label={`Delete ${c.Name}`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
