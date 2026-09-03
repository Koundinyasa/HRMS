import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DropdownSelect from "../../../components/DropdownSelect";
import type { RegularizationPunch } from "../types/timeoffice.types";

const PUNCH_TYPE_OPTIONS = [
  { label: "In", value: "In" },
  { label: "Out", value: "Out" },
];

interface PunchRegularizationModalProps {
  employeeName: string;
  date: string;
  existingPunch?: RegularizationPunch;
  onClose: () => void;
  onSave: (punchType: "In" | "Out", time: string, remarks: string) => void;
}

/** The "Punch Regularization" modal — add a missing In/Out punch for one employee's date. */
export default function PunchRegularizationModal({
  employeeName,
  date,
  existingPunch,
  onClose,
  onSave,
}: PunchRegularizationModalProps) {
  const [punchType, setPunchType] = useState<"In" | "Out">("In");
  const [time, setTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const dirty = time !== "" || remarks !== "";

  const requestClose = () => (dirty ? setConfirmDiscard(true) : onClose());

  return (
    <>
      <Dialog open onOpenChange={(next) => !next && requestClose()}>
        <DialogContent showCloseButton={false} className="sm:max-w-2xl p-0 gap-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">
              Punch Regularization <span className="text-emerald-600 font-medium ml-1">({employeeName} - {date})</span>
            </h3>
            <button type="button" onClick={requestClose} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">Punches</p>
              {existingPunch ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-sky-600 font-medium">Punch {existingPunch.direction}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">{existingPunch.time}</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5">
                    {existingPunch.status}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No punches recorded</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm text-slate-700 flex flex-col gap-1">
                Punch Type<span className="text-red-500">*</span>
                <DropdownSelect
                  options={PUNCH_TYPE_OPTIONS}
                  value={punchType}
                  onChange={(value) => setPunchType(value as "In" | "Out")}
                  menuClassName="w-24"
                  className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
                />
              </label>
              <label className="text-sm text-slate-700 flex flex-col gap-1">
                Time<span className="text-red-500">*</span>
                <input
                  placeholder="HH:mm (24hr)"
                  className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
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
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
            <button type="button" onClick={requestClose} className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 flex items-center gap-1.5">
              <X size={14} /> Close
            </button>
            <button
              type="button"
              disabled={!time}
              onClick={() => onSave(punchType, time, remarks)}
              className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {confirmDiscard && (
        <Dialog open onOpenChange={(next) => !next && setConfirmDiscard(false)}>
          <DialogContent showCloseButton={false} className="sm:max-w-sm p-0 gap-0">
            <div className="p-5">
              <h3 className="text-sm font-semibold text-slate-800">Form Confirm</h3>
              <p className="text-sm text-amber-600 mt-2">Are you sure You want to Discard your Changes!</p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
              <button type="button" onClick={() => setConfirmDiscard(false)} className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
                Cancel
              </button>
              <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium">
                Discard
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
