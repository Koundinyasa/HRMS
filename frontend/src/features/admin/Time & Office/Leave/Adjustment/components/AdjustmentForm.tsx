import { useState } from "react";

interface AdjustmentFormProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: {
    leave: string;
    adjustmentType: string;
    numberOfDays: string;
    remarks: string;
  }) => void;
}

const AdjustmentForm = ({
  open = false,
  onClose,
  onSubmit,
}: AdjustmentFormProps) => {
  const [leave, setLeave] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  const [remarks, setRemarks] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.({
      leave,
      adjustmentType,
      numberOfDays,
      remarks,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 font-[Urbanist]">
      <div className="w-full max-w-[520px] rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-[16px] font-bold leading-[22px] text-slate-800">
            Add New Record
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-[20px] leading-none text-slate-400 transition hover:text-slate-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-5 py-5">
            {/* Leave */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Leave
              </label>

              <select
                value={leave}
                onChange={(event) => setLeave(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none focus:border-[#9a5547]"
              >
                <option value="">Select Leave</option>
              </select>
            </div>

            {/* Adjustment Type */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Adjustment Type
              </label>

              <select
                value={adjustmentType}
                onChange={(event) => setAdjustmentType(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none focus:border-[#9a5547]"
              >
                <option value="">Select Adjustment Type</option>
                <option value="Allot">Allot</option>
                <option value="Avail">Avail</option>
              </select>
            </div>

            {/* Number of Days */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Number Of Days
              </label>

              <input
                type="number"
                min="0"
                step="0.5"
                value={numberOfDays}
                onChange={(event) => setNumberOfDays(event.target.value)}
                placeholder="Enter number of days"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-[#9a5547]"
              />
            </div>

            {/* Remarks */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Remarks
              </label>

              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Enter remarks"
                rows={3}
                className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-[#9a5547]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-9 rounded-md bg-[#9a5547] px-4 text-[13px] font-semibold text-white transition hover:bg-[#7f4234]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustmentForm;