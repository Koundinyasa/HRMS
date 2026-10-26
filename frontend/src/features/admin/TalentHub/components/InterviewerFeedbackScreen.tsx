import { useState, type FormEvent, type ReactNode } from "react";
import {
  ClipboardCheck,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import {
  useGetFinalApprovalQuery,
  useGetFinalApprovalsQuery,
  useGetInterviewerFeedbackWorklistQuery,
  useSubmitInterviewerCompetencyFeedbackMutation,
} from "../api/recruitment.api";
import type {
  FinalApprovalListResponse,
  InterviewFeedbackCategory,
  InterviewerCompetencyRating,
  InterviewerFeedbackWorklistItem,
} from "../types/recruitment.types";
import { EmptyState } from "./RecruitmentShared";
import { RecruitmentPagination } from "./RecruitmentPagination";

type HistoryRow = Record<string, unknown>;

function readHistoryValue(row: HistoryRow, ...keys: string[]) {
  const normalizedKeys = new Set(
    keys.map((key) => key.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  const match = Object.entries(row).find(([key]) =>
    normalizedKeys.has(key.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  return match?.[1];
}

function historyText(value: unknown, fallback = "—") {
  return value === null || value === undefined || value === ""
    ? fallback
    : String(value);
}

function overallRatingForFeedback(
  feedbackRows: HistoryRow[],
  item: HistoryRow,
): string {
  const rating = readHistoryValue(
    item,
    "rating",
    "feedbackRating",
    "interviewRating",
    "score",
  );
  if (rating !== null && rating !== undefined && rating !== "") {
    return historyText(rating);
  }

  const category = historyText(
    readHistoryValue(item, "categoryName", "feedbackCategoryName"),
    "Overall",
  ).toLowerCase();
  if (!category.includes("overall")) return "—";

  const interviewerId = readHistoryValue(item, "interviewerId", "employeeId");
  const interviewerName = historyText(
    readHistoryValue(item, "interviewerName", "employeeName"),
    "",
  ).toLowerCase();
  const categoryRows = feedbackRows.filter((feedback) => {
    const feedbackCategory = historyText(
      readHistoryValue(feedback, "categoryName", "feedbackCategoryName"),
      "",
    ).toLowerCase();
    return feedbackCategory !== "" && !feedbackCategory.includes("overall");
  });
  const interviewerRows = categoryRows.filter((feedback) => {

    const feedbackInterviewerId = readHistoryValue(
      feedback,
      "interviewerId",
      "employeeId",
    );
    const feedbackInterviewerName = historyText(
      readHistoryValue(feedback, "interviewerName", "employeeName"),
      "",
    ).toLowerCase();
    const sameInterviewer =
      interviewerId !== null && interviewerId !== undefined
        ? String(feedbackInterviewerId) === String(interviewerId)
        : interviewerName !== "" && feedbackInterviewerName === interviewerName;
    return sameInterviewer;
  });
  const matchingRows = interviewerRows.length > 0 ? interviewerRows : categoryRows;
  const ratings = matchingRows.flatMap((feedback) => {

    const score = Number(
      readHistoryValue(
        feedback,
        "rating",
        "feedbackRating",
        "interviewRating",
        "score",
      ),
    );
    return Number.isFinite(score) ? [score] : [];
  });

  return ratings.length > 0
    ? (ratings.reduce((sum, score) => sum + score, 0) / ratings.length).toFixed(1)
    : "—";
}

function messageFromError(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.map(String).join(", ");
    }
  }
  return error instanceof Error ? error.message : "Unable to save feedback.";
}

function formatInterviewDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function FeedbackCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)] sm:p-6">
      <h2 className="mb-4 text-base font-bold text-[#26332c]">{title}</h2>
      {children}
    </section>
  );
}

export function InterviewerFeedbackScreen() {
  const {
    data: worklistResponse,
    isLoading,
    error,
  } = useGetInterviewerFeedbackWorklistQuery();
  const worklist = worklistResponse?.interviews ?? [];
  const categories = worklistResponse?.categories ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected =
    worklist.find((interview) => interview.id === selectedId) ?? worklist[0];

  return (
    <section className="space-y-6">
      <header>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
          Talent Hub · Interview Process
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
          Interviewer Feedback
        </h1>
        <p className="mt-1.5 text-sm text-[#7b8981]">
          Review interviews assigned to you and submit feedback for completed interviews.
        </p>
      </header>

      {isLoading ? (
        <p className="rounded-2xl border border-[#e6e8e3] bg-white p-6 text-sm text-[#78867e]">
          Loading your assigned interviews...
        </p>
      ) : error ? (
        <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          {messageFromError(error)}
        </p>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-[#e6e8e3] bg-white p-6">
          <EmptyState message="No active interview feedback categories are configured." />
        </div>
      ) : worklist.length === 0 ? (
        <FeedbackCard title="Assigned interviews">
          <p className="rounded-xl border border-[#eceee9] bg-[#f8f9f7] p-4 text-sm text-[#78867e]">
            No completed, unsubmitted interviews are assigned to your account.
          </p>
        </FeedbackCard>
      ) : (
        <div className="grid min-w-0 gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <FeedbackCard title="Your interview panel">
            <div className="space-y-2">
              {worklist.map((interview) => (
                <button
                  key={interview.id}
                  type="button"
                  onClick={() => setSelectedId(interview.id)}
                  aria-pressed={selected?.id === interview.id}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selected?.id === interview.id
                      ? "border-[#d9ac55] bg-[#fffaf0]"
                      : "border-[#eceee9] hover:bg-[#f8f9f7]"
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#344138]">
                        {interview.candidateName}
                      </span>
                      <span className="mt-1 block truncate text-xs text-[#78867e]">
                        {interview.position}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[#eef3ef] px-2 py-1 text-[10px] font-semibold capitalize text-[#607067]">
                      {interview.status.replace("_", " ")}
                    </span>
                  </span>
                  <span className="mt-2 block text-xs text-[#87938c]">
                    {interview.roundName} · {formatInterviewDate(interview.scheduledAt)}
                  </span>
                </button>
              ))}
            </div>
          </FeedbackCard>
          <InterviewFeedbackForm
            key={selected?.id ?? "no-interview-selected"}
            interview={selected ?? null}
            categories={categories}
          />
        </div>
      )}
      <InterviewerFeedbackHistory />
    </section>
  );
}

function InterviewerFeedbackHistory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    data: response,
    error,
    isLoading,
  } = useGetFinalApprovalsQuery({
    decision: "all",
    search: search.trim() || undefined,
    page,
    limit: pageSize,
  });
  const rows = (response as FinalApprovalListResponse | undefined)?.data ?? [];
  const selected = rows.find(
    (row) => String(readHistoryValue(row, "id", "applicationId")) === selectedId,
  ) ?? rows[0];
  const selectedApplicationId = selected
    ? String(readHistoryValue(selected, "id", "applicationId"))
    : null;
  const {
    data: detail,
    error: detailError,
    isLoading: isLoadingDetail,
  } = useGetFinalApprovalQuery(selectedApplicationId ?? "", {
    skip: !selectedApplicationId,
  });
  const detailRecord =
    detail && typeof detail === "object" && !Array.isArray(detail)
      ? (detail as HistoryRow)
      : null;
  const interviews = Array.isArray(
    detailRecord ? readHistoryValue(detailRecord, "interviews") : undefined,
  )
    ? (readHistoryValue(detailRecord!, "interviews") as HistoryRow[])
    : [];

  return (
    <FeedbackCard title="Submitted feedback history">
      <p className="mb-4 text-sm text-[#78867e]">
        Feedback submitted by interviewers is available here across logins.
      </p>
      <div className="grid gap-4 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0">
          <label className="relative mb-3 block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#88938c]" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
                setSelectedId(null);
              }}
              placeholder="Search candidate or position"
              aria-label="Search submitted interview feedback"
              className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#d8a43b]"
            />
          </label>
          {isLoading ? (
            <p className="py-4 text-sm text-[#78867e]">Loading submitted feedback...</p>
          ) : error ? (
            <p role="alert" className="py-4 text-sm text-rose-700">
              {messageFromError(error)}
            </p>
          ) : rows.length === 0 ? (
            <p className="py-4 text-sm text-[#78867e]">
              No submitted interview feedback was found.
            </p>
          ) : (
            <div className="space-y-2">
              {rows.map((row) => {
                const id = String(readHistoryValue(row, "id", "applicationId"));
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedId(id)}
                    aria-pressed={selectedApplicationId === id}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      selectedApplicationId === id
                        ? "border-[#d9ac55] bg-[#fffaf0]"
                        : "border-[#eceee9] hover:bg-[#f8f9f7]"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-[#344138]">
                      {historyText(readHistoryValue(row, "candidateName", "fullName"))}
                    </span>
                    <span className="mt-1 block text-xs text-[#78867e]">
                      {historyText(readHistoryValue(row, "position", "jobTitle"))}
                    </span>
                    <span className="mt-1 block text-xs text-[#78867e]">
                      Average rating: {historyText(readHistoryValue(row, "avgRating", "averageRating"))}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {!isLoading && !error && response && (
            <RecruitmentPagination
              page={page}
              pageSize={pageSize}
              totalCount={Number(response.meta?.total ?? response.total ?? rows.length)}
              totalPages={Number(response.meta?.totalPages ?? response.totalPages ?? 1)}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                setSelectedId(null);
              }}
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize);
                setPage(1);
                setSelectedId(null);
              }}
            />
          )}
        </div>
        <div className="min-w-0 rounded-xl border border-[#eceee9] p-4">
          {isLoadingDetail ? (
            <p className="text-sm text-[#78867e]">Loading feedback details...</p>
          ) : detailError ? (
            <p role="alert" className="text-sm text-rose-700">
              {messageFromError(detailError)}
            </p>
          ) : !detailRecord ? (
            <p className="text-sm text-[#78867e]">
              Select a candidate to view submitted feedback.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#344138]">
                  {historyText(readHistoryValue(detailRecord, "candidateName", "fullName"))}
                </h3>
                <p className="mt-1 text-xs text-[#78867e]">
                  {historyText(readHistoryValue(detailRecord, "position", "jobTitle"))}
                </p>
              </div>
              {interviews.length === 0 ? (
                <p className="text-sm text-[#78867e]">
                  No interview feedback details are available.
                </p>
              ) : (
                interviews.map((interview, index) => {
                  const feedback = readHistoryValue(interview, "feedback");
                  const feedbackRows = Array.isArray(feedback)
                    ? (feedback as HistoryRow[])
                    : [];
                  return (
                    <article
                      key={String(readHistoryValue(interview, "id", "code") ?? index)}
                      className="space-y-3 rounded-lg border border-[#eceee9] p-3"
                    >
                      <div className="flex flex-wrap justify-between gap-2">
                        <strong className="text-sm text-[#344138]">
                          {historyText(readHistoryValue(interview, "code", "interviewCode"), `Interview ${index + 1}`)}
                        </strong>
                        <span className="text-xs text-[#78867e]">
                          {historyText(readHistoryValue(interview, "roundName", "interviewTypeName", "status"))}
                        </span>
                      </div>
                      {feedbackRows.length === 0 ? (
                        <p className="text-xs text-[#78867e]">
                          No category feedback is available.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {feedbackRows.map((item, feedbackIndex) => (
                            <div
                              key={String(readHistoryValue(item, "id") ?? feedbackIndex)}
                              className={`rounded-lg p-3 text-sm ${
                                feedbackIndex % 2 === 0
                                  ? "bg-white"
                                  : "bg-[#fffaf0]"
                              }`}
                            >
                              <div className="flex flex-wrap justify-between gap-2">
                                <span className="font-semibold text-[#344138]">
                                  {historyText(readHistoryValue(item, "interviewerName", "employeeName"), "Interviewer")}
                                  <span className="font-normal text-[#78867e]">
                                    {" · "}
                                    {historyText(readHistoryValue(item, "categoryName", "feedbackCategoryName"), "Overall")}
                                  </span>
                                </span>
                                <span className="font-bold text-[#344138]">
                                  Score: {overallRatingForFeedback(feedbackRows, item)}
                                </span>
                              </div>
                              {Boolean(
                                readHistoryValue(
                                  item,
                                  "feedback",
                                  "feedbackComments",
                                  "comments",
                                ),
                              ) && (
                                <p className="mt-2 whitespace-pre-wrap text-xs text-[#68756d]">
                                  {historyText(readHistoryValue(item, "feedback", "feedbackComments", "comments"))}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </FeedbackCard>
  );
}

function InterviewFeedbackForm({
  interview,
  categories,
}: {
  interview: InterviewerFeedbackWorklistItem | null;
  categories: InterviewFeedbackCategory[];
}) {
  const [ratings, setRatings] = useState<Record<number, InterviewerCompetencyRating>>({});
  const [overallFeedback, setOverallFeedback] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitFeedback, { isLoading }] =
    useSubmitInterviewerCompetencyFeedbackMutation();

  const scoredCount = categories.filter(
    (category) => ratings[category.categoryId],
  ).length;
  const average =
    scoredCount === 0
      ? null
      : categories.reduce(
          (sum, category) =>
            sum + (ratings[category.categoryId]?.rating ?? 0),
          0,
        ) / scoredCount;

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (scoredCount !== categories.length) {
      setFormError("Rate every active feedback category before submitting.");
      return;
    }
    if (!overallFeedback.trim()) {
      setFormError("Overall feedback is required.");
      return;
    }
    if (!interview) {
      setFormError("An assigned interview is required before feedback can be submitted.");
      return;
    }
    if (categories.length === 0) {
      setFormError("No active interview feedback categories are configured.");
      return;
    }

    try {
      const result = await submitFeedback({
        interviewId: interview.id,
        feedbackDetails: categories.map((category) => {
          const rating = ratings[category.categoryId];
          if (!rating) {
            throw new Error(
              `Select a score for ${category.categoryName} before submitting.`,
            );
          }
          return rating;
        }),
        overallFeedback: overallFeedback.trim(),
      }).unwrap();
      setSuccessMessage(result.message);
    } catch (requestError) {
      setFormError(messageFromError(requestError));
    }
  };

  return (
    <form
      className="min-w-0 space-y-5"
      onSubmit={(event) => void save(event)}
    >
      <FeedbackCard title="Interview details">
        {interview ? (
          <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4dc] text-[#a7751e]">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#26332c]">{interview.candidateName}</h2>
              <p className="mt-1 text-sm text-[#6f7d74]">
                {interview.position} · {interview.roundName}
              </p>
              <p className="mt-1 text-xs text-[#87938c]">
                {interview.candidateCode} · {interview.candidateEmail}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-[#78867e]">
            <p>{formatInterviewDate(interview.scheduledAt)}</p>
            <p className="mt-1 capitalize">Interview status: {interview.status}</p>
          </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4dc] text-[#a7751e]">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#344138]">No interview selected</p>
              <p className="mt-1 text-xs text-[#78867e]">
                Interview details will appear here when an assigned interview is available.
              </p>
            </div>
          </div>
        )}
      </FeedbackCard>

      <FeedbackCard title="Competency assessment">
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#f8f9f7] p-3">
            <p className="text-xs text-[#78867e]">Average score</p>
            <p className="mt-1 text-xl font-bold text-[#344138]">
              {average === null ? "—" : `${average.toFixed(1)} / 10`}
            </p>
          </div>
          <div className="rounded-xl bg-[#f8f9f7] p-3">
            <p className="text-xs text-[#78867e]">Competencies scored</p>
            <p className="mt-1 text-xl font-bold text-[#344138]">
              {scoredCount} <span className="text-sm font-medium text-[#87938c]">/ {categories.length}</span>
            </p>
          </div>
          <div className="rounded-xl bg-[#f8f9f7] p-3">
            <p className="text-xs text-[#78867e]">Submission readiness</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#344138]">
              <ClipboardCheck className="h-4 w-4 text-[#758d79]" />
              {!interview
                ? "Select an assigned interview"
                : scoredCount === categories.length && overallFeedback.trim()
                ? "Ready to submit"
                : "Complete ratings and overall feedback"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {categories.map((category) => {
            const current = ratings[category.categoryId];
            const ratingColor =
              current?.rating && current.rating <= 3
                ? "text-red-700"
                : current?.rating && current.rating <= 7
                  ? "text-yellow-700"
                  : current?.rating
                    ? "text-green-700"
                    : "text-[#78867e]";
            const selectedRatingColor =
              current?.rating && current.rating <= 3
                ? "border-red-300 bg-red-100 text-red-800"
                : current?.rating && current.rating <= 7
                  ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                  : "border-green-300 bg-green-100 text-green-800";
            return (
              <div
                key={category.categoryId}
                className="rounded-xl border border-[#eceee9] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#344138]">{category.categoryName}</h3>
                  </div>
                  <p className={`text-xs font-semibold ${ratingColor}`}>
                    Score: {current?.rating ?? "—"} / 10
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
                    <button
                      key={score}
                      type="button"
                      aria-label={`${category.categoryName}: ${score} out of 10`}
                      aria-pressed={current?.rating === score}
                      onClick={() =>
                        setRatings((previous) => ({
                          ...previous,
                          [category.categoryId]: {
                            categoryId: category.categoryId,
                            rating: score,
                          },
                        }))
                      }
                      className={`h-9 rounded-lg border text-sm font-semibold transition ${
                        current?.rating === score
                          ? selectedRatingColor
                          : "border-[#e5e9e4] text-[#66746b] hover:border-[#aab4ad] hover:bg-[#f8f9f7]"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#66746b]">Comments (optional)</span>
                  <textarea
                    value={current?.comments ?? ""}
                    onChange={(event) =>
                      setRatings((previous) => ({
                        ...previous,
                        [category.categoryId]: {
                          categoryId: category.categoryId,
                          rating: previous[category.categoryId]?.rating ?? 1,
                          comments: event.target.value,
                        },
                      }))
                    }
                    rows={2}
                    maxLength={500}
                    placeholder="Add comments about this category..."
                    className="w-full resize-y rounded-lg border border-[#dfe4df] px-3 py-2 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                  />
                </label>
              </div>
            );
          })}
        </div>
      </FeedbackCard>

      <FeedbackCard title="Overall feedback">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#344138]">
            Interview summary <span className="text-rose-600">*</span>
          </span>
          <textarea
            value={overallFeedback}
            onChange={(event) => setOverallFeedback(event.target.value)}
            rows={5}
            maxLength={4000}
            required
            placeholder="Summarize the candidate's interview performance..."
            className="w-full resize-y rounded-lg border border-[#dfe4df] px-3 py-2 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
          />
        </label>
      </FeedbackCard>

      {(formError || successMessage) && (
        <p
          role={formError ? "alert" : "status"}
          className={`rounded-lg px-4 py-3 text-sm ${
            formError
              ? "border border-rose-200 bg-rose-50 text-rose-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {formError || successMessage}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3 border-t border-[#e7e9e4] py-4">
        <button
          type="submit"
          disabled={isLoading || !interview}
          className="inline-flex items-center gap-2 rounded-lg bg-[#477453] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3c6547] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {isLoading
            ? "Submitting..."
            : interview
              ? "Submit feedback"
              : "Assign an interview first"}
        </button>
      </div>
    </form>
  );
}
