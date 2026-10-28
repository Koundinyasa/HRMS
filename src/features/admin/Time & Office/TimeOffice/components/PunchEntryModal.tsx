import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DropdownSelect from "../../../components/DropdownSelect";

const PUNCH_DIRECTION_OPTIONS = [
  { label: "In", value: "In" },
  { label: "Out", value: "Out" },
];

interface PunchEntryModalProps {
  date: string;
  /** Only direction/time seed the form — accepts any punch-shaped row (daily log or punch tab). */
  punch?: { direction: "In" | "Out"; time: string };
  onClose: () => void;
  onSave: (direction: "In" | "Out", time: string, remarks: string) => void;
}

/** Add/edit a single punch row from the Daily Log modal. */
export default function PunchEntryModal({ date, punch, onClose, onSave }: PunchEntryModalProps) {
  const [direction, setDirection] = useState<"In" | "Out">(punch?.direction ?? "In");
  const [time, setTime] = useState(punch?.time ?? "");
  const [remarks, setRemarks] = useState("");

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent showCloseButton className="sm:max-w-md p-0 gap-0">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Punch Entry on {date}</h3>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <input type="text" value={date} readOnly className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-500" />

          <label className="text-sm text-slate-700 flex flex-col gap-1">
            Punch Type<span className="text-red-500">*</span>
            <DropdownSelect
              options={PUNCH_DIRECTION_OPTIONS}
              value={direction}
              onChange={(value) => setDirection(value as "In" | "Out")}
              menuClassName="w-24"
              className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
            />
          </label>

          <label className="text-sm text-slate-700 flex flex-col gap-1">
            Time<span className="text-red-500">*</span>
            <input
              className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>

          <label className="text-sm text-slate-700 flex flex-col gap-1">
            Remarks
            <textarea
              rows={2}
              placeholder="Enter Remarks"
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none resize-none"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
            Close
          </button>
          <button
            type="button"
            disabled={!time}
            onClick={() => onSave(direction, time, remarks)}
            className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-40"
          >
            Update
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
