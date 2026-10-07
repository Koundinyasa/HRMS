import { useState, type FormEvent } from "react";
import { ArrowUpRight, CalendarDays, X } from "lucide-react";
import type { ReactNode } from "react";
import type {
  Candidate,
  CandidateStage,
  InterviewSchedule,
} from "../types/recruitment.types";
import { EmptyState } from "./RecruitmentShared";

type ReviewDecision = "Reviewing" | "Shortlisted" | "Rejected";

function candidateCode(candidate: Candidate) {
  return (
    candidate.candidateCode ||
    `CAND-2026-${String(candidate.id + 77).padStart(3, "0")}`
  );
}

function resumeHref(candidate: Candidate) {
  const url = candidate.resumeUrl?.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const apiBaseUrl =
    import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";
  return `${apiBaseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
}

function PanelCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeee9] px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-[#26332c]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  const tone =
    children === "Scheduled"
      ? "bg-[#fff3d6] text-[#9b6811]"
      : children === "Skipped"
        ? "bg-[#f3eee2] text-[#786747]"
        : children === "Shortlisted" || children === "Qualified"
          ? "bg-[#e8f4ec] text-[#39724f]"
          : children === "Rejected"
            ? "bg-[#fbeceb] text-[#aa504c]"
            : "bg-[#f1f3f1] text-[#68756d]";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {children}
    </span>
  );
}

function TableFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

function TableHeading({ children }: { children: ReactNode }) {
  return (
    <th className="bg-[#f8f8f5] px-4 py-3 text-xs font-semibold text-[#66736b] first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: ReactNode }) {
  return (
    <td className="border-t border-[#f0f0eb] px-4 py-3.5 text-xs text-[#55635a] first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6">
      {children}
    </td>
  );
}

export function ResumeScreeningPanel({
  candidates,
  updateCandidateStage,
}: {
  candidates: Candidate[];
  updateCandidateStage: (candidateId: number, stage: CandidateStage) => void;
}) {
  const [decisions, setDecisions] = useState<Record<number, ReviewDecision>>({});
  const screeningCandidates = candidates.filter(
    (candidate) => candidate.stage === "Applied" || candidate.stage === "Screening"
  );

  const setDecision = (candidate: Candidate, decision: ReviewDecision) => {
    setDecisions((previous) => ({ ...previous, [candidate.id]: decision }));
    if (decision === "Shortlisted") {
      updateCandidateStage(candidate.id, "Screening");
    }
  };

  return (
    <PanelCard
      title="Resume Screening"
      action={
        <span className="rounded-lg border border-[#eee9dc] bg-[#fcfaf5] px-3 py-2 text-xs font-medium text-[#74684d]">
          HR Manager · 294676
        </span>
      }
    >
      {screeningCandidates.length === 0 ? (
        <div className="p-5">
          <EmptyState message="No candidates are available for resume screening." />
        </div>
      ) : (
        <TableFrame>
          <thead>
            <tr>
              <TableHeading>Candidate</TableHeading>
              <TableHeading>Name</TableHeading>
              <TableHeading>Job</TableHeading>
              <TableHeading>Resume URL</TableHeading>
              <TableHeading>Action</TableHeading>
            </tr>
          </thead>
          <tbody>
            {screeningCandidates.map((candidate) => {
              const decision = decisions[candidate.id] ?? "Reviewing";
              return (
                <tr key={candidate.id} className="transition-colors hover:bg-[#fdfcf9]">
                  <TableCell>
                    <span className="font-medium text-[#59665d]">
                      {candidateCode(candidate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-[#303d34]">{candidate.name}</span>
                  </TableCell>
                  <TableCell>{candidate.role}</TableCell>
                  <TableCell>
                    {candidate.resumeUrl ? (
                      <>
                        <a
                          href={resumeHref(candidate)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#a87519] hover:text-[#80540d]"
                        >
                          View Resume <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <span className="mt-1 block max-w-xs truncate text-[11px] text-[#939b95]">
                          {candidate.resumeUrl}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-[#939b95]">
                        Resume not available
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {decision === "Reviewing" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDecision(candidate, "Shortlisted")}
                          className="rounded-lg bg-[#e8f4ec] px-3 py-2 text-xs font-semibold text-[#39724f] transition hover:bg-[#d9ecdf]"
                        >
                          Shortlist
                        </button>
                        <button
                          type="button"
                          onClick={() => setDecision(candidate, "Rejected")}
                          className="rounded-lg bg-[#fbeceb] px-3 py-2 text-xs font-semibold text-[#aa504c] transition hover:bg-[#f5dcda]"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <StatusPill>{decision}</StatusPill>
                    )}
                  </TableCell>
                </tr>
              );
            })}
          </tbody>
        </TableFrame>
      )}
    </PanelCard>
  );
}

export function InterviewSchedulePanel({
  candidates,
  schedules,
  onSchedule,
}: {
  candidates: Candidate[];
  schedules: Record<number, InterviewSchedule>;
  onSchedule: (candidateId: number, schedule: InterviewSchedule) => void;
}) {
  const shortlistedCandidates = candidates.filter(
    (candidate) => candidate.stage === "Screening",
  );
  const [drafts, setDrafts] = useState<
    Record<number, Partial<InterviewSchedule>>
  >({});

  const updateDraft = (
    candidateId: number,
    field: keyof InterviewSchedule,
    value: string,
  ) => {
    setDrafts((previous) => ({
      ...previous,
      [candidateId]: { ...previous[candidateId], [field]: value },
    }));
  };

  return (
    <PanelCard title="Interview Schedule">
      {shortlistedCandidates.length === 0 ? (
        <div className="p-5">
          <EmptyState message="Shortlist candidates in Resume Screening to schedule interviews." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <TableHeading>Candidate</TableHeading>
                <TableHeading>Name</TableHeading>
                <TableHeading>Job</TableHeading>
                <TableHeading>Assigned Interviewer</TableHeading>
                <TableHeading>Interview Date</TableHeading>
                <TableHeading>Interview Time</TableHeading>
                <TableHeading>Action</TableHeading>
              </tr>
            </thead>
            <tbody>
              {shortlistedCandidates.map((candidate) => {
                const schedule = schedules[candidate.id];
                const draft = drafts[candidate.id];
                const interviewerName =
                  draft?.interviewerName ?? schedule?.interviewerName ?? "";
                const date = draft?.date ?? schedule?.date ?? "";
                const time = draft?.time ?? schedule?.time ?? "";

                return (
                  <tr
                    key={candidate.id}
                    className="transition-colors hover:bg-[#fdfcf9]"
                  >
                    <TableCell>
                      <span className="font-medium text-[#59665d]">
                        {candidateCode(candidate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-[#303d34]">
                        {candidate.name}
                      </span>
                    </TableCell>
                    <TableCell>{candidate.role}</TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={interviewerName}
                        onChange={(event) =>
                          updateDraft(
                            candidate.id,
                            "interviewerName",
                            event.target.value,
                          )
                        }
                        maxLength={150}
                        placeholder="Interviewer name"
                        aria-label={`Assigned interviewer for ${candidate.name}`}
                        className="h-9 w-44 rounded-lg border border-[#dfe4df] px-2.5 text-xs outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="date"
                        value={date}
                        onChange={(event) =>
                          updateDraft(candidate.id, "date", event.target.value)
                        }
                        aria-label={`Interview date for ${candidate.name}`}
                        className="h-9 rounded-lg border border-[#dfe4df] px-2 text-xs outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="time"
                        value={time}
                        onChange={(event) =>
                          updateDraft(candidate.id, "time", event.target.value)
                        }
                        aria-label={`Interview time for ${candidate.name}`}
                        className="h-9 rounded-lg border border-[#dfe4df] px-2 text-xs outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        disabled={!interviewerName.trim() || !date || !time}
                        onClick={() =>
                          onSchedule(candidate.id, {
                            interviewerName: interviewerName.trim(),
                            date,
                            time,
                          })
                        }
                        className="whitespace-nowrap rounded-lg bg-[#e8f4ec] px-3 py-2 text-xs font-semibold text-[#39724f] transition hover:bg-[#d9ecdf] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {schedule ? "Update Schedule" : "Schedule Interview"}
                      </button>
                    </TableCell>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PanelCard>
  );
}

type AssessmentRecord = {
  candidate: Candidate;
  status: "Scheduled" | "Pending" | "Skipped";
  required: boolean;
  result: "Pending" | "Direct Interview" | "Qualified" | "Rejected";
  remarks: string;
};

function initialAssessmentRecords(candidates: Candidate[]): AssessmentRecord[] {
  return candidates
    .filter(
      (candidate) => candidate.stage === "Screening" || candidate.stage === "Interview"
    )
    .map((candidate, index) => {
      const isInterviewing = candidate.stage === "Interview";
      return {
        candidate,
        status: isInterviewing ? "Skipped" : index === 0 ? "Scheduled" : "Pending",
        required: !isInterviewing,
        result: isInterviewing ? "Direct Interview" : "Pending",
        remarks: "",
      };
    });
}

export function AssessmentManagementPanel({
  candidates,
}: {
  candidates: Candidate[];
}) {
  const [records, setRecords] = useState(() => initialAssessmentRecords(candidates));
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [remarks, setRemarks] = useState("");

  const updateRecord = (
    candidateId: number,
    updates: Partial<Omit<AssessmentRecord, "candidate">>
  ) => {
    setRecords((previous) =>
      previous.map((record) =>
        record.candidate.id === candidateId ? { ...record, ...updates } : record
      )
    );
  };

  const handleSchedule = () => {
    setRecords((previous) =>
      previous.map((record) =>
        record.status === "Pending" && record.required
          ? { ...record, status: "Scheduled" }
          : record
      )
    );
  };

  const handleSkip = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const candidateId = Number(selectedCandidateId);
    if (!Number.isFinite(candidateId) || !records.some((record) => record.candidate.id === candidateId)) {
      return;
    }
    updateRecord(candidateId, {
      required: false,
      status: "Skipped",
      result: "Direct Interview",
      remarks: remarks.trim(),
    });
    setIsSkipDialogOpen(false);
    setSelectedCandidateId("");
    setRemarks("");
  };

  return (
    <>
      <div className="space-y-5">
        <PanelCard
          title="Assessment Management"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSchedule}
                disabled={!records.some((record) => record.status === "Pending")}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#e5a538] px-3.5 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Schedule Assessment
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCandidateId(
                    String(records.find((record) => record.status !== "Skipped")?.candidate.id ?? "")
                  );
                  setIsSkipDialogOpen(true);
                }}
                disabled={records.length === 0}
                className="h-9 rounded-lg border border-[#e8e6de] bg-[#faf9f5] px-3.5 text-xs font-semibold text-[#566258] transition hover:bg-[#f1eee5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Skip Assessment
              </button>
            </div>
          }
        >
          {records.length === 0 ? (
            <div className="p-5">
              <EmptyState message="No shortlisted candidates are ready for assessment." />
            </div>
          ) : (
            <TableFrame>
              <thead>
                <tr>
                  <TableHeading>Candidate</TableHeading>
                  <TableHeading>Assessment</TableHeading>
                  <TableHeading>Round</TableHeading>
                  <TableHeading>Required</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading>Result</TableHeading>
                  <TableHeading>Action</TableHeading>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const { candidate } = record;
                  return (
                    <tr key={candidate.id} className="transition-colors hover:bg-[#fdfcf9]">
                      <TableCell>
                        <span className="block font-semibold text-[#303d34]">
                          {candidateCode(candidate)}
                        </span>
                        <span className="mt-1 block text-[11px] text-[#87928a]">
                          {candidate.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        {candidate.role.toLowerCase().includes("engineer")
                          ? "Technical Coding Test"
                          : "Role-based Assessment"}
                      </TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>{record.required ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <StatusPill>{record.status}</StatusPill>
                      </TableCell>
                      <TableCell>{record.result}</TableCell>
                      <TableCell>
                        {record.status === "Skipped" ? (
                          <button
                            type="button"
                            onClick={() =>
                              updateRecord(candidate.id, {
                                required: true,
                                status: "Scheduled",
                                result: "Pending",
                                remarks: "",
                              })
                            }
                            className="rounded-lg bg-[#f1f3f1] px-3 py-2 text-xs font-semibold text-[#566258] transition hover:bg-[#e5e9e5]"
                          >
                            Undo Skip
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateRecord(candidate.id, {
                                  result: "Qualified",
                                  status: "Scheduled",
                                })
                              }
                              className="rounded-lg bg-[#e8f4ec] px-3 py-2 text-xs font-semibold text-[#39724f] transition hover:bg-[#d9ecdf]"
                            >
                              Qualify
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateRecord(candidate.id, {
                                  result: "Rejected",
                                  status: "Scheduled",
                                })
                              }
                              className="rounded-lg bg-[#fbeceb] px-3 py-2 text-xs font-semibold text-[#aa504c] transition hover:bg-[#f5dcda]"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </tr>
                  );
                })}
              </tbody>
            </TableFrame>
          )}
          <p className="border-t border-[#efeee9] bg-[#fcfaf5] px-5 py-3 text-xs text-[#7c725e] sm:px-6">
            Skip Assessment sets Required to No and moves the candidate directly to interviewing.
          </p>
        </PanelCard>

        <PanelCard title="Candidate Status">
          {records.length === 0 ? (
            <div className="p-5">
              <EmptyState message="Candidate status will appear here when candidates are ready for assessment." />
            </div>
          ) : (
            <TableFrame>
              <thead>
                <tr>
                  <TableHeading>Candidate</TableHeading>
                  <TableHeading>Name</TableHeading>
                  <TableHeading>Application Status</TableHeading>
                  <TableHeading>Assessment Decision</TableHeading>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.candidate.id} className="transition-colors hover:bg-[#fdfcf9]">
                    <TableCell>{candidateCode(record.candidate)}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-[#303d34]">
                        {record.candidate.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusPill>
                        {record.result === "Rejected"
                          ? "Rejected"
                          : record.status === "Skipped" || record.result === "Qualified"
                            ? "Interviewing"
                            : "Shortlisted"}
                      </StatusPill>
                    </TableCell>
                    <TableCell>
                      {record.status === "Skipped"
                        ? "Skipped — Direct Interview"
                        : record.result}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </TableFrame>
          )}
        </PanelCard>
      </div>

      {isSkipDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#202a26]/55 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsSkipDialogOpen(false);
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="skip-assessment-title"
            onSubmit={handleSkip}
            className="w-full max-w-md rounded-2xl border border-[#eee9dc] bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="skip-assessment-title" className="text-lg font-bold text-[#26332c]">
                Skip Assessment
              </h2>
              <button
                type="button"
                onClick={() => setIsSkipDialogOpen(false)}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-[#7e8981] transition hover:bg-[#f5f4ef]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="mb-3 block space-y-1.5 text-xs font-semibold text-[#59665d]">
              <span>Candidate</span>
              <select
                value={selectedCandidateId}
                onChange={(event) => setSelectedCandidateId(event.target.value)}
                required
                className="h-10 w-full rounded-lg border border-[#dddcd5] bg-white px-3 text-sm font-normal text-[#303d34] outline-none focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20"
              >
                {records.map((record) => (
                  <option key={record.candidate.id} value={record.candidate.id}>
                    {candidateCode(record.candidate)} - {record.candidate.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
              <span>Remarks</span>
              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                rows={3}
                placeholder="Assessment not required for this candidate."
                className="w-full resize-y rounded-lg border border-[#dddcd5] bg-white px-3 py-2.5 text-sm font-normal text-[#303d34] outline-none placeholder:text-[#a3aaa4] focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20"
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSkipDialogOpen(false)}
                className="h-9 rounded-lg border border-[#e8e6de] px-4 text-xs font-semibold text-[#566258] transition hover:bg-[#f8f7f2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedCandidateId}
                className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
