import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CheckCircle2, Eye, FileUp, LoaderCircle } from "lucide-react";
import { recruitmentApi } from "../api/recruitment.api";

const DOCUMENTS = [
  { id: 1, label: "Aadhaar", required: true },
  { id: 2, label: "PAN", required: true },
  { id: 3, label: "10th Class Marks Memo", required: true },
  { id: 4, label: "Intermediate Marks Memo", required: true },
  { id: 5, label: "B.Tech Marks Memo", required: true },
  { id: 6, label: "Passport", required: false },
  { id: 7, label: "Experience Certificate", required: false, experience: true },
  { id: 8, label: "Payslip", required: false, experience: true },
  { id: 9, label: "Form 16", required: false, experience: true },
] as const;

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

type CandidateOption = {
  applicationId: number;
  candidateName: string;
  jobTitle: string;
};

function readCandidateOption(value: unknown): CandidateOption | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const getValue = (...aliases: string[]) => {
    const normalizedAliases = new Set(
      aliases.map((alias) => alias.toLowerCase().replace(/[^a-z0-9]/g, "")),
    );
    const entry = Object.entries(row).find(([key]) =>
      normalizedAliases.has(key.toLowerCase().replace(/[^a-z0-9]/g, "")),
    );
    return entry?.[1];
  };
  const applicationIdValue =
    getValue(
      "ApplicationID",
      "CandidateApplicationID",
      "ApplicationId",
      "CandidateApplicationId",
      "ApplicantApplicationID",
      "CandidateApplicationKey",
    ) ??
    Object.entries(row).find(([key]) => {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      return normalizedKey.includes("application") && normalizedKey.endsWith("id");
    })?.[1];
  const applicationId = Number(applicationIdValue);
  if (!Number.isInteger(applicationId) || applicationId <= 0) return null;

  const candidateName = getValue(
    "FullName",
    "CandidateName",
    "CandidateFullName",
    "ApplicantName",
    "ApplicantFullName",
    "Name",
  );
  const jobTitle = getValue(
    "JobTitle",
    "Position",
    "OpeningTitle",
    "JobOpeningTitle",
    "Designation",
  );
  return {
    applicationId,
    candidateName:
      typeof candidateName === "string" && candidateName.trim()
        ? candidateName.trim()
        : `Application ${applicationId}`,
    jobTitle:
      typeof jobTitle === "string" && jobTitle.trim() ? jobTitle.trim() : "",
  };
}

export function CandidateDocumentUploadScreen() {
  const [candidates, setCandidates] = useState<CandidateOption[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [manualApplicationId, setManualApplicationId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasExperience, setHasExperience] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Map<number, string>
  >(() => new Map());
  const [uploadingDocument, setUploadingDocument] = useState<number | null>(
    null,
  );
  const [viewingDocument, setViewingDocument] = useState<number | null>(null);
  const documentPreviewUrls = useRef<string[]>([]);

  useEffect(() => {
    const previewUrls = documentPreviewUrls.current;
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    const loadCandidates = async () => {
      try {
        await Promise.resolve();
        if (!isCurrent) return;
        setIsLoading(true);
        setError("");
        const response = await recruitmentApi.getRecruitmentDashboard();
        if (!response.success || !Array.isArray(response.data?.applications)) {
          throw new Error(
            response.message ??
              "Recruitment dashboard returned an invalid application list.",
          );
        }
        const records = response.data.applications;
        const options = records
          .map(readCandidateOption)
          .filter((candidate): candidate is CandidateOption => candidate !== null);
        const uniqueOptions = Array.from(
          new Map(
            options.map((candidate) => [candidate.applicationId, candidate]),
          ).values(),
        );
        if (isCurrent) setCandidates(uniqueOptions);
      } catch (loadError) {
        if (!isCurrent) return;
        const message = axios.isAxiosError(loadError)
          ? String(loadError.response?.data?.message ?? loadError.message)
          : loadError instanceof Error
            ? loadError.message
            : "Unable to load candidates for document upload.";
        setError(message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    void loadCandidates();
    return () => {
      isCurrent = false;
    };
  }, []);

  const uploadDocument = async (documentId: number, file?: File) => {
    setError("");
    if (!file) return;
    if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
      setError("Choose a PDF, JPG, JPEG, or PNG document.");
      return;
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      setError("Document file must be 10 MB or smaller.");
      return;
    }
    const applicationId = Number(activeApplicationId);
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      setError("Select a candidate before uploading documents.");
      return;
    }

    setUploadingDocument(documentId);
    try {
      const response = await recruitmentApi.uploadCandidateDocumentFile({
        applicationId,
        documentType: documentId,
        file,
      });
      setUploadedDocuments((previous) =>
        new Map(previous).set(documentId, response.documentUrl),
      );
    } catch (uploadError) {
      const message = axios.isAxiosError(uploadError)
        ? String(uploadError.response?.data?.message ?? uploadError.message)
        : uploadError instanceof Error
          ? uploadError.message
          : "Document upload failed. Please try again.";
      setError(message);
    } finally {
      setUploadingDocument(null);
    }
  };

  const viewDocument = async (documentId: number, documentUrl: string) => {
    setError("");
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      setError("Allow pop-ups to view the uploaded document.");
      return;
    }

    setViewingDocument(documentId);
    try {
      const file = await recruitmentApi.getCandidateDocumentFile(documentUrl);
      const previewUrl = URL.createObjectURL(file);
      documentPreviewUrls.current.push(previewUrl);
      previewWindow.location.href = previewUrl;
      previewWindow.opener = null;
    } catch (viewError) {
      previewWindow.close();
      const message = axios.isAxiosError(viewError)
        ? String(viewError.response?.data?.message ?? viewError.message)
        : viewError instanceof Error
          ? viewError.message
          : "Unable to open the uploaded document.";
      setError(message);
    } finally {
      setViewingDocument(null);
    }
  };

  const handleCandidateChange = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setManualApplicationId("");
    setHasExperience(false);
    setUploadedDocuments(new Map());
    setError("");
  };

  const handleManualApplicationIdChange = (applicationId: string) => {
    setManualApplicationId(applicationId);
    setHasExperience(false);
    setUploadedDocuments(new Map());
    setError("");
  };

  const visibleDocuments = DOCUMENTS.filter(
    (document) => !("experience" in document) || hasExperience,
  );
  const activeApplicationId =
    candidates.length > 0 ? selectedApplicationId : manualApplicationId;
  const selectedCandidate = candidates.find(
    (candidate) => String(candidate.applicationId) === activeApplicationId,
  );

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
          Recruitment workflow
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
          Candidate Document Upload
        </h1>
        <p className="mt-1.5 text-sm text-[#7b8981]">
          Upload identity, education, and applicable experience documents.
          PDF, JPG, or PNG files up to 10 MB are accepted.
        </p>
      </header>

      <section className="space-y-5 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)] sm:p-7">
        <label className="block max-w-xl space-y-1.5 text-sm font-medium text-[#46534a]">
          Candidate
          {candidates.length > 0 ? (
            <select
              value={selectedApplicationId}
              onChange={(event) => handleCandidateChange(event.target.value)}
              className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
            >
              <option value="">Select a candidate</option>
              {candidates.map((candidate) => (
                <option
                  key={candidate.applicationId}
                  value={candidate.applicationId}
                >
                  {candidate.candidateName}
                  {candidate.jobTitle ? ` · ${candidate.jobTitle}` : ""}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={manualApplicationId}
                onChange={(event) =>
                  handleManualApplicationIdChange(event.target.value)
                }
                placeholder={
                  isLoading
                    ? "Loading candidates..."
                    : "Enter candidate application ID"
                }
                aria-describedby="application-id-help"
                className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
              />
              <span
                id="application-id-help"
                className="block text-xs font-normal text-[#7b8981]"
              >
                If the candidate list is unavailable, enter the candidate&apos;s
                application ID to attach documents to the correct record.
              </span>
            </>
          )}
        </label>

        {selectedCandidate && (
          <p className="rounded-lg bg-[#f8f9f7] px-4 py-3 text-sm text-[#56645a]">
            Uploading documents for{" "}
            <span className="font-semibold">{selectedCandidate.candidateName}</span>
            {selectedCandidate.jobTitle ? ` — ${selectedCandidate.jobTitle}` : ""}
          </p>
        )}

        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-[#46534a]">
          <input
            type="checkbox"
            checked={hasExperience}
            onChange={(event) => setHasExperience(event.target.checked)}
            disabled={!activeApplicationId}
            className="h-4 w-4 accent-[#38634a]"
          />
          Candidate has previous work experience
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </p>
        )}

        {activeApplicationId && (
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleDocuments.map((document) => {
              const isUploading = uploadingDocument === document.id;
              const documentUrl = uploadedDocuments.get(document.id);
              const isUploaded = Boolean(documentUrl);
              const isViewing = viewingDocument === document.id;
              return (
                <div
                  key={document.id}
                  className="flex min-h-28 items-center justify-between gap-4 rounded-xl border border-[#dfe4df] bg-[#fbfcfa] p-4 transition hover:border-[#d8a43b]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {isUploaded ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    ) : isUploading ? (
                      <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-[#a56a0a]" />
                    ) : (
                      <FileUp className="h-5 w-5 shrink-0 text-[#a56a0a]" />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#354239]">
                        {document.label}
                      </span>
                      <span className="mt-1 block text-xs text-[#7b8981]">
                        {document.required ? "Required" : "Optional"}
                        {isUploaded ? " · Uploaded" : ""}
                      </span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {isUploaded && documentUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          void viewDocument(document.id, documentUrl)
                        }
                        disabled={isViewing}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-xs font-semibold text-[#58655c] disabled:cursor-wait disabled:opacity-60"
                      >
                        {isViewing ? (
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                        View
                      </button>
                    )}
                    <label className="cursor-pointer rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-xs font-semibold text-[#58655c]">
                      {isUploaded ? "Replace" : "Choose file"}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        disabled={isUploading}
                        onChange={(event) => {
                          const input = event.currentTarget;
                          void uploadDocument(
                            document.id,
                            input.files?.[0],
                          ).finally(() => {
                            input.value = "";
                          });
                        }}
                        className="sr-only"
                        aria-label={`${isUploaded ? "Replace" : "Upload"} ${document.label}`}
                      />
                    </label>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
