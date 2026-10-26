import { useState } from "react";
import { toast } from "react-toastify";
import { Camera, ClipboardEdit, MapPin, Pencil, Plus, TimerReset, UserCheck, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PunchEntryModal from "./PunchEntryModal";
import {
  useAddDailyLogPunchMutation,
  useApplyDailyLogLeaveMutation,
  useCorrectDailyLogStatusMutation,
  useEditDailyLogPunchMutation,
} from "../api/regularizationApi";
import type { DailyLog, DailyLogPunch } from "../types/timeoffice.types";

interface DailyLogModalProps {
  log: DailyLog;
  employeeId: string;
  date: string;
  onClose: () => void;
}

/** The "Daily Log of {employee} on {date}" drill-down opened from an attendance grid cell. */
export default function DailyLogModal({ log, employeeId, date, onClose }: DailyLogModalProps) {
  const [editingPunch, setEditingPunch] = useState<DailyLogPunch | null>(null);
  const [addingPunch, setAddingPunch] = useState(false);
  const [correctingStatus, setCorrectingStatus] = useState(false);
  const [applyingLeave, setApplyingLeave] = useState(false);

  const [addPunch] = useAddDailyLogPunchMutation();
  const [editPunch] = useEditDailyLogPunchMutation();

  const savePunch = async (direction: "In" | "Out", time: string, remarks: string) => {
    try {
      if (editingPunch?.punchId) {
        await editPunch({ punchId: editingPunch.punchId, punchType: direction, time, remarks }).unwrap();
      } else {
        await addPunch({ employeeId, date, punchType: direction, time, remarks }).unwrap();
      }
      toast.success("Punch saved");
      setEditingPunch(null);
      setAddingPunch(false);
    } catch {
      toast.error("Failed to save punch. Please try again.");
    }
  };

  return (
    <>
      <Dialog open onOpenChange={(next) => !next && onClose()}>
        <DialogContent showCloseButton className="sm:max-w-2xl p-0 gap-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-slate-800">Daily Log of {log.empName} on {log.date}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCorrectingStatus(true)}
                className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-1.5"
              >
                <ClipboardEdit size={13} /> Correct Status
              </button>
              <button
                type="button"
                onClick={() => setApplyingLeave(true)}
                className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-1.5"
              >
                <UserCheck size={13} /> Apply Leave
              </button>
              <button
                type="button"
                onClick={() => setAddingPunch(true)}
                className="h-8 px-3 rounded-lg bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5"
              >
                <Plus size={13} /> Add Punch
              </button>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1">FH: {log.fhStatus}</span>
              <span className="text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 px-2.5 py-1">SH: {log.shStatus}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatTile icon={<TimerReset size={14} className="text-red-500" />} label="Late In" value={log.lateIn} />
              <StatTile icon={<TimerReset size={14} className="text-amber-500" />} label="Early Out" value={log.earlyOut} />
              <StatTile icon={<TimerReset size={14} className="text-emerald-500" />} label="Total Hours" value={log.totalHours} />
              <StatTile icon={<TimerReset size={14} className="text-sky-500" />} label="OT" value={log.ot} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">Permissions</p>
              <p className="text-sm text-sky-600">Permissions Not Found</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#EAF1FE]">
                  <tr className="text-left">
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Punch Type</th>
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Punch Time</th>
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Entry Type</th>
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Location</th>
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Selfie</th>
                    <th className="font-semibold text-slate-700 px-3 py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {log.punches.map((punch, i) => (
                    <tr key={punch.punchId ?? i} className="border-t border-slate-100">
                      <td className={`px-3 py-2.5 font-medium ${punch.direction === "In" ? "text-emerald-600" : "text-red-500"}`}>{punch.direction}</td>
                      <td className="px-3 py-2.5 text-slate-700">{punch.time}</td>
                      <td className="px-3 py-2.5 text-slate-700">{punch.entryType}</td>
                      <td className="px-3 py-2.5 text-slate-400"><MapPin size={15} /></td>
                      <td className="px-3 py-2.5 text-slate-400"><Camera size={15} /></td>
                      <td className="px-3 py-2.5">
                        <button type="button" onClick={() => setEditingPunch(punch)} className="text-emerald-500 hover:text-emerald-700">
                          <Pencil size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
            <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {(editingPunch || addingPunch) && (
        <PunchEntryModal
          date={log.date}
          punch={editingPunch ?? undefined}
          onClose={() => {
            setEditingPunch(null);
            setAddingPunch(false);
          }}
          onSave={savePunch}
        />
      )}

      {correctingStatus && (
        <CorrectStatusModal employeeId={employeeId} date={date} onClose={() => setCorrectingStatus(false)} />
      )}

      {applyingLeave && (
        <ApplyLeaveModal employeeId={employeeId} date={date} onClose={() => setApplyingLeave(false)} />
      )}
    </>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-xs text-slate-500">{icon} {label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function CorrectStatusModal({ employeeId, date, onClose }: { employeeId: string; date: string; onClose: () => void }) {
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [correctStatus, { isLoading }] = useCorrectDailyLogStatusMutation();

  const handleSave = async () => {
    try {
      await correctStatus({ employeeId, date, status, remarks }).unwrap();
      toast.success("Status corrected");
      onClose();
    } catch {
      toast.error("Failed to correct status. Please try again.");
    }
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm p-0 gap-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Correct Status</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <label className="text-sm text-slate-700 flex flex-col gap-1">
            Status<span className="text-red-500">*</span>
            <input
              placeholder="e.g. Present, Absent, Half Day"
              className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </label>
          <label className="text-sm text-slate-700 flex flex-col gap-1">
            Remarks
            <input
              placeholder="Enter Remarks"
              className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">Close</button>
          <button
            type="button"
            disabled={!status || isLoading}
            onClick={handleSave}
            className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ApplyLeaveModal({ employeeId, date, onClose }: { employeeId: string; date: string; onClose: () => void }) {
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [applyLeave, { isLoading }] = useApplyDailyLogLeaveMutation();

  const handleSave = async () => {
    try {
      await applyLeave({ employeeId, date, leaveTypeId: Number(leaveTypeId), remarks }).unwrap();
      toast.success("Leave applied");
      onClose();
    } catch {
      toast.error("Failed to apply leave. Please try again.");
    }
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm p-0 gap-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Apply Leave</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <label className="text-sm text-slate-700 flex flex-col gap-1">
            Leave Type<span className="text-red-500">*</span>
            <input
              type="number"
              placeholder="Leave Type Id"
              className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none"
              value={leaveTypeId}
              onChange={(e) => setLeaveTypeId(e.target.value)}
            />
          </label>
          <label className="text-sm text-slate-700 flex flex-col gap-1">
            Remarks
            <input
              placeholder="Enter Remarks"
              className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">Close</button>
          <button
            type="button"
            disabled={!leaveTypeId || isLoading}
            onClick={handleSave}
            className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
