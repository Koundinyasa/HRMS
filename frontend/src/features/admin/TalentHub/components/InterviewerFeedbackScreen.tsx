import { useState, type FormEvent, type ReactNode } from "react";
import {
  ClipboardCheck,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import {
  useGetInterviewerFeedbackWorklistQuery,
  useSubmitInterviewerCompetencyFeedbackMutation,
} from "../api/recruitment.api";
import type {
  InterviewFeedbackCategory,
  InterviewerCompetencyRating,
  InterviewerFeedbackWorklistItem,
} from "../types/recruitment.types";
import { RecruitmentPagination } from "./RecruitmentPagination";

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
          Review interviews assigned to you and submit feedback for completed
          interviews.
        </p>
      </header>

      {isLoading ? (
        <p className="rounded-2xl border border-[#e6e8e3] bg-white p-6 text-sm text-[#78867e]">
          Loading your assigned interviews...
        </p>
      ) : error ? (
        <p
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700"
        >
          {messageFromError(error)}
        </p>
      ) : worklist.length === 0 ? (
        <FeedbackCard title="Assigned interviews">
          <p className="rounded-xl border border-[#eceee9] bg-[#f8f9f7] p-4 text-sm text-[#78867e]">
            No interviews are assigned to your account.
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
                      {interview.feedbackSubmitted
                        ? "feedback submitted"
                        : interview.status.replace("_", " ")}
                    </span>
                  </span>
                  <span className="mt-2 block text-xs text-[#87938c]">
                    {interview.roundName} ·{" "}
                    {formatInterviewDate(interview.scheduledAt)}
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
      <InterviewerFeedbackHistory interviews={worklist} />
    </section>
  );
}

function InterviewerFeedbackHistory({
  interviews,
}: {
  interviews: InterviewerFeedbackWorklistItem[];
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const submittedInterviews = interviews
    .filter((interview) => interview.feedbackSubmitted)
    .filter((interview) => {
      const normalizedSearch = search.trim().toLowerCase();
      return (
        !normalizedSearch ||
        interview.candidateName.toLowerCase().includes(normalizedSearch) ||
        interview.candidateCode.toLowerCase().includes(normalizedSearch) ||
        interview.position.toLowerCase().includes(normalizedSearch)
      );
    })
    .sort(
      (first, second) =>
        new Date(second.scheduledAt).getTime() -
        new Date(first.scheduledAt).getTime()
    );
  const totalPages = Math.max(
    1,
    Math.ceil(submittedInterviews.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const pageInterviews = submittedInterviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const selected =
    submittedInterviews.find((interview) => interview.id === selectedId) ??
    pageInterviews[0] ??
    submittedInterviews[0];
  const firstRow =
    submittedInterviews.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastRow = Math.min(currentPage * pageSize, submittedInterviews.length);

  return (
    <FeedbackCard title="Submitted feedback history">
      <p className="mb-4 text-sm text-[#78867e]">
        Feedback you submitted for your assigned interviews.
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
          {submittedInterviews.length === 0 ? (
            <p className="py-4 text-sm text-[#78867e]">
              No feedback you submitted was found.
            </p>
          ) : (
            <div className="space-y-2">
              {pageInterviews.map((interview) => {
                return (
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
                    <span className="block text-sm font-semibold text-[#344138]">
                      {interview.candidateName}
                    </span>
                    <span className="mt-1 block text-xs text-[#78867e]">
                      {interview.position}
                    </span>
                    <span className="mt-1 block text-xs text-[#78867e]">
                      {interview.roundName} ·{" "}
                      {formatInterviewDate(interview.scheduledAt)}
                    </span>
                    <span className="mt-1 block text-xs text-[#78867e]">
                      Rating: {interview.feedbackRating ?? "—"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {submittedInterviews.length > 0 && (
            <RecruitmentPagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={submittedInterviews.length}
              totalPages={totalPages}
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
          {!selected ? (
            <p className="text-sm text-[#78867e]">
              Select a submitted interview to view your feedback.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#344138]">
                  {selected.candidateName}
                </h3>
                <p className="mt-1 text-xs text-[#78867e]">
                  {selected.position}
                </p>
              </div>
              <article className="space-y-3 rounded-lg border border-[#eceee9] p-3">
                <div className="flex flex-wrap justify-between gap-2">
                  <strong className="text-sm text-[#344138]">
                    {selected.code}
                  </strong>
                  <span className="text-xs text-[#78867e]">
                    {selected.roundName}
                  </span>
                </div>
                <p className="text-xs text-[#78867e]">
                  {formatInterviewDate(selected.scheduledAt)}
                </p>
                <div className="rounded-lg bg-[#fffaf0] p-3 text-sm">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-semibold text-[#344138]">
                      Your overall feedback
                    </span>
                    <span className="font-bold text-[#344138]">
                      Score: {selected.feedbackRating ?? "—"}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-xs text-[#68756d]">
                    {selected.feedbackText ||
                      "No written feedback was recorded."}
                  </p>
                </div>
              </article>
            </div>
          )}
        </div>
      </div>
      {submittedInterviews.length > 0 && (
        <p className="text-xs text-[#78867e]">
          Showing {firstRow}–{lastRow} of {submittedInterviews.length} feedback
          submissions.
        </p>
      )}
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
  const [ratings, setRatings] = useState<
    Record<number, InterviewerCompetencyRating>
  >({});
  const [overallFeedback, setOverallFeedback] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitFeedback, { isLoading }] =
    useSubmitInterviewerCompetencyFeedbackMutation();

  const scoredCount = categories.filter(
    (category) => ratings[category.categoryId]
  ).length;
  const average =
    scoredCount === 0
      ? null
      : categories.reduce(
          (sum, category) => sum + (ratings[category.categoryId]?.rating ?? 0),
          0
        ) / scoredCount;
  const candidateFeedbackCount = interview?.candidateFeedbackCount ?? 0;
  const candidateAverage =
    interview?.feedbackSubmitted
      ? interview.candidateAverageRating ?? null
      : scoredCount === categories.length && average !== null
        ? candidateFeedbackCount === 0
          ? average
          : ((interview?.candidateAverageRating ?? 0) *
              candidateFeedbackCount +
              average) /
            (candidateFeedbackCount + 1)
        : interview?.candidateAverageRating ?? null;

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
      setFormError(
        "An assigned interview is required before feedback can be submitted."
      );
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
              `Select a score for ${category.categoryName} before submitting.`
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
    <form className="min-w-0 space-y-5" onSubmit={(event) => void save(event)}>
      <FeedbackCard title="Interview details">
        {interview ? (
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4dc] text-[#a7751e]">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#26332c]">
                  {interview.candidateName}
                </h2>
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
              <p className="mt-1 capitalize">
                Interview status: {interview.status}
              </p>
              {interview.feedbackSubmitted && (
                <p className="mt-1 text-emerald-700">Feedback submitted</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4dc] text-[#a7751e]">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#344138]">
                No interview selected
              </p>
              <p className="mt-1 text-xs text-[#78867e]">
                Interview details will appear here when an assigned interview is
                available.
              </p>
            </div>
          </div>
        )}
      </FeedbackCard>

      {interview && !interview.canSubmitFeedback && (
        <p className="rounded-lg border border-[#eee4c9] bg-[#fffaf0] px-4 py-3 text-sm text-[#78643c]">
          {interview.feedbackSubmitted
            ? "Feedback has already been submitted for this interview."
            : "Feedback can be submitted after the interview is completed."}
        </p>
      )}

      <FeedbackCard title="Competency assessment">
        <div className="mb-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-[#f8f9f7] p-3">
            <p className="text-xs text-[#78867e]">Average score</p>
            <p className="mt-1 text-xl font-bold text-[#344138]">
              {average === null ? "—" : `${average.toFixed(1)} / 10`}
            </p>
          </div>
          <div className="rounded-xl bg-[#fffaf0] p-3">
            <p className="text-xs text-[#78867e]">Candidate running average</p>
            <p className="mt-1 text-xl font-bold text-[#344138]">
              {candidateAverage === null
                ? "—"
                : `${candidateAverage.toFixed(1)} / 10`}
            </p>
            <p className="mt-1 text-[10px] text-[#87938c]">
              {interview?.feedbackSubmitted
                ? `After ${candidateFeedbackCount} feedback submissions`
                : scoredCount === categories.length && categories.length > 0
                  ? `After ${candidateFeedbackCount + 1} feedback submissions`
                  : `Based on ${candidateFeedbackCount} submitted feedbacks`}
            </p>
          </div>
          <div className="rounded-xl bg-[#f8f9f7] p-3">
            <p className="text-xs text-[#78867e]">Competencies scored</p>
            <p className="mt-1 text-xl font-bold text-[#344138]">
              {scoredCount}{" "}
              <span className="text-sm font-medium text-[#87938c]">
                / {categories.length}
              </span>
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
                    <h3 className="text-sm font-bold text-[#344138]">
                      {category.categoryName}
                    </h3>
                  </div>
                  <p className={`text-xs font-semibold ${ratingColor}`}>
                    Score: {current?.rating ?? "—"} / 10
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {Array.from({ length: 10 }, (_, index) => index + 1).map(
                    (score) => (
                      <button
                        key={score}
                        type="button"
                        aria-label={`${category.categoryName}: ${score} out of 10`}
                        aria-pressed={current?.rating === score}
                        disabled={!interview?.canSubmitFeedback}
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
                    )
                  )}
                </div>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#66746b]">
                    Comments (optional)
                  </span>
                  <textarea
                    value={current?.comments ?? ""}
                    disabled={!interview?.canSubmitFeedback}
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
            disabled={!interview?.canSubmitFeedback}
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
          disabled={
            isLoading ||
            !interview?.canSubmitFeedback ||
            categories.length === 0
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#477453] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3c6547] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {isLoading
            ? "Submitting..."
            : !interview
            ? "Assign an interview first"
            : interview.feedbackSubmitted
            ? "Feedback submitted"
            : interview.status === "scheduled"
            ? "Feedback after interview"
            : categories.length === 0
            ? "No feedback categories configured"
            : "Submit feedback"}
        </button>
      </div>
    </form>
  );
}
