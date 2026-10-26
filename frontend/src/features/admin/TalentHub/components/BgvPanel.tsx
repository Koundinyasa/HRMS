import { useMemo, useState, type FormEvent } from "react";
import {
  Eye,
  FileText,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { recruitmentFileUrl } from "../api/recruitment.api";
import {
  useGetBgvQuery,
  useGetBgvsQuery,
  useGetAllVerificationCandidatesQuery,
  useGetPendingBgvDocumentsQuery,
  usePerformCandidateBgvMutation,
  useUpdateBgvMutation,
} from "../api/recruitment.api";
import type {
  BgvDetail,
  BgvRecord,
  BgvStatus,
  CandidateBgvResponse,
  PendingBgvDocumentRow,
} from "../types/recruitment.types";

const PAGE_SIZE = 10;

type EligibleCandidate = {
  applicationId: number;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  documentCount: number;
  verificationStatus: string;
};

type DocumentDecision = "Approved" | "Rejected" | "";

function readField(
  row: Record<string, unknown>,
  ...fieldNames: string[]
): unknown {
  for (const fieldName of fieldNames) {
    const normalizedName = fieldName.replace(/[^a-z\d]/gi, "").toLowerCase();
    const key = Object.keys(row).find(
      (candidate) =>
        candidate.replace(/[^a-z\d]/gi, "").toLowerCase() === normalizedName,
    );
    if (key !== undefined && row[key] !== null && row[key] !== undefined) {
      return row[key];
    }
  }
  return undefined;
}

function readPendingDocuments(response: unknown): PendingBgvDocumentRow[] {
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    throw new Error("BGV API returned an invalid document list.");
  }
  const envelope = response as Record<string, unknown>;
  if (envelope.success !== true || !Array.isArray(envelope.data)) {
    throw new Error(
      typeof envelope.message === "string"
        ? envelope.message
        : "BGV API returned an invalid document list.",
    );
  }

  return envelope.data.map((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("BGV API returned an invalid document record.");
    }
    const row = value as Record<string, unknown>;
    const documentId = Number(
      readField(
        row,
        "DocumentID",
        "DocumentId",
        "documentId",
        "CandidateDocumentID",
        "ID",
        "id",
      ),
    );
    if (!Number.isInteger(documentId) || documentId <= 0) {
      throw new Error("BGV document response contains an invalid document ID.");
    }
    return {
      DocumentID: documentId,
      DocumentType: Number(readField(row, "DocumentType") ?? 0),
      DocumentName: String(readField(row, "DocumentName") ?? "Document"),
      DocumentURL: String(
        readField(row, "DocumentURL", "documentUrl", "FileURL", "URL") ?? "",
      ),
      ActualFileName:
        typeof readField(row, "ActualFileName") === "string"
          ? String(readField(row, "ActualFileName"))
          : null,
      FileName:
        typeof readField(row, "FileName") === "string"
          ? String(readField(row, "FileName"))
          : null,
      FileExtension:
        typeof readField(row, "FileExtension") === "string"
          ? String(readField(row, "FileExtension"))
          : null,
      VerificationStatus:
        typeof readField(row, "VerificationStatus") === "string"
          ? String(readField(row, "VerificationStatus"))
          : null,
      VerificationRemarks:
        typeof readField(row, "VerificationRemarks") === "string"
          ? String(readField(row, "VerificationRemarks"))
          : null,
    };
  });
}

function errorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.map(String).join(", ");
    }
  }
  return error instanceof Error ? error.message : fallback;
}

function statusLabel(status: BgvRecord["status"]) {
  if (status === "in-progress") return "In Progress";
  return status === "clear" ? "Clear" : "Failed";
}

function candidateStatusStyle(status: string) {
  if (status === "Verification Completed") {
    return "bg-[#e8f4ec] text-[#39724f]";
  }
  if (status === "Verification Failed") return "bg-rose-50 text-rose-700";
  return "bg-[#fff3d6] text-[#9b6811]";
}

function readEligibleCandidates(response: unknown): EligibleCandidate[] {
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    throw new Error("Verification API returned an invalid candidate list.");
  }
  const envelope = response as Record<string, unknown>;
  if (envelope.success !== true || !Array.isArray(envelope.data)) {
    throw new Error(
      typeof envelope.message === "string"
        ? envelope.message
        : "Verification API returned an invalid candidate list.",
    );
  }

  const candidates = new Map<number, EligibleCandidate>();
  for (const value of envelope.data) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const row = value as Record<string, unknown>;
    const applicationId = Number(row.ApplicationID);
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      throw new Error(
        "Pending BGV response contains an invalid application ID.",
      );
    }

    candidates.set(applicationId, {
      applicationId,
      candidateCode: String(row.CandidateID ?? ""),
      candidateName: String(row.FullName ?? "Unknown candidate"),
      candidateEmail: String(row.Email ?? ""),
      position: String(row.position ?? row.Position ?? row.JobTitle ?? ""),
      documentCount: Number(row.PendingDocumentCount ?? 0),
      verificationStatus: String(row.VerificationStatus ?? "Pending"),
    });
  }
  return Array.from(candidates.values());
}

export function BgvPanel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BgvStatus>("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<"clear" | "failed">("clear");
  const [remarks, setRemarks] = useState("");
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  const [startCandidate, setStartCandidate] =
    useState<EligibleCandidate | null>(null);
  const [documentDecisions, setDocumentDecisions] = useState<
    Record<number, DocumentDecision>
  >({});
  const [documentDecisionRemarks, setDocumentDecisionRemarks] = useState<
    Record<number, string>
  >({});
  const [documentSubmissionError, setDocumentSubmissionError] = useState("");
  const [bgvSubmissionResponse, setBgvSubmissionResponse] =
    useState<CandidateBgvResponse | null>(null);

  const {
    data: bgvRecords,
  } = useGetBgvsQuery({
    status: "all",
    page: 1,
    limit: 100,
  }, { refetchOnMountOrArgChange: true });
  const {
    data: verificationCandidatesResponse,
    error: verificationCandidatesError,
    isFetching: isFetchingVerificationCandidates,
  } = useGetAllVerificationCandidatesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const {
    data: eligibleResponse,
    error: eligibleError,
    isFetching: isFetchingEligible,
  } = useGetPendingBgvDocumentsQuery(
    { flag: 1 },
    { refetchOnMountOrArgChange: true },
  );
  const {
    data: pendingDocumentsResponse,
    error: pendingDocumentsError,
    isFetching: isFetchingPendingDocuments,
  } = useGetPendingBgvDocumentsQuery(
    {
      applicationId: startCandidate?.applicationId,
      flag: 2,
    },
    {
      skip: startCandidate === null,
      refetchOnMountOrArgChange: true,
    },
  );
  const {
    data: detail,
    error: detailError,
    isFetching: isFetchingDetail,
  } = useGetBgvQuery(selectedId ?? 0, { skip: selectedId === null });
  const [performCandidateBgv, { isLoading: isSubmittingCandidateBgv }] =
    usePerformCandidateBgvMutation();
  const [updateBgv, { isLoading: isUpdating }] = useUpdateBgvMutation();

  const eligibleResult = useMemo(() => {
    if (!eligibleResponse) return { data: [] as EligibleCandidate[], error: "" };
    try {
      return { data: readEligibleCandidates(eligibleResponse), error: "" };
    } catch (error) {
      return {
        data: [] as EligibleCandidate[],
        error:
          error instanceof Error
            ? error.message
            : "Unable to load candidates eligible for verification.",
      };
    }
  }, [eligibleResponse]);

  const eligibleCandidates = eligibleResult.data;
  const pendingDocumentsResult = useMemo(() => {
    if (!pendingDocumentsResponse) {
      return { data: [] as PendingBgvDocumentRow[], error: "" };
    }
    try {
      return {
        data: readPendingDocuments(pendingDocumentsResponse),
        error: "",
      };
    } catch (error) {
      return {
        data: [] as PendingBgvDocumentRow[],
        error:
          error instanceof Error
            ? error.message
            : "Unable to load candidate documents.",
      };
    }
  }, [pendingDocumentsResponse]);
  const pendingDocuments = pendingDocumentsResult.data;
  const pendingDocumentsLoadError = pendingDocumentsError
    ? errorMessage(pendingDocumentsError, "Unable to load candidate documents.")
    : pendingDocumentsResult.error;
  const eligibleLoadError = eligibleError
    ? errorMessage(
        eligibleError,
        "Unable to load candidates eligible for verification.",
      )
    : eligibleResult.error;
  const verificationCandidates = verificationCandidatesResponse?.data;
  const filteredVerificationCandidates = useMemo(() => {
      const normalizedSearch = search.trim().toLowerCase();
      return (verificationCandidates ?? []).filter((candidate) => {
        const candidateStatus = candidate.BGVStatus.toLowerCase();
        const matchesStatus =
          status === "all" ||
          (status === "in-progress" &&
            (candidateStatus === "document submitted" ||
              candidateStatus === "in-progress")) ||
          (status === "clear" &&
            (candidateStatus === "verification completed" ||
              candidateStatus === "clear")) ||
          (status === "failed" &&
            (candidateStatus === "verification failed" ||
              candidateStatus === "failed"));
        const searchableText = [
          candidate.ApplicationID,
          candidate.FullName,
          candidate.Email,
          candidate.Position,
          candidate.BGVStatus,
        ]
          .join(" ")
          .toLowerCase();
        return matchesStatus && searchableText.includes(normalizedSearch);
      });
  }, [search, status, verificationCandidates]);
  const totalPages = Math.max(
      1,
      Math.ceil(filteredVerificationCandidates.length / PAGE_SIZE),
  );
  const pagedVerificationCandidates = filteredVerificationCandidates.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE,
  );
  const bgvRecordByApplicationId = new Map(
      (bgvRecords?.data ?? []).map((record) => [record.applicationId, record]),
  );

  const handleStart = (candidate: EligibleCandidate) => {
    setActionError("");
    setMessage("");
    setDocumentSubmissionError("");
    setDocumentDecisions({});
    setDocumentDecisionRemarks({});
    setStartCandidate(candidate);
  };

  const submitDocumentDecisions = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!startCandidate) return;
    const missingDecision = pendingDocuments.find(
      (document) => !documentDecisions[document.DocumentID],
    );
    if (missingDecision) {
      setDocumentSubmissionError(
        `Select an approval decision for ${missingDecision.DocumentName}.`,
      );
      return;
    }

    const rejectedWithoutRemarks = pendingDocuments.find(
      (document) =>
        documentDecisions[document.DocumentID] === "Rejected" &&
        !documentDecisionRemarks[document.DocumentID]?.trim(),
    );
    if (rejectedWithoutRemarks) {
      setDocumentSubmissionError(
        `Remarks are required to reject ${rejectedWithoutRemarks.DocumentName}.`,
      );
      return;
    }

    setDocumentSubmissionError("");
    try {
      const response = await performCandidateBgv({
        documents: pendingDocuments.map((document) => ({
          documentId: document.DocumentID,
          verificationStatus: documentDecisions[document.DocumentID] as
            | "Approved"
            | "Rejected",
          remarks:
            documentDecisionRemarks[document.DocumentID]?.trim() || undefined,
        })),
      }).unwrap();
      setStartCandidate(null);
      setBgvSubmissionResponse(response);
    } catch (error) {
      setDocumentSubmissionError(
        errorMessage(error, "Unable to submit BGV document decisions."),
      );
    }
  };

  const submitResult = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detail) return;
    setActionError("");
    setMessage("");
    try {
      await updateBgv({
        id: detail.id,
        body: { status: result, remarks: remarks.trim() || undefined },
      }).unwrap();
      setMessage(
        `Background verification result saved for ${detail.candidateName}.`,
      );
      setRemarks("");
    } catch (error) {
      setActionError(
        errorMessage(error, "Unable to update background verification."),
      );
    }
  };

  const openDetails = (record: BgvRecord) => {
    setActionError("");
    setMessage("");
    setRemarks(record.remarks ?? "");
    setResult(record.status === "failed" ? "failed" : "clear");
    setSelectedId(record.id);
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
          Recruitment workflow
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
          Verification / BGV
        </h2>
        <p className="mt-1.5 text-sm text-[#7b8981]">
          Start background checks for candidates with accepted offers, review
          their documents, and record the verification result.
        </p>
      </div>

      {message && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {message}
        </p>
      )}
      {actionError && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {actionError}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
        <div className="border-b border-[#eceee9] px-5 py-4">
          <h3 className="font-semibold text-[#354239]">
            Candidates ready for verification
          </h3>
          <p className="mt-1 text-xs text-[#7b8981]">
            Candidates with pending BGV documents to review.
          </p>
        </div>
        {eligibleLoadError && (
          <p
            role="alert"
            className="mx-5 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {eligibleLoadError}
          </p>
        )}
        <div className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse whitespace-nowrap text-left">
            <thead>
              <tr className="border-b border-[#eceee9] bg-[#f8f9f7]">
                {[
                  "Application",
                  "Candidate",
                  "Position",
                  "Documents",
                  "Verification Status",
                  "Email",
                  "Action",
                ].map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#7b8981]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef0eb]">
              {eligibleCandidates.map((candidate) => (
                <tr
                  key={candidate.applicationId}
                  className="transition-colors hover:bg-[#fafbf9]"
                >
                  <td className="px-5 py-4 text-sm font-medium text-[#354239]">
                    APP-{candidate.applicationId}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#354239]">
                    {candidate.candidateName}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#58655c]">
                    {candidate.position || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#58655c]">
                    {candidate.documentCount}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#58655c]">
                    {candidate.verificationStatus}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#58655c]">
                    {candidate.candidateEmail || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => void handleStart(candidate)}
                      disabled={isSubmittingCandidateBgv}
                      className="h-9 rounded-lg bg-[#38634a] px-4 text-xs font-semibold text-white disabled:cursor-wait disabled:opacity-60"
                    >
                      Start BGV
                    </button>
                  </td>
                </tr>
              ))}
              {!eligibleCandidates.length && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-[#7b8981]"
                  >
                    {isFetchingEligible
                      ? "Loading eligible candidates..."
                      : eligibleLoadError
                        ? "Eligible candidates could not be loaded."
                        : "No candidates are currently ready to start verification."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {startCandidate && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setStartCandidate(null);
              setDocumentSubmissionError("");
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="start-bgv-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[#efeee9] bg-white px-5 py-4">
              <div>
                <h3
                  id="start-bgv-title"
                  className="font-bold text-[#26332c]"
                >
                  Review documents — {startCandidate.candidateName}
                </h3>
                <p className="mt-1 text-xs text-[#7b8981]">
                  APP-{startCandidate.applicationId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStartCandidate(null);
                  setDocumentSubmissionError("");
                }}
                aria-label="Close document review"
                disabled={isSubmittingCandidateBgv}
                className="rounded-lg p-1.5 text-[#7e8981] hover:bg-[#f5f4ef] disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {isFetchingPendingDocuments ? (
              <p className="px-5 py-8 text-sm text-[#7b8981]">
                Loading candidate documents...
              </p>
            ) : pendingDocumentsLoadError ? (
              <p role="alert" className="px-5 py-8 text-sm text-rose-700">
                {pendingDocumentsLoadError}
              </p>
            ) : !pendingDocuments.length ? (
              <p className="px-5 py-8 text-sm text-[#7b8981]">
                No documents are available for verification.
              </p>
            ) : (
              <form
                onSubmit={(event) => void submitDocumentDecisions(event)}
                className="space-y-4 px-5 py-4"
              >
                {pendingDocuments.map((document) => (
                  <div
                    key={document.DocumentID}
                    className="space-y-3 rounded-lg border border-[#eef0eb] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#354239]">
                          {document.DocumentName}
                        </p>
                        <p className="text-xs text-[#7b8981]">
                          {document.ActualFileName ??
                            document.FileName ??
                            document.DocumentURL}
                        </p>
                      </div>
                      {document.DocumentURL && (
                        <a
                          href={recruitmentFileUrl(
                            document.DocumentURL,
                            document.FileExtension ?? undefined,
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-[#dfe4df] px-3 py-2 text-xs font-semibold text-[#58655c]"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Open document
                        </a>
                      )}
                    </div>
                    <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
                      Decision
                      <div className="flex gap-2">
                        <button
                          type="button"
                          aria-pressed={
                            documentDecisions[document.DocumentID] ===
                            "Approved"
                          }
                          onClick={() =>
                          setDocumentDecisions((current) => ({
                            ...current,
                            [document.DocumentID]: "Approved",
                          }))
                          }
                          disabled={isSubmittingCandidateBgv}
                          className={`h-10 rounded-lg border px-4 text-sm font-semibold disabled:opacity-50 ${
                            documentDecisions[document.DocumentID] ===
                            "Approved"
                              ? "border-[#38634a] bg-[#38634a] text-white"
                              : "border-[#dfe4df] bg-white text-[#58655c]"
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          aria-pressed={
                            documentDecisions[document.DocumentID] ===
                            "Rejected"
                          }
                          onClick={() =>
                            setDocumentDecisions((current) => ({
                              ...current,
                              [document.DocumentID]: "Rejected",
                            }))
                          }
                          disabled={isSubmittingCandidateBgv}
                          className={`h-10 rounded-lg border px-4 text-sm font-semibold disabled:opacity-50 ${
                            documentDecisions[document.DocumentID] ===
                            "Rejected"
                              ? "border-rose-700 bg-rose-700 text-white"
                              : "border-[#dfe4df] bg-white text-[#58655c]"
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </label>
                    {documentDecisions[document.DocumentID] === "Rejected" && (
                      <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
                        Rejection remarks (required)
                        <textarea
                          required
                          value={
                            documentDecisionRemarks[document.DocumentID] ?? ""
                          }
                          onChange={(event) =>
                            setDocumentDecisionRemarks((current) => ({
                              ...current,
                              [document.DocumentID]: event.target.value,
                            }))
                          }
                          maxLength={500}
                          rows={2}
                          disabled={isSubmittingCandidateBgv}
                          className="w-full rounded-lg border border-[#dfe4df] px-3 py-2 text-sm font-normal"
                        />
                      </label>
                    )}
                  </div>
                ))}
                {documentSubmissionError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  >
                    {documentSubmissionError}
                  </p>
                )}
                <div className="flex justify-end gap-2 border-t border-[#efeee9] pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStartCandidate(null);
                      setDocumentSubmissionError("");
                    }}
                    disabled={isSubmittingCandidateBgv}
                    className="h-10 rounded-lg border border-[#dfe4df] px-4 text-sm font-semibold text-[#58655c] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmittingCandidateBgv || !pendingDocuments.length
                    }
                    className="h-10 rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSubmittingCandidateBgv
                      ? "Submitting..."
                      : "Submit verification"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

      {bgvSubmissionResponse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#202a26]/45 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="bgv-result-title"
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
          >
            <div className="border-b border-[#efeee9] px-5 py-4">
              <h3
                id="bgv-result-title"
                className="font-bold text-[#26332c]"
              >
                {bgvSubmissionResponse.success
                  ? "BGV verification completed"
                  : "BGV verification result"}
              </h3>
              <p className="mt-1 text-sm text-[#66736a]">
                {bgvSubmissionResponse.message}
              </p>
            </div>
            <div className="space-y-3 px-5 py-4">
              {bgvSubmissionResponse.data.map((row) => (
                <dl
                  key={`${row.ApplicationID}-${row.DocumentID}`}
                  className="grid gap-x-4 gap-y-2 rounded-lg border border-[#eef0eb] p-4 sm:grid-cols-2"
                >
                  {[
                    ["Application", `APP-${row.ApplicationID}`],
                    ["Document ID", String(row.DocumentID)],
                    ["Document type", String(row.DocumentType)],
                    ["Decision", row.VerificationStatus],
                    ["Remarks", row.VerificationRemarks ?? "—"],
                    [
                      "Overall BGV",
                      row.OverallBGVClear ? "Clear" : "Not clear",
                    ],
                    ["Application status", row.ApplicationStatus],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm text-[#354239]">{value}</dd>
                    </div>
                  ))}
                </dl>
              ))}
            </div>
            <div className="flex justify-end border-t border-[#efeee9] px-5 py-4">
              <button
                type="button"
                onClick={() => setBgvSubmissionResponse(null)}
                className="h-10 rounded-lg bg-[#38634a] px-5 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
        <div className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto border-b border-[#eceee9]">
          <div className="flex w-max min-w-full flex-nowrap items-center gap-2.5 px-4 py-3.5 sm:px-5">
            <label className="relative w-[220px] shrink-0 sm:w-[360px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#88938c]" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search BGV records..."
                aria-label="Search background verification records"
                className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#d8a43b]"
              />
            </label>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as BgvStatus);
                setPage(1);
              }}
              aria-label="Filter BGV records by status"
              className="h-10 w-[170px] shrink-0 rounded-lg border border-[#dfe4df] bg-white px-3 text-sm text-[#354239]"
            >
              <option value="all">All Statuses</option>
              <option value="in-progress">In Progress</option>
              <option value="clear">Clear</option>
              <option value="failed">Failed</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("all");
                setPage(1);
              }}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#e2e5df] px-3.5 text-sm font-semibold text-[#58655c]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
        {verificationCandidatesError && (
          <p
            role="alert"
            className="mx-5 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {errorMessage(
              verificationCandidatesError,
              "Unable to load verification candidates.",
            )}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse whitespace-nowrap text-left">
            <thead>
              <tr>
                {[
                  "Application",
                  "Candidate",
                  "Position",
                  "Documents",
                  "Status",
                  "Verified",
                  "Action",
                ].map((label) => (
                  <th
                    key={label}
                    className="whitespace-nowrap bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078] first:pl-5 last:pr-5"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedVerificationCandidates.map((candidate) => {
                const bgvRecord = bgvRecordByApplicationId.get(
                  candidate.ApplicationID,
                );
                return (
                <tr
                  key={candidate.ApplicationID}
                  className="odd:bg-white even:bg-[#fffaf0] transition-colors hover:bg-[#f3e4c5]"
                >
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 pl-5 text-xs text-[#344138]">
                    APP-{candidate.ApplicationID}
                  </td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                    <span className="font-medium">{candidate.FullName}</span>
                    <span className="ml-2 text-[#7b8981]">{candidate.Email}</span>
                  </td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">{candidate.Position}</td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">{candidate.Noofdocumentsuploded}</td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${candidateStatusStyle(candidate.BGVStatus)}`}>
                      {candidate.BGVStatus}
                    </span>
                  </td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                    {candidate.actionDate || "—"}
                  </td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 pr-5">
                    <button
                      type="button"
                      onClick={() => bgvRecord && openDetails(bgvRecord)}
                      disabled={!bgvRecord}
                      title={
                        bgvRecord
                          ? "View background verification details"
                          : "No background verification record has been started for this application."
                      }
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#e4d5b5] px-3 py-2 text-xs font-semibold text-[#8a641d] hover:bg-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </button>
                  </td>
                </tr>
                );
              })}
              {!pagedVerificationCandidates.length && (
                <tr>
                  <td colSpan={7} className="border-t border-[#eef0eb] px-5 py-12 text-center text-sm text-[#7b8981]">
                    {isFetchingVerificationCandidates
                      ? "Loading verification records..."
                      : verificationCandidatesError
                        ? "Verification candidates could not be loaded."
                        : "No BGV records match your search and status filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#eceee9] px-5 py-3 text-xs text-[#758078]">
          <span>{filteredVerificationCandidates.length} records</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-lg border border-[#dfe4df] px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-lg border border-[#dfe4df] px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {selectedId !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="bgv-details-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[#efeee9] bg-white px-5 py-4">
              <h3 id="bgv-details-title" className="font-bold text-[#26332c]">
                {detail?.candidateName ?? "Background verification details"}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close BGV details"
                className="rounded-lg p-1.5 text-[#7e8981] hover:bg-[#f5f4ef]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {isFetchingDetail ? (
              <p className="px-5 py-8 text-sm text-[#7b8981]">
                Loading verification details...
              </p>
            ) : detailError ? (
              <p role="alert" className="px-5 py-8 text-sm text-rose-700">
                {errorMessage(detailError, "Unable to load verification details.")}
              </p>
            ) : detail ? (
              <BgvDetails
                detail={detail}
                status={result}
                remarks={remarks}
                error={actionError}
                isUpdating={isUpdating}
                onStatusChange={setResult}
                onRemarksChange={setRemarks}
                onSubmit={(event) => void submitResult(event)}
              />
            ) : null}
          </section>
        </div>
      )}
    </section>
  );
}

function BgvDetails({
  detail,
  status,
  remarks,
  error,
  isUpdating,
  onStatusChange,
  onRemarksChange,
  onSubmit,
}: {
  detail: BgvDetail;
  status: "clear" | "failed";
  remarks: string;
  error: string;
  isUpdating: boolean;
  onStatusChange: (status: "clear" | "failed") => void;
  onRemarksChange: (remarks: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="space-y-5 px-5 py-4">
      <dl className="grid gap-x-6 sm:grid-cols-2">
        {[
          ["Application", `APP-${detail.applicationId}`],
          ["Candidate ID", detail.candidateCode],
          ["Email", detail.candidateEmail],
          ["Position", detail.position],
          ["Offer reference", detail.offerReferenceNo ?? "—"],
          ["Status", statusLabel(detail.status)],
          ["Started by", detail.startedBy ?? "—"],
          ["Verified by", detail.verifiedBy ?? "—"],
          [
            "Verification date",
            detail.verificationDate
              ? new Date(detail.verificationDate).toLocaleString()
              : "Not completed",
          ],
        ].map(([label, value]) => (
          <div key={label} className="border-b border-[#f0f0eb] py-3">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#354239]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[#354239]">
          Candidate documents ({detail.documents.length})
        </h4>
        {detail.documents.length ? (
          <ul className="space-y-3">
            {detail.documents.map((document) => (
              <li
                key={document.id}
                className="space-y-3 rounded-lg border border-[#eef0eb] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#354239]">
                      {document.documentName ??
                        document.documentCode ??
                        "Document"}
                    </p>
                    <p className="text-xs text-[#7b8981]">
                      {document.actualFileName ??
                        document.fileName ??
                        document.documentUrl}
                    </p>
                    <p className="mt-1 text-xs text-[#7b8981]">
                      Status: {document.verificationStatus ?? "Pending"}
                      {document.verifiedBy ? ` · Reviewed by ${document.verifiedBy}` : ""}
                      {document.verifiedDate
                        ? ` · ${new Date(document.verifiedDate).toLocaleString()}`
                        : ""}
                    </p>
                  </div>
                  <a
                    href={recruitmentFileUrl(
                      document.documentUrl,
                      document.fileExtension ?? undefined,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-[#dfe4df] px-3 py-2 text-xs font-semibold text-[#58655c]"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Open document
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#7b8981]">No candidate documents found.</p>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-3 border-t border-[#efeee9] pt-4">
        <h4 className="text-sm font-semibold text-[#354239]">
          Update verification result
        </h4>
        <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
          Result
          <select
            required
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as "clear" | "failed")
            }
            className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm font-normal"
          >
            <option value="clear">Clear</option>
            <option value="failed">Failed</option>
          </select>
        </label>
        <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
          Remarks {status === "failed" ? "(required)" : "(optional)"}
          <textarea
            value={remarks}
            onChange={(event) => onRemarksChange(event.target.value)}
            maxLength={500}
            required={status === "failed"}
            rows={3}
            className="w-full rounded-lg border border-[#dfe4df] px-3 py-2 text-sm font-normal"
          />
        </label>
        {error && (
          <p role="alert" className="text-xs text-rose-700">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="h-9 rounded-lg bg-[#38634a] px-4 text-xs font-semibold text-white disabled:cursor-wait disabled:opacity-60"
          >
            {isUpdating ? "Saving..." : "Save verification result"}
          </button>
        </div>
      </form>
    </div>
  );
}
