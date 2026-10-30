import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";

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
  const [selectedJobOpeningId, setSelectedJobOpeningId] = useState("");
  const [isJobOpeningDropdownOpen, setIsJobOpeningDropdownOpen] =
    useState(false);
  const jobOpeningDropdownRef = useRef<HTMLDivElement>(null);
  const jobOpeningButtonRef = useRef<HTMLButtonElement>(null);
  const [jobOpeningError, setJobOpeningError] = useState("");
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);
  const selectedJobOpening = jobOpeningOptions.find(
    (opening) => opening.value === selectedJobOpeningId,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!selectedJobOpeningId) {
      event.preventDefault();
      setJobOpeningError("Select a job opening.");
      jobOpeningButtonRef.current?.focus();
      return;
    }
    setJobOpeningError("");
    onSubmit(event);
  };

  useEffect(() => {
    if (!isJobOpeningDropdownOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !jobOpeningDropdownRef.current?.contains(event.target)
      ) {
        setIsJobOpeningDropdownOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsJobOpeningDropdownOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isJobOpeningDropdownOpen]);

  useEffect(() => {
    if (!isSourceDropdownOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !sourceDropdownRef.current?.contains(event.target)
      ) {
        setIsSourceDropdownOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSourceDropdownOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isSourceDropdownOpen]);

  return (
    <form
      onSubmit={handleSubmit}
      onReset={() => {
        setSelectedJobOpeningId("");
        setJobOpeningError("");
      }}
      className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Job opening
          <div className="relative" ref={jobOpeningDropdownRef}>
            <input
              type="hidden"
              name="jobOpeningId"
              value={selectedJobOpeningId}
              required
            />
            <button
              ref={jobOpeningButtonRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isJobOpeningDropdownOpen}
              aria-controls="candidate-job-opening-options"
              disabled={dropdownsLoading || jobOpeningOptions.length === 0}
              onClick={() =>
                setIsJobOpeningDropdownOpen((open) => !open)
              }
              className="flex h-11 w-full items-center justify-between rounded-lg border border-[#dfe4df] bg-white px-3 text-left text-sm font-normal outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 disabled:bg-[#f5f6f4]"
            >
              <span
                className={`truncate ${
                  selectedJobOpening ? "text-[#354239]" : "text-[#929c95]"
                }`}
              >
                {selectedJobOpening?.label ??
                  (dropdownsLoading
                    ? "Loading job openings..."
                    : "Select a job opening")}
              </span>
              <ChevronDown
                className={`ml-2 h-4 w-4 shrink-0 transition-transform ${
                  isJobOpeningDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isJobOpeningDropdownOpen && (
              <div
                id="candidate-job-opening-options"
                role="listbox"
                aria-label="Job openings"
                className="absolute z-20 mt-1 max-h-[180px] w-full overflow-y-auto rounded-lg border border-[#dfe4df] bg-white py-1 shadow-lg"
              >
                {jobOpeningOptions.map((opening) => {
                  const isSelected = opening.value === selectedJobOpeningId;
                  return (
                    <button
                      key={opening.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedJobOpeningId(opening.value);
                        setJobOpeningError("");
                        setIsJobOpeningDropdownOpen(false);
                      }}
                      className={`block min-h-9 w-full px-3 py-2 text-left text-sm font-normal ${
                        isSelected
                          ? "bg-[#fff4dc] text-[#80540d]"
                          : "text-[#354239] hover:bg-[#f5f7f5]"
                      }`}
                    >
                      {opening.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {jobOpeningError && (
            <p role="alert" className="text-xs font-normal text-rose-700">
              {jobOpeningError}
            </p>
          )}
        </div>
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
        <div className="space-y-1.5 text-sm font-medium text-[#46534a]">
          Source
          <div className="relative" ref={sourceDropdownRef}>
            <input type="hidden" name="source" value={source} />
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isSourceDropdownOpen}
              aria-controls="candidate-source-options"
              disabled={dropdownsLoading}
              onClick={() => setIsSourceDropdownOpen((open) => !open)}
              className="flex h-11 w-full items-center justify-between rounded-lg border border-[#dfe4df] bg-white px-3 text-left text-sm font-normal outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 disabled:bg-[#f5f6f4]"
            >
              <span className={source ? "truncate text-[#354239]" : "truncate text-[#929c95]"}>
                {sourceOptions.find((option) => option.value === source)?.label ??
                  (dropdownsLoading
                    ? "Loading sources..."
                    : "Select a source (optional)")}
              </span>
              <ChevronDown
                className={`ml-2 h-4 w-4 shrink-0 transition-transform ${
                  isSourceDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isSourceDropdownOpen && (
              <div
                id="candidate-source-options"
                role="listbox"
                aria-label="Recruitment sources"
                className="absolute z-20 mt-1 max-h-[180px] w-full overflow-y-auto rounded-lg border border-[#dfe4df] bg-white py-1 shadow-lg"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={!source}
                  onClick={() => {
                    onSourceChange("");
                    setIsSourceDropdownOpen(false);
                  }}
                  className={`block min-h-9 w-full px-3 py-2 text-left text-sm font-normal ${
                    !source
                      ? "bg-[#fff4dc] text-[#80540d]"
                      : "text-[#354239] hover:bg-[#f5f7f5]"
                  }`}
                >
                  Select a source (optional)
                </button>
                {sourceOptions.map((option) => {
                  const isSelected = option.value === source;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSourceChange(option.value);
                        setIsSourceDropdownOpen(false);
                      }}
                      className={`block min-h-9 w-full px-3 py-2 text-left text-sm font-normal ${
                        isSelected
                          ? "bg-[#fff4dc] text-[#80540d]"
                          : "text-[#354239] hover:bg-[#f5f7f5]"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
        className="inline-flex h-10 items-center rounded-lg bg-[#e5a538] px-4 text-sm font-semibold text-[#342712] transition hover:bg-[#d99a2b] disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
