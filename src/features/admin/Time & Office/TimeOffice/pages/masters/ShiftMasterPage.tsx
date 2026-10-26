import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import MastersLayout from "./MastersLayout";
import { SHIFT_MASTER_ROWS } from "../../constants/masters.mock";

export default function ShiftMasterPage() {
  const [query, setQuery] = useState("");
  const rows = SHIFT_MASTER_ROWS.filter((row) =>
    `${row.shiftCode} ${row.shiftName}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <MastersLayout>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
        <div className="flex items-center justify-end gap-2 px-4 py-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              className="h-9 pl-8 pr-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-400"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="button" className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium flex items-center gap-1.5">
            <Plus size={14} /> Shift
          </button>
        </div>

        <div className="px-4 pb-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#EAF1FE]">
              <tr className="text-left">
                <th className="font-semibold text-slate-700 px-4 py-3">Shift Code</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Shift Name</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Start Time</th>
                <th className="font-semibold text-slate-700 px-4 py-3">End Time</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.shiftCode} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{row.shiftCode}</td>
                  <td className="px-4 py-3 text-slate-700">{row.shiftName}</td>
                  <td className="px-4 py-3 text-slate-700">{row.startTime}</td>
                  <td className="px-4 py-3 text-slate-700">{row.endTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-slate-400">
                      <button type="button" className="hover:text-emerald-600"><Pencil size={15} /></button>
                      <button type="button" className="hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">No shifts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MastersLayout>
  );
}
