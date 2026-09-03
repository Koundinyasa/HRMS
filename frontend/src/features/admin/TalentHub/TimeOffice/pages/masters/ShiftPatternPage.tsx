import { useState } from "react";
import { Plus } from "lucide-react";
import MastersLayout from "./MastersLayout";
import DateField from "../../components/DateField";
import { SHIFT_PATTERNS } from "../../constants/masters.mock";

export default function ShiftPatternPage() {
  const [selected, setSelected] = useState(SHIFT_PATTERNS[0]?.code ?? null);
  const [shiftType, setShiftType] = useState<"fixed" | "cyclic">("fixed");
  const [employeeWiseWeekOff, setEmployeeWiseWeekOff] = useState(false);
  const [effectiveFrom, setEffectiveFrom] = useState("2026-03-01");
  const pattern = SHIFT_PATTERNS.find((p) => p.code === selected);

  return (
    <MastersLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Shift Pattern</span>
            <button type="button" className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600">
              <Plus size={14} />
            </button>
          </div>
          {SHIFT_PATTERNS.map((p) => (
            <button
              key={p.code}
              type="button"
              onClick={() => setSelected(p.code)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left ${
                selected === p.code ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold flex items-center justify-center">
                {p.code[0]}
              </span>
              {p.name}
            </button>
          ))}
        </div>

        {pattern && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{pattern.name}</h3>
                <p className="text-xs text-slate-500">{pattern.cycleLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <DateField label="Effective From" value={effectiveFrom} onChange={setEffectiveFrom} />
                <button type="button" className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium">Save</button>
              </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">Shift Type:</span>
                <label className="flex items-center gap-1.5 text-sm text-slate-600">
                  <input type="radio" checked={shiftType === "fixed"} onChange={() => setShiftType("fixed")} /> Fixed Shift
                </label>
                <label className="flex items-center gap-1.5 text-sm text-slate-600">
                  <input type="radio" checked={shiftType === "cyclic"} onChange={() => setShiftType("cyclic")} /> Cyclic Shift
                </label>
              </div>
              <label className="flex items-center gap-1.5 text-sm text-slate-600">
                <input type="checkbox" checked={employeeWiseWeekOff} onChange={(e) => setEmployeeWiseWeekOff(e.target.checked)} />
                Employee wise weekoff
              </label>
              <p className="text-xs text-slate-400 basis-full">
                Allows authorised users to update weekly offs for employees, and enables employees to submit weekly off requests for workflow-based approval.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-slate-800">Shift Pattern Summary</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[520px]">
                  <thead className="bg-[#EAF1FE]">
                    <tr className="text-left">
                      <th className="font-semibold text-slate-700 px-4 py-2.5">Shift Name</th>
                      <th className="font-semibold text-slate-700 px-4 py-2.5">Shift Code</th>
                      <th className="font-semibold text-slate-700 px-4 py-2.5">Timings</th>
                      <th className="font-semibold text-slate-700 px-4 py-2.5">Type</th>
                      <th className="font-semibold text-slate-700 px-4 py-2.5">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pattern.shifts.map((shift) => (
                      <tr key={shift.code} className="border-t border-slate-100">
                        <td className="px-4 py-2.5 text-slate-700">{shift.name}</td>
                        <td className="px-4 py-2.5 text-slate-700">{shift.code}</td>
                        <td className="px-4 py-2.5 text-slate-700">{shift.timing}</td>
                        <td className="px-4 py-2.5 text-slate-700">{shift.type}</td>
                        <td className="px-4 py-2.5 text-slate-700">{shift.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-slate-800">Assign Shift Master</h4>
              <div className="flex flex-wrap gap-3">
                <div className="w-32 rounded-lg border border-slate-200 overflow-hidden">
                  <div className="bg-emerald-600 text-white text-xs font-medium text-center py-1.5">All Days</div>
                  <div className="p-2 text-center bg-emerald-50">
                    <p className="text-xs font-semibold text-slate-700">{pattern.shifts[0]?.code}</p>
                    <p className="text-[11px] text-slate-500">{pattern.shifts[0]?.timing}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MastersLayout>
  );
}
