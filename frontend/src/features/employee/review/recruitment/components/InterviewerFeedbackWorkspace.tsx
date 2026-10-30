import { useState, type FormEvent } from "react";
import { ChevronDown, Search, Send, X } from "lucide-react";
import { useSubmitInterviewerCompetencyFeedbackMutation } from "../apis/recruitmentApi";
import type {
  InterviewFeedbackCategory,
  InterviewerCompetencyRating,
  InterviewerFeedbackWorklistItem,
} from "../types/recruitment.types";
import { RecruitmentPagination } from "@/features/admin/TalentHub/components/RecruitmentPagination";
import { useInterviewerFeedbackWorkspace } from "../hooks/useInterviewerFeedbackWorkspace";
import { DEFAULT_RECRUITMENT_PAGE_SIZE } from "../constants/recruitment.constants";
import { validateInterviewerFeedback } from "../validations/interviewerFeedback.validation";

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.map(String).join(", ");
    }
  }
  return error instanceof Error ? error.message : "Unable to load interview feedback.";
}

function formatInterviewDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

export function InterviewerFeedbackWorkspace() {
  const {
    data,
    error,
    isLoading,
    search,
    setSearch,
    interviews,
    filteredInterviews,
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    totalPages,
    pageInterviews,
    selectedInterview,
    setSelectedId,
  } = useInterviewerFeedbackWorkspace(DEFAULT_RECRUITMENT_PAGE_SIZE);
  const categories = data?.categories ?? [];

  return (
    <main className="space-y-6 p-3">
      <header>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
          Talent Hub · Interview Process
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
          Interviewer Feedback
        </h1>
        <p className="mt-1.5 text-sm text-[#7b8981]">
          Review your assigned interviews and submit feedback for completed interviews.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
        <div className="border-b border-[#eceee9] p-4">
          <label className="relative block w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#88938c]" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search candidates, applications, or positions"
              aria-label="Search assigned interview feedback"
              className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#d8a43b]"
            />
          </label>
        </div>
        {isLoading ? (
          <p role="status" className="p-6 text-sm text-[#78867e]">
            Loading your assigned interviews...
          </p>
        ) : error ? (
          <p role="alert" className="p-6 text-sm text-rose-700">
            {errorMessage(error)}
          </p>
        ) : filteredInterviews.length === 0 ? (
          <p className="p-6 text-sm text-[#78867e]">
            {interviews.length === 0
              ? "No interviews are assigned to your account."
              : "No interviews match your search."}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    {["Interview", "Candidate", "Position", "Interview Round", "Scheduled", "Feedback", "Score", "Action"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="bg-[#f8f9f7] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#758078] first:pl-5"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {pageInterviews.map((interview) => (
                    <tr
                      key={interview.id}
                      className="odd:bg-white even:bg-[#fffaf0] hover:bg-[#f3e4c5]"
                    >
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138] first:pl-5">
                        {interview.code}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5">
                        <span className="block text-xs font-semibold text-[#344138]">
                          {interview.candidateName}
                        </span>
                        <span className="mt-1 block text-[11px] text-[#78867e]">
                          {interview.candidateCode}
                        </span>
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                        {interview.position}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                        {interview.roundName}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                        {formatInterviewDate(interview.scheduledAt)}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                        {interview.feedbackSubmitted ? "Submitted" : "Not submitted"}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                        {interview.feedbackRating ?? "—"}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedId(interview.id)}
                          className="rounded-lg border border-[#e5d7b8] bg-[#fffaf0] px-3 py-1.5 text-xs font-semibold text-[#80540d] hover:bg-[#fff3d6]"
                        >
                          View / Action
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <RecruitmentPagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={filteredInterviews.length}
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
          </>
        )}
      </section>

      {selectedInterview && (
        <InterviewFeedbackDialog
          key={selectedInterview.id}
          interview={selectedInterview}
          categories={categories}
          onClose={() => setSelectedId(null)}
        />
      )}
    </main>
  );
}

function InterviewFeedbackDialog({
  interview,
  categories,
  onClose,
}: {
  interview: InterviewerFeedbackWorklistItem;
  categories: InterviewFeedbackCategory[];
  onClose: () => void;
}) {
  const [ratings, setRatings] = useState<Record<number, InterviewerCompetencyRating>>({});
  const [overallFeedback, setOverallFeedback] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showCategories, setShowCategories] = useState(!interview.feedbackSubmitted);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitFeedback, { isLoading }] = useSubmitInterviewerCompetencyFeedbackMutation();
  const canSubmit = interview.canSubmitFeedback && !submitted;
  const scoredCount = categories.filter((category) => ratings[category.categoryId]).length;
  const average = scoredCount === 0
    ? null
    : categories.reduce(
        (sum, category) => sum + (ratings[category.categoryId]?.rating ?? 0),
        0,
      ) / scoredCount;

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const validationError = validateInterviewerFeedback({
      canSubmit: interview.canSubmitFeedback && !submitted,
      categories,
      ratings,
      overallFeedback,
    });
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await submitFeedback({
        interviewId: interview.id,
        feedbackDetails: categories.map((category) => ratings[category.categoryId]),
        overallFeedback: overallFeedback.trim(),
      }).unwrap();
      setSubmitted(true);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  const showCategoryResults = interview.feedbackSubmitted || submitted;
  const overallRating = submitted
    ? average?.toFixed(1) ?? "—"
    : interview.feedbackRating ?? "—";
  const feedbackText = submitted ? overallFeedback : interview.feedbackText;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="interviewer-feedback-dialog-title"
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efeee9] bg-white px-5 py-4">
          <div className="min-w-0">
            <h2 id="interviewer-feedback-dialog-title" className="truncate font-bold text-[#26332c]">
              {interview.candidateName}
            </h2>
            <p className="mt-1 text-xs text-[#78867e]">
              {interview.position} · {interview.roundName}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowDetails((value) => !value)}
              aria-expanded={showDetails}
              aria-controls="interviewer-feedback-details"
              aria-label={showDetails ? "Hide interview details" : "Show all interview details"}
              className="rounded-lg p-2 text-[#7e8981] hover:bg-[#f5f4ef]"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close feedback"
              className="rounded-lg p-2 text-[#7e8981] hover:bg-[#f5f4ef] disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <dl className="grid gap-x-6 border-b border-[#efeee9] px-5 py-2 sm:grid-cols-2">
          {[
            ["Candidate ID", interview.candidateCode],
            ["Position", interview.position],
            ["Interview Round", interview.roundName],
            ["Scheduled", formatInterviewDate(interview.scheduledAt)],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-[#f0f0eb] py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">{label}</dt>
              <dd className="mt-1 break-words text-sm font-medium text-[#354239]">{value}</dd>
            </div>
          ))}
        </dl>
        {showDetails && (
          <dl id="interviewer-feedback-details" className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
            {[
              ["Interview ID", interview.id],
              ["Interview", interview.code],
              ["Candidate", interview.candidateName],
              ["Email", interview.candidateEmail],
              ["Interview Status", interview.status],
              ["Interviewer", interview.interviewerName],
              ["Feedback", interview.feedbackSubmitted || submitted ? "Submitted" : "Not submitted"],
              ["Can Submit Feedback", canSubmit ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-[#f0f0eb] py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">{label}</dt>
                <dd className="mt-1 break-words text-sm font-medium text-[#354239]">{value ?? "—"}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="space-y-4 px-5 py-4">
          <button
            type="button"
            onClick={() => setShowCategories((value) => !value)}
            aria-expanded={showCategories}
            aria-controls="interviewer-feedback-categories"
            className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-[#849087] hover:text-[#59665d]"
          >
            Category feedback
            <ChevronDown className={`h-4 w-4 transition-transform ${showCategories ? "rotate-180" : ""}`} />
          </button>
          {canSubmit ? (
            <form id="interviewer-feedback-form" onSubmit={(event) => void save(event)} className="space-y-4">
              {showCategories && (
                <div id="interviewer-feedback-categories" className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#f8f9f7] px-3 py-2 text-sm">
                    <p className="font-semibold text-[#354239]">
                      Average score: {average === null ? "—" : `${average.toFixed(1)} / 10`}
                    </p>
                    <p className="text-xs text-[#78867e]">
                      {scoredCount} of {categories.length} categories rated
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {categories.map((category) => (
                      <fieldset key={category.categoryId} className="rounded-lg border border-[#eceee9] p-3">
                        <legend className="px-1 text-sm font-semibold text-[#354239]">{category.categoryName}</legend>
                        <p className="text-right text-xs font-semibold text-[#59665d]">
                          Score: {ratings[category.categoryId]?.rating ?? "—"} / 10
                        </p>
                        <div className="mt-2 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                          {Array.from({ length: 10 }, (_, index) => index + 1).map((rating) => {
                            const selected = ratings[category.categoryId]?.rating === rating;
                            const tone = rating <= 4
                              ? selected ? "border-red-600 bg-red-600 text-white" : "border-red-200 text-red-700 hover:bg-red-50"
                              : rating <= 7
                                ? selected ? "border-amber-500 bg-amber-500 text-white" : "border-amber-200 text-amber-700 hover:bg-amber-50"
                                : selected ? "border-emerald-600 bg-emerald-600 text-white" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50";
                            return (
                              <button
                                key={rating}
                                type="button"
                                aria-label={`${category.categoryName}: ${rating} out of 10`}
                                aria-pressed={selected}
                                onClick={() => setRatings((previous) => ({
                                  ...previous,
                                  [category.categoryId]: {
                                    categoryId: category.categoryId,
                                    rating,
                                    comments: previous[category.categoryId]?.comments,
                                  },
                                }))}
                                className={`aspect-square w-full max-w-8 justify-self-center rounded-full border p-0 text-xs font-semibold ${tone}`}
                              >
                                {rating}
                              </button>
                            );
                          })}
                        </div>
                        <textarea
                          value={ratings[category.categoryId]?.comments ?? ""}
                          onChange={(event) => setRatings((previous) => ({
                            ...previous,
                            [category.categoryId]: {
                              categoryId: category.categoryId,
                              rating: previous[category.categoryId]?.rating ?? 1,
                              comments: event.target.value,
                            },
                          }))}
                          rows={2}
                          maxLength={500}
                          placeholder="Comments (optional)"
                          aria-label={`${category.categoryName} comments`}
                          className="mt-2 w-full resize-y rounded-lg border border-[#dfe4df] px-3 py-2 text-sm outline-none focus:border-[#d8a43b]"
                        />
                      </fieldset>
                    ))}
                  </div>
                </div>
              )}
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-[#354239]">Overall feedback</span>
                <textarea
                  value={overallFeedback}
                  onChange={(event) => setOverallFeedback(event.target.value)}
                  rows={4}
                  maxLength={4000}
                  required
                  placeholder="Summarize the candidate's interview performance..."
                  className="w-full resize-y rounded-lg border border-[#dfe4df] px-3 py-2 text-sm outline-none focus:border-[#d8a43b]"
                />
              </label>
              {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-[#78867e]">{scoredCount} of {categories.length} categories rated</p>
                <button
                  type="submit"
                  disabled={isLoading || categories.length === 0 || scoredCount !== categories.length || !overallFeedback.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e5a538] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d5982e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {isLoading ? "Submitting..." : "Submit feedback"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {showCategories && (
                <div id="interviewer-feedback-categories" className="overflow-x-auto rounded-lg border border-[#eceee9]">
                  <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-[#f8f9f7]">
                        {["Category", "Rating", "Comments"].map((heading) => (
                          <th key={heading} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#849087]">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {showCategoryResults && interview.feedbackDetails.length > 0 ? (
                        interview.feedbackDetails.map((detail) => (
                          <tr key={detail.categoryName} className="border-t border-[#eceee9]">
                            <td className="px-3 py-2.5 font-medium text-[#354239]">{detail.categoryName}</td>
                            <td className="px-3 py-2.5 text-[#354239]">{detail.rating ?? "—"}</td>
                            <td className="px-3 py-2.5 text-[#68756d]">{detail.comments || "—"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={3} className="px-3 py-3 text-sm text-[#78867e]">No category feedback has been submitted.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {!interview.feedbackSubmitted && !submitted && (
                <p className="rounded-lg border border-[#eee4c9] bg-[#fffaf0] px-3 py-2 text-sm text-[#78643c]">
                  Feedback can be submitted after the interview is completed.
                </p>
              )}
            </>
          )}

          {!canSubmit && (
            <div className="grid gap-4 border-t border-[#efeee9] pt-4 sm:grid-cols-[minmax(0,3fr)_minmax(7rem,1fr)]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#849087]">Overall feedback</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-[#354239]">{feedbackText || "—"}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#849087]">Overall rating</h3>
                <p className="mt-2 text-sm font-medium text-[#354239]">{overallRating}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
