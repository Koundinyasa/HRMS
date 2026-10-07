import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, FileUp, LoaderCircle, Upload, X } from "lucide-react";
import { recruitmentApi } from "../api/recruitment.api";
import type { JobOpening } from "../types/recruitment.types";

interface ResumeUploadScreenProps {
  openings: JobOpening[];
  isLoading: boolean;
}

const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const DEFAULT_SOURCE = "Employee Referral";
const MAX_REFERRAL_NAME_LENGTH = 75;
const ACCEPTED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function ResumeUploadScreen({
  openings,
  isLoading,
}: ResumeUploadScreenProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [source, setSource] = useState(DEFAULT_SOURCE);
  const [referralName, setReferralName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeOpenings = openings.filter((opening) => opening.status === "Open");

  const handleFileChange = (selectedFile?: File) => {
    setError("");
    setSuccess("");
    setResumeUrl("");
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
      setError("Resume file must be 10 MB or smaller.");
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
    let savedResumeUrl = resumeUrl;
    try {
      if (!savedResumeUrl && file) {
        savedResumeUrl = (
          await recruitmentApi.uploadCandidateResume(file)
        ).resumeUrl;
      }
      setResumeUrl(savedResumeUrl);
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
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Resume could not be submitted. Please try again.";
      setError(
        savedResumeUrl
          ? `Resume is uploaded, but the application was not created: ${message} Submit again to retry without re-uploading.`
          : `Resume upload failed: ${message}`,
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
                disabled={isLoading || activeOpenings.length === 0}
                className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 disabled:bg-slate-50"
              >
                <option value="" disabled>
                  {isLoading ? "Loading openings..." : "Select an active opening"}
                </option>
                {activeOpenings.map((opening) => (
                  <option key={opening.id} value={opening.id}>
                    {opening.title} · {opening.location}
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
                <option>Employee Referral</option>
                <option>Careers Page</option>
                <option>Job Portal</option>
                <option>Recruitment Agency</option>
                <option>Other</option>
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
            PDF, DOC, or DOCX · maximum size 10 MB
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
        {success && (
          <p role="status" className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {success}
          </p>
        )}
        {activeOpenings.length === 0 && !isLoading && (
          <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No active job openings are available. Publish a job opening before uploading a candidate resume.
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isLoading || activeOpenings.length === 0}
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
