import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Inbox, Pencil, Plus } from "lucide-react";
import RegularizationLayout from "./RegularizationLayout";
import DateField from "../../components/DateField";
import PunchEntryModal from "../../components/PunchEntryModal";
import { useAddPunchMutation, useGetPunchDetailsQuery, useUpdatePunchMutation } from "../../api/regularizationApi";
import type { PunchDetailRow } from "../../types/timeoffice.types";

const STATUS_STYLES: Record<PunchDetailRow["status"], string> = {
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function PunchPage() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [employeeId, setEmployeeId] = useState("");
  const [editing, setEditing] = useState<PunchDetailRow | null>(null);
  const [adding, setAdding] = useState(false);

  const { data: punches = [] } = useGetPunchDetailsQuery({ date, employeeId: employeeId || undefined });
  const [addPunch] = useAddPunchMutation();
  const [updatePunch] = useUpdatePunchMutation();

  const handleSave = async (punchType: "In" | "Out", time: string, remarks: string) => {
    try {
      if (editing) {
        await updatePunch({ punchId: editing.punchId, punchType, time, remarks }).unwrap();
        toast.success("Punch updated");
      } else {
        await addPunch({ date, punchType, time, remarks }).unwrap();
        toast.success("Punch added");
      }
      setEditing(null);
      setAdding(false);
    } catch {
      toast.error("Failed to save punch. Please try again.");
    }
  };

  return (
    <RegularizationLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-emerald-600">Policy Details</p>
              <p className="text-slate-500 mt-1">N/A</p>
            </div>
            <div>
              <p className="font-semibold text-emerald-600">Shift Details</p>
              <p className="text-slate-500 mt-1">N/A ()</p>
              <p className="text-slate-400 text-xs">--:-- TO --:--</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-600">Select a date and employee to view punches</p>
            <div className="flex items-center gap-2 flex-wrap">
              <DateField value={date} onChange={setDate} />
              <input
                placeholder="Employee ID (optional)"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="h-9 flex-1 min-w-[140px] rounded-lg border border-slate-200 px-2.5 text-sm text-slate-700 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[220px] text-slate-300">
            <Inbox size={72} strokeWidth={1} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Punch Records</h3>
              <p className="text-xs text-slate-500">Review, correct and add punch times</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-500">
                Show All
              </button>
              <button type="button" className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-500 flex items-center gap-1.5">
                <Plus size={14} /> Permission
              </button>
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium flex items-center gap-1.5"
              >
                <Plus size={14} /> Punch
              </button>
            </div>
          </div>

          {punches.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 min-h-[320px] text-slate-300">
              <Inbox size={72} strokeWidth={1} />
              <p className="text-sm font-medium text-amber-600">No Data Found in - Punch</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#EAF1FE]">
                  <tr className="text-left">
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Punch Type</th>
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Time</th>
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Status</th>
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Remarks</th>
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {punches.map((punch) => (
                    <tr key={punch.punchId} className="border-t border-slate-100">
                      <td className={`px-3 py-2.5 font-medium ${punch.direction === "In" ? "text-emerald-600" : "text-red-500"}`}>
                        {punch.direction}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700">{punch.time}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs font-medium rounded-full border px-2.5 py-1 ${STATUS_STYLES[punch.status]}`}>
                          {punch.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">{punch.remarks ?? "—"}</td>
                      <td className="px-3 py-2.5">
                        <button type="button" onClick={() => setEditing(punch)} className="text-emerald-500 hover:text-emerald-700">
                          <Pencil size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {(editing || adding) && (
        <PunchEntryModal
          date={date}
          punch={editing ?? undefined}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
          onSave={handleSave}
        />
      )}
    </RegularizationLayout>
  );
}
