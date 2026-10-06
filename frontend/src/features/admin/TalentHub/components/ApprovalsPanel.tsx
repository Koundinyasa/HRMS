import type { Dispatch, SetStateAction } from "react";
import { Check } from "lucide-react";
import { EmptyState } from "./RecruitmentShared";
import type { Approval, ApprovalStatus } from "../types/recruitment.types";
interface ApprovalsPanelProps {
  approvals: Approval[];
  selectedApprovalStatus: ApprovalStatus;
  setSelectedApprovalStatus: (status: ApprovalStatus) => void;
  search: string;
  approvalComments: Record<number, string>;
  setApprovalComments: Dispatch<SetStateAction<Record<number, string>>>;
  sendBackOpening: (approvalId: number) => void;
  approveOpening: (approvalId: number) => void;
}

export function ApprovalsPanel({
  approvals,
  selectedApprovalStatus,
  setSelectedApprovalStatus,
  search,
  approvalComments,
  setApprovalComments,
  sendBackOpening,
  approveOpening,
}: ApprovalsPanelProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedApprovalStatus("waiting")}
          aria-pressed={selectedApprovalStatus === "waiting"}
          className="rounded-full border border-[#202a26] bg-[#202a26] px-4 py-2 text-sm font-semibold text-white"
        >
          Pending approval ({approvals.length})
        </button>
      </div>

      <div className="space-y-5">
        {approvals
          .filter((approval) => approval.status === selectedApprovalStatus)
          .filter((approval) => {
            const normalizedSearch = search.trim().toLowerCase();
            return (
              !normalizedSearch ||
              approval.title.toLowerCase().includes(normalizedSearch) ||
              approval.department.toLowerCase().includes(normalizedSearch) ||
              approval.location.toLowerCase().includes(normalizedSearch) ||
              approval.requestedBy.toLowerCase().includes(normalizedSearch)
            );
          })
          .map((approval) => {
            const reviewingStep = approval.chain.find(
              (step) => step.status === "reviewing"
            );
            return (
              <article
                key={approval.id}
                className="grid gap-7 rounded-2xl border border-[#dfe6e1] bg-white p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10"
              >
                <div>
                  <h2 className="text-xl font-bold text-[#28332d]">
                    {approval.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#78867e]">
                    {approval.department}, {approval.location}. Requested by{" "}
                    {approval.requestedBy} on {approval.requestedDate}.
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
                    {[
                      ["Positions", String(approval.positions)],
                      ["Reason", approval.reason],
                      ["Salary band", approval.salaryBand],
                      ["Target joining", approval.targetJoining],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs text-[#849088]">{label}</dt>
                        <dd className="mt-1 text-sm font-medium text-[#344139]">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 max-w-3xl rounded-xl bg-[#eef1ed] px-4 py-3 text-sm leading-6 text-[#46534b]">
                    {approval.justification}
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 font-bold text-[#28332d]">
                    Approval chain
                  </h3>
                  <ol className="space-y-0">
                    {approval.chain.map((step, index) => {
                      const isFinished =
                        step.status === "submitted" ||
                        step.status === "approved";
                      const isSentBack = step.status === "sent-back";
                      return (
                        <li
                          key={`${step.name}-${step.role}-${index}`}
                          className="relative flex gap-3 pb-4 last:pb-0"
                        >
                          {index < approval.chain.length - 1 && (
                            <span className="absolute left-[9px] top-5 h-full w-px bg-[#dfe6e1]" />
                          )}
                          <span
                            className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              isFinished
                                ? "border-[#318365] bg-[#318365] text-white"
                                : isSentBack
                                ? "border-[#bd4b3d] bg-[#bd4b3d] text-white"
                                : step.status === "reviewing"
                                  ? "border-[#d99a2b] bg-white ring-4 ring-[#e5a538]/20"
                                : "border-[#dfe6e1] bg-white"
                            }`}
                            aria-hidden="true"
                          >
                            {(isFinished || isSentBack) && (
                              <Check className="h-3 w-3" />
                            )}
                          </span>
                          <div className="min-w-0 pt-0.5">
                            <p
                              className={`text-sm font-semibold ${
                                step.status === "waiting"
                                  ? "text-[#78867e]"
                                  : "text-[#28332d]"
                              }`}
                            >
                              {step.name}
                            </p>
                            <p className="mt-0.5 text-xs text-[#849088]">
                              {step.status === "submitted"
                                ? `${step.role} ${step.date ?? ""}`
                                : `${step.role}, ${
                                    step.status === "reviewing"
                                      ? "reviewing now"
                                      : step.status === "waiting"
                                      ? "waiting"
                                      : step.status === "sent-back"
                                      ? `sent back ${step.date ?? ""}`
                                      : `approved ${step.date ?? ""}`
                                  }`}
                            </p>
                            {step.note && (
                              <p className="mt-2 border-l-2 border-[#dfe6e1] pl-3 text-sm leading-5 text-[#46534b]">
                                {step.note}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                  {approval.chain.length === 0 && (
                    <p className="text-sm text-[#78867e]">
                      Approval steps are not included in the backend response.
                    </p>
                  )}

                  {approval.status === "waiting" && (
                    <div className="mt-5">
                      <label
                        className="sr-only"
                        htmlFor={`approval-comment-${approval.id}`}
                      >
                        Comment required to send back
                      </label>
                      <textarea
                        id={`approval-comment-${approval.id}`}
                        value={approvalComments[approval.id] ?? ""}
                        onChange={(event) =>
                          setApprovalComments((previous) => ({
                            ...previous,
                            [approval.id]: event.target.value,
                          }))
                        }
                        placeholder="Reason for rejection"
                        rows={2}
                        className="w-full resize-y rounded-xl border border-[#dfe6e1] bg-[#f8faf8] px-3 py-2.5 text-sm outline-none placeholder:text-[#8b9690] focus:border-[#537b65] focus:ring-2 focus:ring-[#537b65]/15"
                      />
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={!approvalComments[approval.id]?.trim()}
                          onClick={() => sendBackOpening(approval.id)}
                          className="h-11 rounded-xl border border-[#dfe6e1] bg-white text-sm font-semibold text-[#bd4b3d] transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => approveOpening(approval.id)}
                          className="h-11 rounded-xl bg-[#e5a538] text-sm font-semibold text-[#342712] transition hover:bg-[#d99a2b]"
                        >
                          Approve
                        </button>
                      </div>
                      {reviewingStep && (
                        <p className="mt-3 text-xs leading-5 text-[#78867e]">
                          Demo: you&apos;re acting as {reviewingStep.name},{" "}
                          {reviewingStep.role}.
                        </p>
                      )}
                    </div>
                  )}

                </div>
              </article>
            );
          })}
        {approvals.filter(
          (approval) => approval.status === selectedApprovalStatus
        ).length === 0 && (
          <EmptyState
            message={
              selectedApprovalStatus === "waiting"
                ? "There are no openings waiting for approval."
                : selectedApprovalStatus === "ready"
                ? "There are no openings ready to publish."
                : "There are no openings sent back for changes."
            }
          />
        )}
      </div>
    </section>
  );
}
