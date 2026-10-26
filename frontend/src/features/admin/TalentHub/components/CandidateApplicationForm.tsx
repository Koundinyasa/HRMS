import type { FormEvent } from "react";

type DropdownOption = { value: string; label: string };

interface CandidateApplicationFormProps {
  jobOpeningOptions: DropdownOption[];
  sourceOptions: DropdownOption[];
  dropdownsLoading: boolean;
  dropdownsError: string;
  isSubmitting: boolean;
  source: string;
  referrer: string;
  onSourceChange: (source: string) => void;
  onReferrerChange: (referrer: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CandidateApplicationForm({
  jobOpeningOptions,
  sourceOptions,
  dropdownsLoading,
  dropdownsError,
  isSubmitting,
  source,
  referrer,
  onSourceChange,
  onReferrerChange,
  onSubmit,
}: CandidateApplicationFormProps) {
  const isEmployeeReferral = source.toLowerCase() === "employee referral";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Job opening
          <select
            name="jobOpeningId"
            required
            defaultValue=""
            disabled={dropdownsLoading || jobOpeningOptions.length === 0}
            className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 disabled:bg-[#f5f6f4]"
          >
            <option value="" disabled>
              {dropdownsLoading
                ? "Loading job openings..."
                : "Select a job opening"}
            </option>
            {jobOpeningOptions.map((opening) => (
              <option key={opening.value} value={opening.value}>
                {opening.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Full name
          <input
            name="fullName"
            type="text"
            required
            maxLength={200}
            className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={150}
            className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Phone
          <input
            name="phone"
            type="tel"
            required
            maxLength={20}
            className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Address
          <input
            name="address"
            type="text"
            maxLength={500}
            className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Source
          <select
            name="source"
            value={source}
            disabled={dropdownsLoading}
            onChange={(event) => onSourceChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
          >
            <option value="">
              {dropdownsLoading
                ? "Loading sources..."
                : "Select a source (optional)"}
            </option>
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Referred by
          <input
            name="referredBy"
            type="text"
            value={referrer}
            onChange={(event) => onReferrerChange(event.target.value)}
            required={isEmployeeReferral}
            disabled={!isEmployeeReferral}
            maxLength={100}
            placeholder={
              isEmployeeReferral
                ? "Enter referring employee name"
                : "Available for Employee Referral only"
            }
            className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 disabled:cursor-not-allowed disabled:bg-[#f3f5f3] disabled:text-[#87938c]"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Resume (PDF, DOC, DOCX; max 5 MB)
          <input
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            className="block min-h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-[#f5f6f4] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#46534a]"
          />
        </label>
      </div>
      {dropdownsError && (
        <p role="alert" className="text-sm text-rose-700">
          {dropdownsError}
        </p>
      )}
      {!dropdownsLoading &&
        jobOpeningOptions.length === 0 &&
        !dropdownsError && (
          <p className="text-sm text-[#7b8981]">
            No active job openings are available for applications.
          </p>
        )}
      <button
        type="submit"
        disabled={
          isSubmitting ||
          dropdownsLoading ||
          jobOpeningOptions.length === 0 ||
          Boolean(dropdownsError)
        }
        className="inline-flex h-10 items-center rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white transition hover:bg-[#2e533d] disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
