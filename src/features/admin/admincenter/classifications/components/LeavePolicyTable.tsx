import { Settings, Trash2 } from "lucide-react";
import LeaveIconBadge from "./LeaveIconBadge";
import type { LeavePolicyRow } from "../types/leavePolicy.types";

export default function LeavePolicyTable({
  rows,
  onToggleActive,
  onSettings,
  onDelete,
}: {
  rows: LeavePolicyRow[];
  onToggleActive: (code: string) => void;
  onSettings: (row: LeavePolicyRow) => void;
  onDelete: (code: string) => void;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#EDEBFB] text-gray-700">
          <th className="px-5 py-3.5 text-left font-semibold rounded-l-lg">Leave Name</th>
          <th className="px-5 py-3.5 text-center font-semibold">Short Name</th>
          <th className="px-5 py-3.5 text-center font-semibold">Active</th>
          <th className="px-5 py-3.5 text-right font-semibold rounded-r-lg">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
              No leaves added to this policy yet.
            </td>
          </tr>
        )}

        {rows.map((row) => (
          <tr key={row.code} className="border-b border-gray-100 last:border-0">
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <LeaveIconBadge icon={row.icon} />
                <span className="font-medium text-gray-800">{row.name}</span>
              </div>
            </td>
            <td className="px-5 py-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {row.shortName}
              </span>
            </td>
            <td className="px-5 py-4 text-center">
              <button
                type="button"
                onClick={() => onToggleActive(row.code)}
                className={`inline-block px-4 py-1 rounded-full text-xs font-semibold text-white transition-colors ${
                  row.active ? "bg-emerald-500 hover:bg-emerald-600" : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {row.active ? "True" : "False"}
              </button>
            </td>
            <td className="px-5 py-4">
              <div className="flex items-center justify-end gap-3">
                <Settings
                  size={17}
                  className="text-gray-400 cursor-pointer hover:text-violet-600"
                  onClick={() => onSettings(row)}
                  aria-label={`Settings for ${row.name}`}
                />
                <Trash2
                  size={17}
                  className="text-red-400 cursor-pointer hover:text-red-600"
                  onClick={() => onDelete(row.code)}
                  aria-label={`Delete ${row.name}`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
