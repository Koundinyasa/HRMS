import { useState } from "react";
import { createPortal } from "react-dom";
import { Bookmark, ChevronDown, Loader2, X } from "lucide-react";
import {
  useAddLeaveTypeToPolicyMutation,
  useUpdateLeaveTypeInPolicyMutation,
} from "../api/settingsApi";

interface LeaveTypeOption {
  id: number;
  name: string;
  code?: string;
}

interface AddLeaveTypeModalProps {
  policyId: number;
  leaveId?: number | null;
  onClose: () => void;
  leaveTypes?: LeaveTypeOption[];
  initialValues?: { leaveTypeId?: number; effectiveFrom?: string };
}

const payMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AddLeaveTypeModal({
  policyId,
  leaveId,
  onClose,
  leaveTypes = [],
  initialValues,
}: AddLeaveTypeModalProps) {
  const [addLeaveType, { isLoading: isAdding }] = useAddLeaveTypeToPolicyMutation();
  const [updateLeaveType, { isLoading: isUpdating }] = useUpdateLeaveTypeInPolicyMutation();
  const [leaveTypeId, setLeaveTypeId] = useState<number | "">(initialValues?.leaveTypeId ?? "");
  const [payMonth, setPayMonth] = useState(() => {
    const initialMonth = initialValues?.effectiveFrom?.split("/")[0];
    return payMonths.find((month) => month.toLowerCase().startsWith(initialMonth?.toLowerCase() ?? "")) ?? "";
  });
  const [error, setError] = useState("");
  const isSaving = isAdding || isUpdating;
  const isEditMode = leaveId !== null && leaveId !== undefined;

  const handleSave = async () => {
    if (!leaveTypeId) {
      setError("Please select a leave type.");
      return;
    }
    if (!payMonth) {
      setError("Please select a pay month.");
      return;
    }

    setError("");
    const year = initialValues?.effectiveFrom?.split("/")[1] || String(new Date().getFullYear());
    try {
      const payload = {
        policyId,
        leaveTypeId: Number(leaveTypeId),
        effectiveFrom: `${payMonth.slice(0, 3)}/${year}`,
        annualQuota: 0,
        creditDay: null,
        carryForwardLimit: 0,
        maxBalance: 0,
        encashmentLimit: 0,
        probationEligible: false,
        noticePeriodEligible: false,
        sandwichApplicable: false,
        includeHoliday: false,
        includeWeekOff: false,
      };
      if (isEditMode) await updateLeaveType(payload).unwrap();
      else await addLeaveType(payload).unwrap();
      onClose();
    } catch (saveError) {
      console.error("Failed to save leave type:", saveError);
      setError("Unable to save the leave type. Please try again.");
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
      onMouseDown={(event) => event.target === event.currentTarget && !isSaving && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-type-modal-title"
        className="w-full max-w-[445px] overflow-hidden rounded-[9px] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.2)]"
      >
        <header className="flex h-[60px] items-center justify-between border-b border-[#E6EAF0] px-5">
          <h2 id="leave-type-modal-title" className="font-urbanist text-[20px] font-semibold text-[#172033]">
            {isEditMode ? "Edit Leave Type" : "Add Leave Type"}
          </h2>
          <button type="button" aria-label="Close" disabled={isSaving} onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100 sm:hidden">
            <X size={18} />
          </button>
        </header>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label htmlFor="leave-type" className="mb-1 block font-urbanist text-[15px] font-medium text-[#172033]">
              Leave Type<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="leave-type"
                value={leaveTypeId}
                disabled={isSaving || isEditMode}
                onChange={(event) => setLeaveTypeId(event.target.value ? Number(event.target.value) : "")}
                className="h-[46px] w-full appearance-none rounded-[7px] border border-[#263244] bg-[#F2F5FA] px-4 pr-10 font-urbanist text-[15px] text-[#263244] outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.code ? `${type.code} - ` : ""}{type.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#697586]" size={17} />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="leave-pay-month" className="sr-only">Pay Month</label>
            <select
              id="leave-pay-month"
              value={payMonth}
              disabled={isSaving}
              onChange={(event) => setPayMonth(event.target.value)}
              className="h-[46px] w-full appearance-none rounded-[7px] border border-transparent bg-[#E9EDF5] px-4 pr-10 font-urbanist text-[15px] text-[#263244] outline-none focus:border-[#263244] focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
            >
              <option value="">Select Pay Month</option>
              {payMonths.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#697586]" size={17} />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          {leaveTypes.length === 0 && <p className="text-xs text-amber-700">No leave types are available to select.</p>}
        </div>

        <footer className="flex justify-end gap-3 border-t border-[#E6EAF0] bg-[#F5F7FB] px-5 py-3.5">
          <button type="button" onClick={onClose} disabled={isSaving} className="flex h-[48px] items-center gap-2 rounded-[7px] border border-[#AAB3C1] bg-white px-5 font-urbanist text-[16px] font-medium text-[#667085] hover:bg-slate-50 disabled:opacity-60">
            <X size={18} /> Close
          </button>
          <button type="button" onClick={handleSave} disabled={isSaving || leaveTypes.length === 0} className="flex h-[48px] items-center gap-2 rounded-[7px] bg-[#2599E8] px-5 font-urbanist text-[16px] font-semibold text-white hover:bg-[#1688D5] disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Bookmark size={18} />}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
