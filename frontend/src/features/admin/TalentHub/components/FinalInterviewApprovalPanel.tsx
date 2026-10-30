import { useMemo, useState } from "react";
import { ChevronDown, RotateCcw, Search, X } from "lucide-react";
import {
  useDecideFinalApprovalMutation,
  useGetFinalApprovalQuery,
  useGetFinalApprovalsQuery,
} from "../api/recruitment.api";
import type {
  FinalApprovalDecision,
  FinalApprovalListResponse,
} from "../types/recruitment.types";
import { RecruitmentPagination } from "./RecruitmentPagination";

type DataRow = Record<string, unknown>;

function field(row: DataRow, ...aliases: string[]): unknown {
  const normalized = new Set(
    aliases.map((alias) => alias.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  const entry = Object.entries(row).find(([key]) =>
    normalized.has(key.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  return entry?.[1];
}

function text(value: unknown, fallback = "—"): string {
  return value === null || value === undefined || value === ""
    ? fallback
    : String(value);
}

function firstValue(rows: DataRow[], ...aliases: string[]): unknown {
  for (const row of rows) {
    const value = field(row, ...aliases);
    if (value !== null && value !== undefined && value !== "") return value;
  }
  return undefined;
}

function categoryRatings(
  rows: DataRow[],
): { category: string; rating: string; comments: string }[] {
  return rows
    .flatMap((row) => {
      const rating = field(row, "rating", "feedbackRating", "interviewRating");
      if (
        (typeof rating !== "string" && typeof rating !== "number") ||
        String(rating).trim() === ""
      ) {
        return [];
      }

      return [{
        category: text(
          field(
            row,
            "categoryName",
            "feedbackCategoryName",
            "ratingCategory",
          ),
          "Rating",
        ),
        rating: String(rating),
        comments: text(
          field(row, "comments", "categoryComments", "feedbackComments"),
          "—",
        ),
      }];
    });
}

function responseRows(response: FinalApprovalListResponse): DataRow[] {
  const value = response as unknown as DataRow;
  const rows = Array.isArray(response)
    ? response
    : Array.isArray(value.data)
      ? value.data
      : Array.isArray(value.items)
        ? value.items
        : Array.isArray(value.records)
          ? value.records
          : null;
  if (!rows) {
    throw new Error("Final approvals API returned an invalid list.");
  }
  return rows.filter(
    (row): row is DataRow =>
      Boolean(row) && typeof row === "object" && !Array.isArray(row),
  );
}

function unwrapRecord(response: unknown): DataRow {
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    throw new Error("Final approval API returned an invalid candidate.");
  }
  const record = response as DataRow;
  const data = record.data;
  return data && typeof data === "object" && !Array.isArray(data)
    ? (data as DataRow)
    : record;
}

function statusLabel(value: unknown): string {
  const decision = text(value, "pending").toLowerCase();
  if (decision === "selected") return "Selected";
  if (decision === "rejected") return "Rejected";
  return "Pending Approval";
}

function statusStyle(value: unknown): string {
  const decision = text(value, "pending").toLowerCase();
  if (decision === "selected") return "bg-[#e8f4ec] text-[#39724f]";
  if (decision === "rejected") return "bg-rose-50 text-rose-700";
  return "bg-[#fff3d6] text-[#9b6811]";
}

function apiError(error: unknown, fallback: string): string {
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

function interviewRows(record: DataRow): DataRow[] {
  const value = field(record, "interviews");
  return Array.isArray(value)
    ? value.filter(
        (row): row is DataRow =>
          Boolean(row) && typeof row === "object" && !Array.isArray(row),
      )
    : [];
}

function feedbackRows(interview: DataRow): DataRow[] {
  const value = field(interview, "feedback");
  return Array.isArray(value)
    ? value.filter(
        (row): row is DataRow =>
          Boolean(row) && typeof row === "object" && !Array.isArray(row),
      )
    : [];
}

export function FinalInterviewApprovalPanel() {
  const [search, setSearch] = useState("");
  const [decision, setDecision] = useState<FinalApprovalDecision>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [decisionError, setDecisionError] = useState("");
  const [decide, { isLoading: isDeciding }] = useDecideFinalApprovalMutation();
  const {
    data: listResponse,
    error: listError,
    isLoading,
  } = useGetFinalApprovalsQuery({
    decision,
    search: search.trim() || undefined,
    page,
    limit: pageSize,
  });
  const {
    data: detailResponse,
    error: detailError,
    isFetching: isLoadingDetail,
  } = useGetFinalApprovalQuery(selectedId ?? "", {
    skip: !selectedId,
    refetchOnMountOrArgChange: true,
  });

  const listResult = useMemo(() => {
    if (!listResponse) {
      return {
        rows: [] as DataRow[],
        totalCount: 0,
        totalPages: 1,
        error: "",
      };
    }
    try {
      const result = listResponse as unknown as DataRow;
      const meta =
        result.meta && typeof result.meta === "object"
          ? (result.meta as DataRow)
          : result.pagination && typeof result.pagination === "object"
            ? (result.pagination as DataRow)
            : result;
      const parsedTotalPages = Number(
        field(meta, "totalPages", "pages", "pageCount"),
      );
      const rows = responseRows(listResponse);
      const parsedTotalCount = Number(
        field(meta, "total", "totalCount", "count"),
      );
      const totalCount =
        Number.isInteger(parsedTotalCount) && parsedTotalCount >= 0
          ? parsedTotalCount
          : rows.length;
      return {
        rows,
        totalCount,
        totalPages:
          Number.isInteger(parsedTotalPages) && parsedTotalPages > 0
            ? parsedTotalPages
            : Math.max(1, Math.ceil(totalCount / pageSize)),
        error: "",
      };
    } catch (error) {
      return {
        rows: [] as DataRow[],
        totalCount: 0,
        totalPages: 1,
        error:
          error instanceof Error
            ? error.message
            : "Unable to read final approvals.",
      };
    }
  }, [listResponse, pageSize]);

  const detail = useMemo(() => {
    if (!detailResponse) return null;
    try {
      return unwrapRecord(detailResponse);
    } catch {
      return null;
    }
  }, [detailResponse]);
  const interviews = detail ? interviewRows(detail) : [];

  const openDetails = (row: DataRow) => {
    const id = field(row, "id", "approvalId");
    if (id === null || id === undefined || id === "") {
      setDecisionError("This approval record is missing its ID.");
      return;
    }
    setDecisionError("");
    setRemarks("");
    setShowCandidateDetails(false);
    setSelectedId(String(id));
  };

  const submitDecision = async (value: "selected" | "rejected") => {
    if (!selectedId) return;
    if (value === "rejected" && !remarks.trim()) {
      setDecisionError("Add remarks explaining the rejection.");
      return;
    }
    setDecisionError("");
    try {
      await decide({
        id: selectedId,
        body: { decision: value, remarks: remarks.trim() || undefined },
      }).unwrap();
      setSelectedId(null);
      setRemarks("");
    } catch (error) {
      setDecisionError(
        apiError(error, "Unable to submit the final interview decision."),
      );
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
          Recruitment workflow
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
          Final Interview Approval
        </h2>
        <p className="mt-1.5 text-sm text-[#7b8981]">
          Review completed interview feedback and make the final decision.
        </p>
      </div>

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
                placeholder="Search..."
                aria-label="Search final interview approvals"
                className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
              />
            </label>
            <select
              value={decision}
              onChange={(event) => {
                setDecision(event.target.value as FinalApprovalDecision);
                setPage(1);
              }}
              aria-label="Filter by decision"
              className="h-10 w-[170px] shrink-0 rounded-lg border border-[#dfe4df] bg-white px-3 text-sm text-[#354239] outline-none focus:border-[#d8a43b]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDecision("all");
                setPage(1);
              }}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#e2e5df] px-3.5 text-sm font-semibold text-[#58655c] transition hover:bg-[#f8f8f4]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="p-5 text-sm text-[#78867e]">Loading final approvals...</p>
        ) : listError || listResult.error ? (
          <p role="alert" className="p-5 text-sm text-rose-700">
            {listError
              ? apiError(listError, "Unable to load final interview approvals.")
              : listResult.error}
          </p>
        ) : listResult.rows.length === 0 ? (
          <p className="p-5 text-sm text-[#78867e]">
            No final interview approvals found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse whitespace-nowrap text-left">
                <thead>
                  <tr>
                    {["Application", "Candidate ID", "Candidate", "Interview", "Rating", "Decision"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078] first:pl-5"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                    <th className="bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listResult.rows.map((row, index) => {
                    const rawRating = field(row, "avgRating", "averageRating");
                    const rating =
                      rawRating === null || rawRating === undefined
                        ? "—"
                        : `${text(rawRating)} / 10`;
                    return (
                      <tr
                        key={text(field(row, "id", "approvalId"), String(index))}
                        className="odd:bg-white even:bg-[#fffaf0] transition-colors hover:bg-[#f3e4c5]"
                      >
                        <td className="border-t border-[#eef0eb] px-4 py-3.5 pl-5 text-xs text-[#344138]">
                          {text(field(row, "applicationCode", "applicationId"))}
                        </td>
                        <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                          {text(field(row, "candidateCode", "candidateId"))}
                        </td>
                        <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                          {text(field(row, "candidateName", "fullName"))}
                        </td>
                        <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                          {text(field(row, "latestInterviewCode", "interviewCode"))}
                        </td>
                        <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                          {rating}
                        </td>
                        <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle(
                              field(row, "decision"),
                            )}`}
                          >
                            {statusLabel(field(row, "decision"))}
                          </span>
                        </td>
                        <td className="border-t border-[#eef0eb] px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => openDetails(row)}
                            className="rounded-lg border border-[#ead9b7] px-3 py-2 text-xs font-semibold text-[#986713] hover:bg-[#fffaf0]"
                          >
                            View / Action
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
        {!isLoading && !listError && !listResult.error && (
          <RecruitmentPagination
            page={page}
            pageSize={pageSize}
            totalCount={listResult.totalCount}
            totalPages={listResult.totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </section>

      {selectedId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="final-approval-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#efeee9] bg-white px-5 py-4">
              <div className="min-w-0">
                <h3 id="final-approval-title" className="font-bold text-[#26332c]">
                  {detail
                    ? text(field(detail, "candidateName", "fullName"), "Final interview review")
                    : "Final interview review"}
                </h3>
                {detail && (
                  <p className="mt-1 text-xs text-[#78867e]">
                    {text(field(detail, "position", "jobTitle"))}
                    {interviews[0] &&
                      ` · ${text(field(interviews[0], "roundName", "interviewTypeName", "status"))}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowCandidateDetails((value) => !value)}
                  aria-expanded={showCandidateDetails}
                  aria-controls="final-approval-candidate-details"
                  aria-label={showCandidateDetails ? "Hide candidate details" : "Show all candidate details"}
                  className="rounded-lg p-2 text-[#7e8981] hover:bg-[#f5f4ef]"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${showCandidateDetails ? "rotate-180" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close final interview details"
                  className="rounded-lg p-1.5 text-[#7e8981] hover:bg-[#f5f4ef]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {isLoadingDetail ? (
              <p className="p-5 text-sm text-[#78867e]">
                Loading interview details...
              </p>
            ) : detailError ? (
              <p role="alert" className="p-5 text-sm text-rose-700">
                {apiError(detailError, "Unable to load interview details.")}
              </p>
            ) : !detail ? (
              <p role="alert" className="p-5 text-sm text-rose-700">
                Final approval details are unavailable.
              </p>
            ) : (
              <div className="space-y-5 p-5">
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Candidate ID", field(detail, "candidateCode", "candidateId")],
                    ["Position", field(detail, "position", "jobTitle")],
                    [
                      "Interview Round",
                      interviews[0] &&
                        field(interviews[0], "roundName", "interviewTypeName", "status"),
                    ],
                    [
                      "Scheduled",
                      interviews[0] &&
                        field(interviews[0], "scheduledAt", "scheduledDate", "interviewDate"),
                    ],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="border-b border-[#f0f0eb] pb-2">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                        {String(label)}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[#354239]">
                        {text(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
                {showCandidateDetails && (
                  <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                    {[
                      ["Application", field(detail, "applicationCode", "applicationId", "applicationID", "id")],
                      ["Email", field(detail, "candidateEmail", "email")],
                      ["Decision", statusLabel(field(detail, "decision"))],
                      ["Average rating", field(detail, "avgRating", "averageRating")],
                      [
                        "Interviews conducted",
                        field(detail, "totalInterviewsConducted", "totalInterviews"),
                      ],
                      [
                        "Interviews with feedback",
                        field(detail, "interviewsWithFeedback", "feedbackCount"),
                      ],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="border-b border-[#f0f0eb] pb-2">
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                          {String(label)}
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-[#354239]">
                          {text(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#26332c]">
                    Interview feedback
                  </h4>
                  {interviews.length === 0 ? (
                    <p className="text-sm text-[#78867e]">
                      No interview feedback is available.
                    </p>
                  ) : (
                    interviews.map((interview, interviewIndex) => (
                      (() => {
                        const feedback = feedbackRows(interview);
                        const ratings = categoryRatings(feedback);
                        const interviewerName = firstValue(
                          feedback,
                          "interviewerName",
                          "interviewerFullName",
                          "employeeName",
                        );
                        const interviewerId = firstValue(
                          feedback,
                          "interviewerId",
                          "employeeId",
                        );
                        const overallFeedback = firstValue(
                          feedback,
                          "overallFeedback",
                          "feedbackText",
                          "feedback",
                          "feedbackDescription",
                        );
                        return (
                          <article
                            key={text(field(interview, "id"), String(interviewIndex))}
                            className="space-y-3 rounded-xl border border-[#eceee9] p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0f0eb] pb-3">
                              <div>
                                <strong className="text-sm text-[#354239]">
                                  {text(field(interview, "code", "interviewCode"))}
                                </strong>
                                <p className="mt-1 text-xs text-[#78867e]">
                                  {text(field(interview, "roundName", "interviewTypeName", "status"))}
                                </p>
                              </div>
                              <span className="text-xs text-[#78867e]">
                                {text(field(interview, "scheduledAt", "scheduledDate", "interviewDate"), "")}
                              </span>
                            </div>
                            {feedback.length === 0 ? (
                              <p className="text-xs text-[#78867e]">
                                No feedback submitted for this interview.
                              </p>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-sm font-semibold text-[#344138]">
                                  {text(interviewerName, "Interviewer")}
                                  {interviewerId !== undefined &&
                                    ` · ${text(interviewerId)}`}
                                </p>
                                <details className="border-y border-[#eceee9] py-2 group">
                                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-wide text-[#78867e]">
                                    <span>Category feedback ({ratings.length})</span>
                                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                                  </summary>
                                  {ratings.length > 0 ? (
                                    <div className="mt-2 overflow-x-auto">
                                      <table className="w-full min-w-[460px] border-collapse text-left text-xs">
                                        <thead>
                                          <tr className="bg-[#f8f9f7] text-[#78867e]">
                                            <th className="px-3 py-2 font-semibold uppercase tracking-wide">
                                              Category
                                            </th>
                                            <th className="px-3 py-2 font-semibold uppercase tracking-wide">
                                              Rating
                                            </th>
                                            <th className="px-3 py-2 font-semibold uppercase tracking-wide">
                                              Comments
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {ratings.map((item, ratingIndex) => (
                                            <tr
                                              key={`${item.category}-${ratingIndex}`}
                                              className="border-t border-[#eceee9]"
                                            >
                                              <td className="px-3 py-2.5 text-[#344138]">
                                                {item.category}
                                              </td>
                                              <td className="px-3 py-2.5 font-semibold text-[#344138]">
                                                {item.rating}
                                              </td>
                                              <td className="whitespace-pre-wrap px-3 py-2.5 text-[#68756d]">
                                                {item.comments}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <p className="pt-2 text-xs text-[#78867e]">
                                      No category ratings were provided.
                                    </p>
                                  )}
                                </details>
                                <div className="grid gap-3 rounded-lg bg-[#f8f9f7] p-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                                  <div>
                                    <p className="text-xs font-semibold text-[#344138]">
                                      Overall feedback
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap text-xs text-[#68756d]">
                                      {text(
                                        overallFeedback,
                                        "No written feedback was included in the response.",
                                      )}
                                    </p>
                                  </div>
                                  <div className="text-xs text-[#78867e]">
                                    <span className="font-semibold">
                                      Overall rating
                                    </span>
                                    <p className="mt-1 font-bold text-[#344138]">
                                      {ratings.length
                                        ? `${(
                                            ratings.reduce(
                                              (sum, item) =>
                                                sum + Number(item.rating),
                                              0,
                                            ) / ratings.length
                                          ).toFixed(1)} / 10`
                                        : "—"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </article>
                        );
                      })()
                    ))
                  )}
                </div>

                {text(field(detail, "decision"), "pending").toLowerCase() ===
                  "pending" && (
                  <div className="space-y-3 border-t border-[#efeee9] pt-4">
                    <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
                      Remarks
                      <textarea
                        value={remarks}
                        onChange={(event) => setRemarks(event.target.value)}
                        maxLength={2000}
                        rows={3}
                        placeholder="Add remarks (required when rejecting)"
                        className="w-full rounded-lg border border-[#dfe4df] px-3 py-2 text-sm font-normal outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                      />
                    </label>
                    {decisionError && (
                      <p role="alert" className="text-xs text-rose-700">
                        {decisionError}
                      </p>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => void submitDecision("rejected")}
                        disabled={isDeciding}
                        className="rounded-lg border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => void submitDecision("selected")}
                        disabled={isDeciding}
                        className="rounded-lg bg-[#e5a538] px-4 py-2 text-xs font-semibold text-[#342712] disabled:opacity-50"
                      >
                        {isDeciding ? "Submitting..." : "Select candidate"}
                      </button>
                    </div>
                  </div>
                )}
                {decisionError &&
                  text(field(detail, "decision"), "pending").toLowerCase() !==
                    "pending" && (
                    <p role="alert" className="text-xs text-rose-700">
                      {decisionError}
                    </p>
                  )}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
