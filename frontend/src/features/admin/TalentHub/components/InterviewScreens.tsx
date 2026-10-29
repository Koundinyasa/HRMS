import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CalendarDays, ChevronDown, Search, X } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  useGetPendingInterviewScheduleQuery,
  useGetInterviewScheduleOptionsQuery,
  useGetRecruitmentInterviewersQuery,
  useGetRecruitmentInterviewsQuery,
  useGetCandidatesWaitingForFinalApprovalQuery,
  useGetTodayRecruitmentInterviewsQuery,
  useGetRecruitmentInterviewQuery,
  useGetRecruitmentInterviewFeedbackQuery,
  useMoveCandidateToNextStageMutation,
  useScheduleTechnicalRoundTwoMutation,
  useScheduleRecruitmentInterviewMutation,
  useSubmitRecruitmentInterviewFeedbackMutation,
  useUpdateRecruitmentInterviewStatusMutation,
} from "../api/recruitment.api";
import type {
  PendingInterviewCandidate,
  RecruitmentInterview,
  RecruitmentInterviewPeriod,
  ScheduledCandidateInterview,
} from "../types/recruitment.types";
import { RecruitmentPagination } from "./RecruitmentPagination";
import { EmptyState } from "./RecruitmentShared";

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

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function normalizedName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function currentLocalDate() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function InterviewCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
      <div className="border-b border-[#eceee9] px-5 py-4">
        <h2 className="text-base font-bold text-[#26332c]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function InterviewScheduleScreen() {
  const navigate = useNavigate();
  const { domain } = useParams<{ domain: string }>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCandidate, setSelectedCandidate] =
    useState<PendingInterviewCandidate | null>(null);
  const [selectedReview, setSelectedReview] =
    useState<ScheduledCandidateInterview | null>(null);
  const [selectedFollowUp, setSelectedFollowUp] =
    useState<ScheduledCandidateInterview | null>(null);
  const [isMovingToApproval, setIsMovingToApproval] = useState(false);
  const [stageMoveError, setStageMoveError] = useState("");
  const [moveCandidateToNextStage] = useMoveCandidateToNextStageMutation();
  const {
    data: candidates = [],
    error: candidatesError,
    isLoading: isLoadingCandidates,
  } = useGetPendingInterviewScheduleQuery({ search });
  const {
    data: upcomingResult,
    error: upcomingError,
    isLoading: isLoadingUpcoming,
  } = useGetRecruitmentInterviewsQuery({
    period: "upcoming",
    page: 1,
    limit: 5,
  });
  const {
    data: submittedFeedback = [],
    error: submittedFeedbackError,
    isLoading: isLoadingSubmittedFeedback,
  } = useGetCandidatesWaitingForFinalApprovalQuery();
  const sortedSubmittedFeedback = [...submittedFeedback].sort(
    (first, second) =>
      new Date(second.scheduledAt).getTime() -
      new Date(first.scheduledAt).getTime(),
  );
  const moveToNextStage = async (interview: ScheduledCandidateInterview) => {
    setStageMoveError("");
    setIsMovingToApproval(true);
    try {
      await moveCandidateToNextStage(interview.applicationId).unwrap();
      navigate(
        `/${domain}/admin/talent-hub/recruitment/final-interview-approval`,
      );
    } catch (requestError) {
      setStageMoveError(
        errorMessage(
          requestError,
          "Unable to move the candidate to Final Interview Approval.",
        ),
      );
    } finally {
      setIsMovingToApproval(false);
    }
  };
  const totalPages = Math.max(1, Math.ceil(candidates.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageCandidates = candidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <section className="space-y-6">
      <header>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
          Talent Hub
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
          Interview Schedule
        </h1>
        <p className="mt-1.5 text-sm text-[#7b8981]">
          Book interview rounds for shortlisted candidates and manage upcoming
          slots.
        </p>
      </header>

      <InterviewCard title="Waiting for a slot">
        <div className="border-b border-[#eceee9] px-4 py-3 sm:px-5">
          <label className="relative block max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#88938c]" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search candidate or role"
              aria-label="Search candidates waiting for an interview slot"
              className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#929c95] focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
            />
          </label>
        </div>
        {isLoadingCandidates ? (
          <p className="p-5 text-sm text-[#78867e]">Loading candidates...</p>
        ) : candidatesError ? (
          <p role="alert" className="p-5 text-sm text-rose-700">
            {errorMessage(candidatesError, "Unable to load interview candidates.")}
          </p>
        ) : candidates.length === 0 ? (
          <div className="p-5">
            <EmptyState message="No shortlisted candidates are waiting for an interview slot." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse whitespace-nowrap text-left">
                <thead>
                  <tr>
                    {[
                      "Candidate ID",
                      "Candidate Name",
                      "Job Title",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078] first:pl-5"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageCandidates.map((candidate) => (
                    <tr
                      key={candidate.applicationId}
                      className="border-t border-[#eef0eb] odd:bg-white even:bg-[#fffaf0] transition-colors hover:bg-[#f3e4c5]"
                    >
                      <td className="px-4 py-3.5 pl-5 text-xs text-[#344138]">
                        {candidate.candidateCode}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-[#344138]">
                        {candidate.candidateName}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#344138]">
                        {candidate.position}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(candidate)}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#e8f4ec] px-3 py-2 text-xs font-semibold text-[#39724f] transition hover:bg-[#d9ecdf]"
                        >
                          <CalendarDays className="h-3.5 w-3.5" />
                          Schedule interview
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
              totalCount={candidates.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </InterviewCard>

      <InterviewCard title="Upcoming interviews">
        {isLoadingUpcoming ? (
          <p className="p-5 text-sm text-[#78867e]">Loading upcoming interviews...</p>
        ) : upcomingError ? (
          <p role="alert" className="p-5 text-sm text-rose-700">
            {errorMessage(upcomingError, "Unable to load upcoming interviews.")}
          </p>
        ) : !upcomingResult?.data.length ? (
          <div className="flex min-h-36 flex-col items-center justify-center gap-2 p-6 text-center text-sm text-[#78867e]">
            <CalendarDays className="h-6 w-6 text-[#87938c]" />
            No upcoming interviews.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse whitespace-nowrap text-left">
                <thead>
                  <tr>
                    {["When", "Candidate", "Interview Type", "Interviewer", "Action"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078] first:pl-5"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {upcomingResult.data.map((interview) => (
                    <tr
                      key={interview.id}
                      className="border-t border-[#eef0eb] odd:bg-white even:bg-[#fffaf0] text-xs text-[#344138] transition-colors hover:bg-[#f3e4c5]"
                    >
                      <td className="px-4 py-3.5 pl-5">
                        {formatDate(interview.scheduledAt)}
                      </td>
                      <td className="px-4 py-3.5">{interview.candidateName}</td>
                      <td className="px-4 py-3.5">{interview.interviewType}</td>
                      <td className="px-4 py-3.5">{interview.interviewerName}</td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/${domain}/admin/talent-hub/recruitment/interview-process`,
                            )
                          }
                          className="rounded-lg border border-[#ead9b7] px-3 py-2 font-semibold text-[#986713] hover:bg-[#fffaf0]"
                        >
                          View process
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end border-t border-[#eceee9] px-5 py-3">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/${domain}/admin/talent-hub/recruitment/interview-process`,
                  )
                }
                className="text-xs font-semibold text-[#986713] hover:underline"
              >
                View all interviews
              </button>
            </div>
          </>
        )}
      </InterviewCard>

      <InterviewCard title="Submitted feedback · HR review">
        {isLoadingSubmittedFeedback ? (
          <p className="p-5 text-sm text-[#78867e]">
            Loading submitted interview feedback...
          </p>
        ) : submittedFeedbackError ? (
          <p role="alert" className="p-5 text-sm text-rose-700">
            {errorMessage(
              submittedFeedbackError,
              "Unable to load submitted interview feedback.",
            )}
          </p>
        ) : sortedSubmittedFeedback.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center p-6 text-center text-sm text-[#78867e]">
            Submitted interviewer feedback will appear here for HR review.
          </div>
        ) : (
          <>
            {stageMoveError && (
              <p role="alert" className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700">
                {stageMoveError}
              </p>
            )}
            <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] border-collapse whitespace-nowrap text-left">
              <thead>
                <tr>
                  {[
                    "When",
                    "Candidate",
                    "Round",
                    "Interviewer",
                    "Rating",
                    "Feedback",
                    "Next step",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078] first:pl-5"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedSubmittedFeedback.map((interview) => (
                  <tr
                    key={interview.id}
                    className="border-t border-[#eef0eb] odd:bg-white even:bg-[#fffaf0] text-xs text-[#344138]"
                  >
                    <td className="px-4 py-3.5 pl-5">
                      {formatDate(interview.scheduledAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold">
                        {interview.candidateName}
                      </span>
                      <span className="ml-2 text-[#87938c]">
                        {interview.candidateCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {interview.roundName} · {interview.interviewType}
                    </td>
                    <td className="px-4 py-3.5">{interview.interviewerName}</td>
                    <td className="px-4 py-3.5">
                      {interview.feedbackRating ?? "—"}
                    </td>
                    <td
                      className="max-w-[280px] truncate px-4 py-3.5"
                      title={interview.feedbackText || "No written feedback"}
                    >
                      {interview.feedbackText || "No written feedback"}
                    </td>
                    <td className="px-4 py-3.5">
                      {interview.alreadyMovedToNextStage
                        ? "Moved to Final Approval"
                        : interview.isLatestInterview
                          ? "Decision needed"
                          : "Later round scheduled"}
                      {interview.isLatestInterview &&
                        !interview.alreadyMovedToNextStage && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {["technical", "technical1"].includes(
                              normalizedName(interview.interviewType),
                            ) && (
                              <button
                                type="button"
                                onClick={() => setSelectedFollowUp(interview)}
                                className="rounded-lg bg-[#fff3d6] px-3 py-2 font-semibold text-[#986713] hover:bg-[#f8e8c5]"
                              >
                                Technical 2
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => void moveToNextStage(interview)}
                              disabled={isMovingToApproval}
                              className="rounded-lg bg-[#e8f4ec] px-3 py-2 font-semibold text-[#39724f] hover:bg-[#d9ecdf] disabled:opacity-50"
                            >
                              {isMovingToApproval
                                ? "Moving..."
                                : "Move to Next"}
                            </button>
                          </div>
                        )}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => setSelectedReview(interview)}
                        className="rounded-lg border border-[#ead9b7] px-3 py-2 font-semibold text-[#986713] hover:bg-[#fffaf0]"
                      >
                        Review feedback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </InterviewCard>

      {selectedCandidate && (
        <ScheduleInterviewDialog
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
      {selectedReview && (
        <InterviewReviewDialog
          interview={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
      {selectedFollowUp && (
        <ScheduleInterviewDialog
          candidate={{
            applicationId: selectedFollowUp.applicationId,
            candidateName: selectedFollowUp.candidateName,
            position: selectedFollowUp.position,
          }}
          preferredInterviewType="Technical 2"
          lockInterviewType
          technicalRoundTwoInterviewId={selectedFollowUp.id}
          onClose={() => setSelectedFollowUp(null)}
        />
      )}
    </section>
  );
}

function ScheduleInterviewDialog({
  candidate,
  onClose,
  onScheduled,
  preferredInterviewType,
  lockInterviewType = false,
  technicalRoundTwoInterviewId,
}: {
  candidate: Pick<
    PendingInterviewCandidate,
    "applicationId" | "candidateName" | "position"
  >;
  onClose: () => void;
  onScheduled?: () => void;
  preferredInterviewType?: string;
  lockInterviewType?: boolean;
  technicalRoundTwoInterviewId?: number;
}) {
  const currentEmployeeId = useAppSelector((state) => state.auth.employeeId);
  const {
    data: interviewers = [],
    error: interviewersError,
    isLoading: isLoadingInterviewers,
  } = useGetRecruitmentInterviewersQuery();
  const {
    data: scheduleOptions,
    error: scheduleOptionsError,
    isLoading: isLoadingScheduleOptions,
  } = useGetInterviewScheduleOptionsQuery();
  const [scheduleInterview, { isLoading: isScheduling }] =
    useScheduleRecruitmentInterviewMutation();
  const [scheduleTechnicalRoundTwo] =
    useScheduleTechnicalRoundTwoMutation();
  const [interviewTypeId, setInterviewTypeId] = useState("");
  const [interviewModeId, setInterviewModeId] = useState("20");
  const [date, setDate] = useState("");
  const minimumInterviewDate = currentLocalDate();
  const [time, setTime] = useState("");
  const [interviewerEmployeeId, setInterviewerEmployeeId] = useState(
    currentEmployeeId ?? "",
  );
  const [isInterviewerDropdownOpen, setIsInterviewerDropdownOpen] =
    useState(false);
  const interviewerDropdownRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const preferredType = scheduleOptions?.interviewTypes.find(
    (option) =>
      preferredInterviewType &&
      normalizedName(option.name) === normalizedName(preferredInterviewType),
  );
  const unavailablePreferredType = Boolean(
    preferredInterviewType && !isLoadingScheduleOptions && !preferredType,
  );
  const selectedInterviewTypeId =
    interviewTypeId ||
    (preferredType ? String(preferredType.id) : "");

  useEffect(() => {
    if (!isInterviewerDropdownOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !interviewerDropdownRef.current?.contains(event.target)
      ) {
        setIsInterviewerDropdownOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsInterviewerDropdownOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isInterviewerDropdownOpen]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (unavailablePreferredType) {
      setError(
        `The ${preferredInterviewType} interview type is not configured.`,
      );
      return;
    }
    try {
      if (technicalRoundTwoInterviewId) {
        await scheduleTechnicalRoundTwo({
          interviewId: technicalRoundTwoInterviewId,
          interviewModeId: Number(interviewModeId),
          date,
          time,
          interviewerEmployeeId,
        }).unwrap();
      } else {
        await scheduleInterview({
          applicationId: candidate.applicationId,
          interviewTypeId: Number(selectedInterviewTypeId),
          interviewModeId: Number(interviewModeId),
          date,
          time,
          interviewerEmployeeId,
        }).unwrap();
      }
      onScheduled?.();
      onClose();
    } catch (requestError) {
      setError(
        errorMessage(requestError, "Unable to schedule this interview."),
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isScheduling) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-interview-title"
        onSubmit={(event) => void submit(event)}
        className="max-h-[90vh] w-full max-w-xl -translate-y-10 overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[#efeee9] bg-white px-5 py-4">
          <div>
            <h2 id="schedule-interview-title" className="font-bold text-[#26332c]">
              Schedule interview
            </h2>
            <p className="mt-1 text-xs text-[#78867e]">
              {candidate.candidateName} · {candidate.position}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isScheduling}
            aria-label="Close schedule interview"
            className="rounded-lg p-1.5 text-[#7e8981] hover:bg-[#f5f4ef] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="space-y-1.5 text-xs font-semibold text-[#59665d]">
            Interview type
            <select
              value={selectedInterviewTypeId}
              onChange={(event) => setInterviewTypeId(event.target.value)}
              required
              disabled={isLoadingScheduleOptions || lockInterviewType}
              className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm font-normal text-[#354239] outline-none focus:border-[#d8a43b]"
            >
              <option value="">Select interview type</option>
              {(scheduleOptions?.interviewTypes ?? []).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[#59665d]">
            Interview date
            <input
              type="date"
              min={minimumInterviewDate}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="h-10 w-full rounded-lg border border-[#dfe4df] px-3 text-sm font-normal text-[#354239] outline-none focus:border-[#d8a43b]"
            />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[#59665d]">
            Start time
            <input
              type="time"
              value={time}
              onChange={(event) => {
                setTime(event.target.value);
                event.currentTarget.blur();
              }}
              required
              className="h-10 w-full rounded-lg border border-[#dfe4df] px-3 text-sm font-normal text-[#354239] outline-none focus:border-[#d8a43b]"
            />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[#59665d]">
            Mode
            <select
              value={interviewModeId}
              onChange={(event) => setInterviewModeId(event.target.value)}
              className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm font-normal text-[#354239] outline-none focus:border-[#d8a43b]"
            >
              {(scheduleOptions?.interviewModes ?? []).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <div className="relative space-y-1.5 text-xs font-semibold text-[#59665d] sm:col-span-2">
            Interviewer
            <div ref={interviewerDropdownRef}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isInterviewerDropdownOpen}
                aria-controls="schedule-interviewer-options"
                disabled={isLoadingInterviewers || interviewers.length === 0}
                onClick={() =>
                  setIsInterviewerDropdownOpen((open) => !open)
                }
                className="flex h-10 w-full items-center justify-between rounded-lg border border-[#dfe4df] bg-white px-3 text-left text-sm font-normal text-[#354239] outline-none focus:border-[#d8a43b] disabled:bg-[#f5f5f2]"
              >
                <span className="truncate">
                  {interviewers.find(
                    (interviewer) =>
                      interviewer.id === interviewerEmployeeId,
                  )?.name ?? "Select an interviewer"}
                </span>
                <ChevronDown
                  className={`ml-2 h-4 w-4 shrink-0 transition-transform ${
                    isInterviewerDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isInterviewerDropdownOpen && (
                <div
                  id="schedule-interviewer-options"
                  role="listbox"
                  aria-label="Interviewers"
                  className="absolute z-20 mt-1 max-h-[108px] w-full overflow-y-auto rounded-lg border border-[#dfe4df] bg-white py-1 shadow-lg"
                >
                  {interviewers.map((interviewer) => {
                    const isSelected =
                      interviewer.id === interviewerEmployeeId;
                    return (
                      <button
                        key={interviewer.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setInterviewerEmployeeId(interviewer.id);
                          setIsInterviewerDropdownOpen(false);
                        }}
                        className={`flex h-9 w-full items-center px-3 text-left text-sm font-normal ${
                          isSelected
                            ? "bg-[#f3e4c5] text-[#354239]"
                            : "text-[#354239] hover:bg-[#fcf7ed]"
                        }`}
                      >
                        {interviewer.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {isLoadingScheduleOptions && (
            <p role="status" className="text-xs text-[#78867e] sm:col-span-2">
              Loading interview types and modes...
            </p>
          )}
          {scheduleOptionsError && (
            <p role="alert" className="text-xs text-rose-700 sm:col-span-2">
              {errorMessage(
                scheduleOptionsError,
                "Unable to load interview types and modes.",
              )}
              {unavailablePreferredType && (
                <p role="alert" className="text-xs text-rose-700 sm:col-span-2">
                  The {preferredInterviewType} interview type is not configured.
                </p>
              )}
            </p>
          )}
          {interviewersError && (
            <p role="alert" className="text-xs text-rose-700 sm:col-span-2">
              {errorMessage(interviewersError, "Unable to load interviewers.")}
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-rose-700 sm:col-span-2">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-[#efeee9] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isScheduling}
            className="h-9 rounded-lg border border-[#e2e5df] px-4 text-xs font-semibold text-[#58655c] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isScheduling ||
              isLoadingInterviewers ||
              isLoadingScheduleOptions ||
              interviewers.length === 0 ||
              !scheduleOptions?.interviewTypes.length ||
              !scheduleOptions.interviewModes.length ||
              !selectedInterviewTypeId ||
              unavailablePreferredType ||
              !interviewerEmployeeId
            }
            className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isScheduling ? "Scheduling..." : "Schedule interview"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function InterviewProcessScreen() {
  const [period, setPeriod] = useState<RecruitmentInterviewPeriod>("today");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const todayResult = useGetTodayRecruitmentInterviewsQuery(
    {
      search: search.trim() || undefined,
      page,
      limit: pageSize,
    },
    { skip: period !== "today" },
  );
  const periodResult = useGetRecruitmentInterviewsQuery({
    period,
    search: search.trim() || undefined,
    page,
    limit: pageSize,
  }, { skip: period === "today" });
  const result = period === "today" ? todayResult.data : periodResult.data;
  const error = period === "today" ? todayResult.error : periodResult.error;
  const isLoading =
    period === "today" ? todayResult.isLoading : periodResult.isLoading;
  const interviews = result?.data ?? [];

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
            Talent Hub
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
            Interview Process
          </h1>
          <p className="mt-1.5 text-sm text-[#7b8981]">
            View interviews scheduled for today, upcoming dates, and past dates.
          </p>
        </div>
        <label className="relative block min-w-[220px] sm:w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#88938c]" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search candidates or roles"
            aria-label="Search interviews"
            className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#d8a43b]"
          />
        </label>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[#26332c]">
          {period === "today"
            ? new Date().toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            : period === "upcoming"
              ? "Upcoming interviews"
              : "Past interviews"}
        </h2>
        <div
          className="flex items-center rounded-full border border-[#e5e8e3] bg-white p-1"
          role="tablist"
          aria-label="Filter interviews by date"
        >
          {(
            [
              ["today", "Today"],
              ["upcoming", "Upcoming"],
              ["past", "Past"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={period === value}
              onClick={() => {
                setPeriod(value);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                period === value
                  ? "bg-[#fff3d6] text-[#9b6811]"
                  : "text-[#69766e] hover:bg-[#f5f6f3]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <InterviewCard title={period === "today" ? "Today's interviews" : `${period[0].toUpperCase()}${period.slice(1)} interviews`}>
        {isLoading ? (
          <p className="p-5 text-sm text-[#78867e]">Loading interviews...</p>
        ) : error ? (
          <p role="alert" className="p-5 text-sm text-rose-700">
            {errorMessage(error, "Unable to load interviews.")}
          </p>
        ) : interviews.length === 0 ? (
          <div className="flex min-h-36 flex-col items-center justify-center gap-2 p-6 text-center">
            <CalendarDays className="h-6 w-6 text-[#87938c]" />
            <p className="text-sm font-semibold text-[#536159]">
              No interviews {period === "today" ? "today" : period}.
            </p>
            {period === "today" && (
              <p className="text-xs text-[#87938c]">
                Enjoy the quiet. Check the Upcoming tab for what is next.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse whitespace-nowrap text-left">
                <thead>
                  <tr>
                    {[
                      "When",
                      "Candidate",
                      "Round",
                      "Interviewer",
                      "Feedback",
                    ].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078] first:pl-5"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((interview) => (
                    <tr
                      key={interview.id}
                      className="border-t border-[#eef0eb] odd:bg-white even:bg-[#fffaf0] text-xs text-[#344138] transition-colors hover:bg-[#f3e4c5]"
                    >
                      <td className="px-4 py-3.5 pl-5">
                        {formatDate(interview.scheduledAt)}
                      </td>
                      <td className="px-4 py-3.5">{interview.candidateName}</td>
                      <td className="px-4 py-3.5">
                        {interview.roundName} · {interview.interviewType}
                      </td>
                      <td className="px-4 py-3.5">{interview.interviewerName}</td>
                      <td className="px-4 py-3.5">
                        {interview.feedbackSubmitted
                          ? "Submitted"
                          : "Awaiting"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <RecruitmentPagination
              page={page}
              pageSize={pageSize}
              totalCount={result?.meta.total ?? 0}
              totalPages={result?.meta.totalPages}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </InterviewCard>
    </section>
  );
}

function InterviewReviewDialog({
  interview,
  onClose,
}: {
  interview: ScheduledCandidateInterview;
  onClose: () => void;
}) {
  const [moveCandidate, { isLoading: isMoving }] =
    useMoveCandidateToNextStageMutation();
  const [isScheduling, setIsScheduling] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [hasMoved, setHasMoved] = useState(false);
  const [hasScheduled, setHasScheduled] = useState(false);
  const interviewType = normalizedName(interview.interviewType);
  const nextInterviewType =
    interviewType === "technical1" || interviewType === "technical"
      ? "Technical 2"
      : undefined;

  const moveToNextStage = async () => {
    setActionError("");
    setActionMessage("");
    try {
      const result = await moveCandidate(interview.applicationId).unwrap();
      setActionMessage(result.message);
      setHasMoved(true);
    } catch (requestError) {
      setActionError(
        errorMessage(
          requestError,
          "Unable to move the candidate to the next stage.",
        ),
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#202a26]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isMoving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="interview-review-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[#efeee9] px-5 py-4">
          <div>
            <h2
              id="interview-review-title"
              className="font-bold text-[#26332c]"
            >
              Interview Review
            </h2>
            <p className="mt-1 text-sm text-[#78867e]">
              {interview.candidateName} · {interview.position}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close interview review"
            className="rounded-lg p-1.5 text-[#7e8981] hover:bg-[#f5f4ef]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <dl className="grid gap-3 p-5 sm:grid-cols-2">
          {[
            ["Candidate", interview.candidateName],
            [
              "Interview round",
              `${interview.roundName} · ${interview.interviewType}`,
            ],
            ["Interview status", interview.status],
            ["Feedback submitted", interview.feedbackSubmitted ? "Yes" : "No"],
            ["Interviewer", interview.interviewerName],
            ["Scheduled", formatDate(interview.scheduledAt)],
            [
              "Overall rating",
              interview.feedbackRating == null
                ? "—"
                : `${interview.feedbackRating}/10`,
            ],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-[#f8f9f7] p-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium capitalize text-[#354239]">
                {value}
              </dd>
            </div>
          ))}
          <div className="rounded-lg bg-[#f8f9f7] p-3 sm:col-span-2">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
              Interviewer feedback
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-[#354239]">
              {interview.feedbackText || "No feedback has been submitted."}
            </dd>
          </div>
        </dl>

        {interview.feedbackSubmitted &&
          interview.isLatestInterview &&
          !interview.alreadyMovedToNextStage &&
          !hasMoved &&
          !hasScheduled && (
            <div className="grid gap-3 border-t border-[#efeee9] p-5 sm:grid-cols-2">
              {nextInterviewType && (
                <button
                  type="button"
                  onClick={() => setIsScheduling(true)}
                  disabled={isMoving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe4df] px-4 py-3 text-sm font-semibold text-[#344138] hover:bg-[#f8f9f7] disabled:opacity-50"
                >
                  <CalendarDays className="h-4 w-4" />
                  Schedule {nextInterviewType}
                </button>
              )}
              <button
                type="button"
                onClick={() => void moveToNextStage()}
                disabled={isMoving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e8f4ec] px-4 py-3 text-sm font-semibold text-[#39724f] hover:bg-[#d9ecdf] disabled:opacity-50"
              >
                <ArrowRight className="h-4 w-4" />
                {isMoving ? "Moving..." : "Move to Next Stage"}
              </button>
            </div>
          )}
        {interview.feedbackSubmitted && !interview.isLatestInterview && (
          <p className="border-t border-[#efeee9] px-5 py-4 text-sm text-[#78867e]">
            A later interview is already scheduled. Review that round before
            moving the candidate forward.
          </p>
        )}
        {(interview.alreadyMovedToNextStage || hasMoved) && (
          <p className="border-t border-[#efeee9] px-5 py-4 text-sm text-[#39724f]">
            Candidate is already in Final Interview Approval.
          </p>
        )}

        {(actionError || actionMessage) && (
          <p
            role={actionError ? "alert" : "status"}
            className={`border-t px-5 py-3 text-sm ${
              actionError
                ? "border-rose-100 bg-rose-50 text-rose-700"
                : "border-[#dcebdc] bg-[#f2faf3] text-[#39724f]"
            }`}
          >
            {actionError || actionMessage}
          </p>
        )}
        {!interview.feedbackSubmitted && (
          <p className="border-t border-[#efeee9] px-5 py-4 text-sm text-[#78867e]">
            Interviewer feedback must be submitted before moving the candidate
            forward or scheduling another round.
          </p>
        )}
      </section>
      {isScheduling && (
        <ScheduleInterviewDialog
          candidate={{
            applicationId: interview.applicationId,
            candidateName: interview.candidateName,
            position: interview.position,
          }}
          preferredInterviewType={nextInterviewType}
          lockInterviewType
          onClose={() => setIsScheduling(false)}
          onScheduled={() => {
            setActionError("");
            setActionMessage("The next interview was scheduled successfully.");
            setHasScheduled(true);
          }}
        />
      )}
    </div>
  );
}

export function InterviewDetailDialog({
  interview,
  onClose,
}: {
  interview: RecruitmentInterview;
  onClose: () => void;
}) {
  const {
    data: detail,
    error,
    isLoading,
  } = useGetRecruitmentInterviewQuery(interview.id);
  const {
    data: feedbackRecords = [],
    error: feedbackRecordsError,
  } = useGetRecruitmentInterviewFeedbackQuery(interview.id);
  const [submitFeedback, { isLoading: isSubmittingFeedback }] =
    useSubmitRecruitmentInterviewFeedbackMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateRecruitmentInterviewStatusMutation();
  const [rating, setRating] = useState(4);
  const [recommendation, setRecommendation] =
    useState<"strong_hire" | "hire" | "hold" | "no_hire">("hire");
  const [feedback, setFeedback] = useState("");
  const [strengths, setStrengths] = useState("");
  const [concerns, setConcerns] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const record = detail ?? interview;
  const isBusy = isSubmittingFeedback || isUpdatingStatus;

  const saveFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError("");
    setActionMessage("");
    try {
      const result = await submitFeedback({
        interviewId: interview.id,
        rating,
        recommendation,
        feedback,
        strengths: strengths.trim() || undefined,
        concerns: concerns.trim() || undefined,
      }).unwrap();
      setActionMessage(result.message);
      setFeedback("");
    } catch (requestError) {
      setActionError(
        errorMessage(requestError, "Unable to save interview feedback."),
      );
    }
  };

  const setInterviewStatus = async (status: "completed" | "no_show") => {
    setActionError("");
    setActionMessage("");
    try {
      await updateStatus({ interviewId: interview.id, status }).unwrap();
      setActionMessage(
        status === "completed" ? "Interview marked completed." : "Candidate marked as no-show.",
      );
    } catch (requestError) {
      setActionError(
        errorMessage(requestError, "Unable to update interview status."),
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isBusy) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="interview-process-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[#efeee9] bg-white px-5 py-4">
          <div>
            <h2 id="interview-process-title" className="font-bold text-[#26332c]">
              {record.roundName} · {record.candidateName}
            </h2>
            <p className="mt-1 text-xs text-[#78867e]">
              {record.position} · {formatDate(record.scheduledAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close interview details"
            className="rounded-lg p-1.5 text-[#7e8981] hover:bg-[#f5f4ef]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {isLoading ? (
          <p className="p-5 text-sm text-[#78867e]">Loading interview details...</p>
        ) : error ? (
          <p role="alert" className="p-5 text-sm text-rose-700">
            {errorMessage(error, "Unable to load interview details.")}
          </p>
        ) : (
          <>
            <dl className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
              {[
                ["Application", record.applicationCode],
                ["Candidate", record.candidateCode],
                ["Candidate email", record.candidateEmail],
                ["Mode", record.mode.replace("_", " ")],
                ["Duration", `${record.durationMinutes} minutes`],
                ["Interview panel", record.panel],
                ["Meeting link / location", record.locationOrLink],
                ["Status", record.status.replace("_", " ")],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-[#f0f0eb] py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words text-sm font-medium capitalize text-[#354239]">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
            {feedbackRecordsError ? (
              <p role="alert" className="border-t border-rose-100 p-5 text-sm text-rose-700">
                {errorMessage(
                  feedbackRecordsError,
                  "Unable to load interview feedback.",
                )}
              </p>
            ) : feedbackRecords.length > 0 ? (
              <section className="space-y-3 border-t border-[#efeee9] p-5">
                <h3 className="text-sm font-bold text-[#354239]">
                  Panel feedback
                </h3>
                {feedbackRecords.map((item) => (
                  <article
                    key={`${item.employeeId}-${item.submittedAt}`}
                    className="rounded-xl border border-[#e8ebe5] bg-[#fbfcfa] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#354239]">
                        {item.employeeId} · {item.rating}/5 ·{" "}
                        {item.recommendation.replace("_", " ")}
                      </p>
                      <time className="text-[11px] text-[#87938c]">
                        {formatDate(item.submittedAt)}
                      </time>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-[#536159]">
                      {item.feedback}
                    </p>
                    {(item.strengths || item.concerns) && (
                      <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                        {item.strengths && (
                          <p>
                            <span className="font-semibold">Strengths: </span>
                            {item.strengths}
                          </p>
                        )}
                        {item.concerns && (
                          <p>
                            <span className="font-semibold">Concerns: </span>
                            {item.concerns}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </section>
            ) : null}
            {record.status === "scheduled" && (
              <>
                <form onSubmit={(event) => void saveFeedback(event)} className="space-y-3 border-t border-[#efeee9] p-5">
                  <h3 className="text-sm font-bold text-[#354239]">Submit interview feedback</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 text-xs font-semibold text-[#59665d]">
                      Rating (0-5)
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.5"
                        value={rating}
                        onChange={(event) => setRating(Number(event.target.value))}
                        required
                        className="h-9 w-full rounded-lg border border-[#dfe4df] px-3 text-sm font-normal"
                      />
                    </label>
                    <label className="space-y-1 text-xs font-semibold text-[#59665d]">
                      Recommendation
                      <select
                        value={recommendation}
                        onChange={(event) =>
                          setRecommendation(
                            event.target.value as typeof recommendation,
                          )
                        }
                        className="h-9 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm font-normal"
                      >
                        <option value="strong_hire">Strong hire</option>
                        <option value="hire">Hire</option>
                        <option value="hold">Hold</option>
                        <option value="no_hire">No hire</option>
                      </select>
                    </label>
                  </div>
                  <label className="block space-y-1 text-xs font-semibold text-[#59665d]">
                    Feedback
                    <textarea
                      value={feedback}
                      onChange={(event) => setFeedback(event.target.value)}
                      required
                      minLength={2}
                      maxLength={4000}
                      rows={3}
                      className="w-full rounded-lg border border-[#dfe4df] px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 text-xs font-semibold text-[#59665d]">
                      Strengths
                      <textarea
                        value={strengths}
                        onChange={(event) => setStrengths(event.target.value)}
                        maxLength={2000}
                        rows={2}
                        className="w-full rounded-lg border border-[#dfe4df] px-3 py-2 text-sm font-normal"
                      />
                    </label>
                    <label className="space-y-1 text-xs font-semibold text-[#59665d]">
                      Concerns
                      <textarea
                        value={concerns}
                        onChange={(event) => setConcerns(event.target.value)}
                        maxLength={2000}
                        rows={2}
                        className="w-full rounded-lg border border-[#dfe4df] px-3 py-2 text-sm font-normal"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isBusy || !feedback.trim()}
                    className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] disabled:opacity-50"
                  >
                    {isSubmittingFeedback ? "Saving..." : "Save feedback"}
                  </button>
                </form>
                <div className="flex flex-wrap justify-end gap-2 border-t border-[#efeee9] px-5 py-4">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => void setInterviewStatus("no_show")}
                    className="h-9 rounded-lg border border-rose-200 px-4 text-xs font-semibold text-rose-700 disabled:opacity-50"
                  >
                    Mark no-show
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => void setInterviewStatus("completed")}
                    className="h-9 rounded-lg bg-[#e8f4ec] px-4 text-xs font-semibold text-[#39724f] disabled:opacity-50"
                  >
                    Mark completed
                  </button>
                </div>
              </>
            )}
            {(actionError || actionMessage) && (
              <p
                role={actionError ? "alert" : "status"}
                className={`border-t px-5 py-3 text-sm ${
                  actionError
                    ? "border-rose-100 bg-rose-50 text-rose-700"
                    : "border-[#dcebdc] bg-[#f2faf3] text-[#39724f]"
                }`}
              >
                {actionError || actionMessage}
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
