import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, FileUp, LoaderCircle, Upload, X } from "lucide-react";
import { recruitmentApi } from "../api/recruitment.api";

interface LookupOption {
  value: string;
  label: string;
}

const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const DEFAULT_SOURCE = "Employee Referral";
const MAX_REFERRAL_NAME_LENGTH = 75;
const ACCEPTED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function readLookupValue(
  record: Record<string, unknown>,
  aliases: string[],
): string {
  const normalizedAliases = new Set(aliases.map(normalizeKey));
  const entry = Object.entries(record).find(([key]) =>
    normalizedAliases.has(normalizeKey(key)),
  );
  const value = entry?.[1];
  return value === null || value === undefined || value === ""
    ? ""
    : String(value);
}

function getLookupRows(response: unknown, description: string): unknown[] {
  if (
    !response ||
    typeof response !== "object" ||
    !("success" in response) ||
    !response.success ||
    !("data" in response) ||
    !Array.isArray(response.data)
  ) {
    const message =
      response && typeof response === "object" && "message" in response
        ? response.message
        : undefined;
    throw new Error(
      typeof message === "string"
        ? message
        : `Recruitment API returned an invalid ${description} list.`,
    );
  }
  return response.data;
}

function mapJobOpening(record: unknown): JobOpeningOption {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("Recruitment API returned an invalid job opening.");
  }
  const row = record as Record<string, unknown>;
  const value = readLookupValue(row, [
    "JobOpeningID",
    "OpeningID",
    "JobID",
    "ID",
  ]);
  const label = readLookupValue(row, [
    "JobTitle",
    "OpeningTitle",
    "Title",
    "JobOpeningName",
  ]);
  if (!value || !label) {
    throw new Error(
      "Recruitment API returned a job opening without its ID or title.",
    );
  }
  return {
    value,
    label,
    location: readLookupValue(row, ["Location", "BranchName"]),
  };
}

function mapRecruitmentSource(record: unknown): LookupOption {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("Recruitment API returned an invalid source.");
  }
  const row = record as Record<string, unknown>;
  const name = readLookupValue(row, [
    "SourceName",
    "RecruitmentSourceName",
    "RecruitmentSource",
    "Source",
    "Name",
  ]);
  if (!name) {
    throw new Error("Recruitment API returned a source without its name.");
  }
  return { value: name, label: name };
}

export function ResumeUploadScreen() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [source, setSource] = useState(DEFAULT_SOURCE);
  const [referralName, setReferralName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openings, setOpenings] = useState<JobOpeningOption[]>([]);
  const [sources, setSources] = useState<LookupOption[]>([]);
  const [isLoadingLookups, setIsLoadingLookups] = useState(true);
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadLookups = async () => {
      try {
        const [openingsResponse, sourcesResponse] = await Promise.all([
          recruitmentApi.getJobOpeningMaster(),
          recruitmentApi.getRecruitmentSources(),
        ]);
        const loadedOpenings = getLookupRows(
          openingsResponse,
          "job opening",
        ).map(mapJobOpening);
        const loadedSources = getLookupRows(
          sourcesResponse,
          "recruitment source",
        ).map(mapRecruitmentSource);
        if (!isCurrent) return;
        setOpenings(loadedOpenings);
        setSources(loadedSources);
        setSource(
          loadedSources.find(
            (item) => item.value.toLowerCase() === DEFAULT_SOURCE.toLowerCase(),
          )?.value ?? "",
        );
      } catch (lookupLoadError) {
        if (!isCurrent) return;
        setLookupError(
          lookupLoadError instanceof Error
            ? lookupLoadError.message
            : "Unable to load job openings and recruitment sources.",
        );
      } finally {
        if (isCurrent) setIsLoadingLookups(false);
      }
    };

    void loadLookups();
    return () => {
      isCurrent = false;
    };
  }, []);

  const isEmployeeReferral =
    source.toLowerCase() === DEFAULT_SOURCE.toLowerCase();

  const handleFileChange = (selectedFile?: File) => {
    setError("");
    setSuccess("");
    if (!selectedFile) {
      setFile(null);
      return;
    }
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (
      !ACCEPTED_RESUME_TYPES.has(selectedFile.type) ||
      !["pdf", "doc", "docx"].includes(extension ?? "")
    ) {
      setFile(null);
      setError("Choose a PDF, DOC, or DOCX resume.");
      return;
    }
    if (selectedFile.size > MAX_RESUME_SIZE) {
      setFile(null);
      setError("Resume file must be 5 MB or smaller.");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const jobOpeningId = Number(formData.get("jobOpeningId"));
    if (!Number.isInteger(jobOpeningId) || jobOpeningId <= 0) {
      setError("Select an active job opening.");
      return;
    }
    if (source === DEFAULT_SOURCE && !referralName.trim()) {
      setError("Enter the referring employee's name.");
      return;
    }
    if (!file && !resumeUrl) {
      setError("Choose a resume file before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await recruitmentApi.createCandidateApplication({
        jobOpeningId,
        fullName: String(formData.get("fullName")).trim(),
        email: String(formData.get("email")).trim(),
        phone: String(formData.get("phone")).trim(),
        address: String(formData.get("address")).trim() || undefined,
        source:
          source === DEFAULT_SOURCE
            ? `${source} - ${referralName.trim()}`
            : source,
        resumeUrl: savedResumeUrl,
      });
      setSuccess("Resume uploaded and candidate application created.");
      setFile(null);
      setResumeUrl("");
      setSource(DEFAULT_SOURCE);
      setReferralName("");
      form.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? `Candidate application could not be submitted: ${submitError.message}`
          : "Candidate application could not be submitted. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
          Recruitment workflow
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
          Upload Resume
        </h1>
        <p className="mt-1.5 text-sm text-[#7b8981]">
          Add a candidate resume and create an application for an active job opening.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)] sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff4dc] text-[#a56a0a]">
              <FileUp className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-[#26332c]">Candidate details</h2>
              <p className="text-xs text-[#7b8981]">Enter candidate contact and job information.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Full name <span className="text-rose-600">*</span>
              <input
                name="fullName"
                required
                maxLength={150}
                autoComplete="name"
                className="h-11 w-full rounded-lg border border-[#dfe4df] px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                placeholder="Candidate's full name"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Job opening <span className="text-rose-600">*</span>
              <select
                name="jobOpeningId"
                required
                defaultValue=""
                disabled={isLoadingLookups || openings.length === 0}
                className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 disabled:bg-slate-50"
              >
                <option value="" disabled>
                  {isLoadingLookups
                    ? "Loading openings..."
                    : "Select an active opening"}
                </option>
                {openings.map((opening) => (
                  <option key={opening.value} value={opening.value}>
                    {opening.label}
                    {opening.location ? ` · ${opening.location}` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Email <span className="text-rose-600">*</span>
              <input
                name="email"
                type="email"
                required
                maxLength={150}
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-[#dfe4df] px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                placeholder="name@example.com"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Phone <span className="text-rose-600">*</span>
              <input
                name="phone"
                type="tel"
                required
                maxLength={30}
                autoComplete="tel"
                className="h-11 w-full rounded-lg border border-[#dfe4df] px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                placeholder="Candidate phone number"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Source
              <select
                name="source"
                value={source}
                onChange={(event) => {
                  const selectedSource = event.target.value;
                  setSource(selectedSource);
                  if (selectedSource !== DEFAULT_SOURCE) {
                    setReferralName("");
                  }
                }}
                className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
              >
                <option value="">
                  {isLoadingLookups ? "Loading sources..." : "Select a source"}
                </option>
                {sources.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Referring employee name
              {source === DEFAULT_SOURCE && (
                <span className="text-rose-600"> *</span>
              )}
              <input
                name="referralName"
                type="text"
                value={referralName}
                onChange={(event) => setReferralName(event.target.value)}
                required={source === DEFAULT_SOURCE}
                disabled={source !== DEFAULT_SOURCE}
                maxLength={MAX_REFERRAL_NAME_LENGTH}
                autoComplete="name"
                className="h-11 w-full rounded-lg border border-[#dfe4df] px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 disabled:cursor-not-allowed disabled:bg-[#f3f5f3] disabled:text-[#87938c]"
                placeholder={
                  source === DEFAULT_SOURCE
                    ? "Enter referring employee name"
                    : "Available for Employee Referral only"
                }
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Address
              <input
                name="address"
                maxLength={500}
                autoComplete="street-address"
                className="h-11 w-full rounded-lg border border-[#dfe4df] px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                placeholder="Optional address"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)] sm:p-7">
          <h2 className="font-semibold text-[#26332c]">Resume document</h2>
          <p className="mt-1 text-sm text-[#7b8981]">
            PDF, DOC, or DOCX · maximum size 5 MB
          </p>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(event) => {
              handleFileChange(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
          {file ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#dfe8df] bg-[#f8fbf8] p-4">
              <div className="flex min-w-0 items-center gap-3">
                <FileUp className="h-5 w-5 shrink-0 text-[#54805e]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#354239]">{file.name}</p>
                  <p className="text-xs text-[#7b8981]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Remove selected resume"
                onClick={() => handleFileChange()}
                className="rounded-lg p-2 text-[#78867e] hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="mt-4 flex min-h-36 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d9dfd9] bg-[#fbfcfa] px-4 py-6 text-center transition hover:border-[#d8a43b] hover:bg-[#fffdf8]"
            >
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4dc] text-[#a56a0a]">
                <Upload className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-[#354239]">Choose resume file</span>
              <span className="mt-1 text-xs text-[#87938c]">Browse from your device</span>
            </button>
          )}
        </section>

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
        {lookupError && (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {lookupError}
          </p>
        )}
        {success && (
          <p role="status" className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {success}
          </p>
        )}
        {openings.length === 0 && !isLoadingLookups && !lookupError && (
          <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No active job openings are available. Publish a job opening before uploading a candidate resume.
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              isLoadingLookups ||
              Boolean(lookupError) ||
              openings.length === 0 ||
              sources.length === 0
            }
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#e5a538] px-5 text-sm font-semibold text-[#342712] shadow-sm transition hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </section>
  );
}
