import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { STAGES } from "../constants/recruitment.constants";
import { CandidateCard, EmptyState } from "./RecruitmentShared";
import type {
  Candidate,
  CandidateStage,
  JobOpening,
} from "../types/recruitment.types";
interface RecruitmentDashboardProps {
  filteredCandidates: Candidate[];
  openings: JobOpening[];
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  updateCandidateStage: (candidateId: number, stage: CandidateStage) => void;
}

export function RecruitmentDashboard({
  filteredCandidates,
  openings,
  selectedRole,
  setSelectedRole,
  updateCandidateStage,
}: RecruitmentDashboardProps) {
  // null = nothing selected -> show every stage
  const [selectedStage, setSelectedStage] = useState<CandidateStage | null>(
    null
  );

  const toggleStage = (stageName: CandidateStage) =>
    setSelectedStage((current) => (current === stageName ? null : stageName));

  const activeStage = STAGES.find((stage) => stage.name === selectedStage);
  const activeStageCandidates = activeStage
    ? filteredCandidates.filter(
        (candidate) => candidate.stage === activeStage.name
      )
    : [];

  return (
    <>
      <section className="rounded-2xl border border-[#e0e7e2] bg-white p-5 sm:p-7">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Hiring funnel</h2>
            <p className="mt-1 text-sm text-[#78867e]">
              Candidate progress across your hiring stages. Select a stage to
              see only its candidates.
            </p>
          </div>
          <label className="relative">
            <span className="sr-only">Filter hiring funnel by role</span>
            <select
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
              className="h-11 min-w-[190px] appearance-none rounded-xl border border-[#dce4de] bg-[#f7f9f7] py-2 pl-4 pr-10 text-sm outline-none focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20"
            >
              <option>All open roles</option>
              {openings
                .filter((opening) => opening.status === "Open")
                .map((opening) => (
                  <option key={opening.id}>{opening.title}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68776e]" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2">
          {STAGES.map((stage, index) => {
            const count = filteredCandidates.filter(
              (candidate) => candidate.stage === stage.name
            ).length;
            const previousCount =
              index === 0
                ? count
                : filteredCandidates.filter(
                    (candidate) => candidate.stage === STAGES[index - 1].name
                  ).length;
            const conversion =
              index === 0 || previousCount === 0
                ? null
                : Math.round((count / previousCount) * 100);
            const isSelected = selectedStage === stage.name;
            const isDimmed = selectedStage !== null && !isSelected;

            return (
              <button
                key={stage.name}
                type="button"
                onClick={() => toggleStage(stage.name)}
                aria-pressed={isSelected}
                aria-label={`${stage.name}: ${count} candidate${
                  count === 1 ? "" : "s"
                }. ${isSelected ? "Click to show all stages" : "Click to show only this stage"}`}
                className={`min-w-0 rounded-xl p-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a538] ${
                  isSelected ? "bg-[#f3f6f3]" : "hover:bg-[#f7f9f7]"
                } ${isDimmed ? "opacity-60 hover:opacity-100" : ""}`}
                style={
                  isSelected
                    ? { boxShadow: `inset 0 0 0 2px ${stage.color}` }
                    : undefined
                }
              >
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <span className="text-3xl font-bold">{count}</span>
                  {conversion !== null && (
                    <span className="text-xs text-[#7b8981]">
                      {conversion}% from previous
                    </span>
                  )}
                </div>
                <div className="flex h-20 items-end border-b border-[#e4e9e5]">
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${Math.max(
                        18,
                        count === 0
                          ? 7
                          : (count / Math.max(filteredCandidates.length, 1)) *
                              100
                      )}%`,
                      backgroundColor: stage.color,
                    }}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold">{stage.name}</p>
                <p className="mt-0.5 text-xs text-[#7b8981]">
                  {index === 0
                    ? "Total applications"
                    : `${count} candidate${count === 1 ? "" : "s"}`}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Candidate pipeline">
        {filteredCandidates.length === 0 ? (
          <EmptyState message="No candidates match your search and role filter." />
        ) : activeStage ? (
          // ---- A stage is selected: show only that stage's candidates ----
          <div className="rounded-2xl bg-[#edf1ed] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <span className={`h-2.5 w-2.5 rounded-full ${activeStage.dot}`} />
                {activeStage.name}
                <span className="font-semibold text-[#718078]">
                  {activeStageCandidates.length}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedStage(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4ddd6] bg-white px-3 py-1.5 text-xs font-semibold text-[#52625a] transition hover:bg-[#f7f9f7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a538]"
              >
                <X className="h-3.5 w-3.5" />
                Show all stages
              </button>
            </div>

            {activeStageCandidates.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#d4ddd6] px-3 py-8 text-center text-xs text-[#85928a]">
                No candidates in this stage
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {activeStageCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onMove={(nextStage) =>
                      updateCandidateStage(candidate.id, nextStage)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // ---- Nothing selected: show every stage ----
          <div className="flex gap-4 overflow-x-auto pb-3">
            {STAGES.map((stage) => {
              const stageCandidates = filteredCandidates.filter(
                (candidate) => candidate.stage === stage.name
              );
              return (
                <div
                  key={stage.name}
                  className="w-[270px] min-h-[250px] shrink-0 rounded-2xl bg-[#edf1ed] p-3.5 sm:w-[290px]"
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="flex items-center gap-2 text-sm font-bold">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${stage.dot}`}
                      />
                      {stage.name}
                    </h3>
                    <span className="text-sm font-semibold text-[#718078]">
                      {stageCandidates.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {stageCandidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onMove={(nextStage) =>
                          updateCandidateStage(candidate.id, nextStage)
                        }
                      />
                    ))}
                    {stageCandidates.length === 0 && (
                      <p className="rounded-xl border border-dashed border-[#d4ddd6] px-3 py-5 text-center text-xs text-[#85928a]">
                        No candidates in this stage
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
