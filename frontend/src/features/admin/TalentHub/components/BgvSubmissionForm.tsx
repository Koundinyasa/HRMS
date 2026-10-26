import type { FormEvent } from "react";

interface BgvSubmissionFormProps {
  applicationId: string;
  result: string;
  remarks: string;
  error: string;
  isSubmitting: boolean;
  onApplicationIdChange: (applicationId: string) => void;
  onResultChange: (result: string) => void;
  onRemarksChange: (remarks: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function BgvSubmissionForm({
  applicationId,
  result,
  remarks,
  error,
  isSubmitting,
  onApplicationIdChange,
  onResultChange,
  onRemarksChange,
  onSubmit,
}: BgvSubmissionFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
    >
      <h3 className="text-base font-semibold text-[#354239]">
        Start Background Verification
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Candidate application ID
          <input
            type="number"
            min="1"
            step="1"
            required
            value={applicationId}
            onChange={(event) => onApplicationIdChange(event.target.value)}
            placeholder="Enter application ID"
            className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          BGV result
          <select
            required
            value={result}
            onChange={(event) => onResultChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
          >
            <option value="">Select result</option>
            <option value="clear">Clear</option>
            <option value="not-clear">Not Clear</option>
          </select>
        </label>
      </div>
      <label className="block space-y-1.5 text-sm font-medium text-[#46534a]">
        Remarks
        <textarea
          value={remarks}
          onChange={(event) => onRemarksChange(event.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Add verification remarks (optional)"
          className="w-full rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
        />
      </label>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-10 items-center rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white transition hover:bg-[#2e533d] disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit BGV"}
      </button>
    </form>
  );
}
