import type { ReactNode } from "react";
import { Clock3, UsersRound } from "lucide-react";
import {
  avatarColors,
  initials,
  STAGES,
} from "../constants/recruitment.constants";
import type { Candidate, CandidateStage } from "../types/recruitment.types";

export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-[#344139]">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function CandidateCard({
  candidate,
  onMove,
}: {
  candidate: Candidate;
  onMove: (stage: CandidateStage) => void;
}) {
  return (
    <article className="rounded-xl border border-[#dfe6e1] bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar
          name={candidate.name}
          color={avatarColors[candidate.id % avatarColors.length]}
        />
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold">{candidate.name}</h4>
          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#78867e]">
            {candidate.role}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className="text-sm tracking-[0.12em] text-[#e5a538]"
          aria-label={`${candidate.rating} out of 5 rating`}
        >
          {"★".repeat(candidate.rating)}
          <span className="text-[#d8ded9]">
            {"☆".repeat(5 - candidate.rating)}
          </span>
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-[#849088]">
          <Clock3 className="h-3 w-3" />
          {candidate.daysInStage === 0
            ? "New today"
            : `${candidate.daysInStage}d in stage`}
        </span>
      </div>
      {candidate.stage !== "Hired" && (
        <label className="mt-3 block">
          <span className="sr-only">
            Move {candidate.name} to another hiring stage
          </span>
          <select
            value={candidate.stage}
            onChange={(event) => onMove(event.target.value as CandidateStage)}
            className="h-8 w-full rounded-lg border border-[#edf0ed] bg-[#fafbfa] px-2 text-xs text-[#68776e] outline-none focus:border-[#537b65]"
          >
            {STAGES.map((stage) => (
              <option key={stage.name} value={stage.name}>
                Move to {stage.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </article>
  );
}

export function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6dfd8] bg-white px-6 text-center">
      <UsersRound className="mb-3 h-8 w-8 text-[#9aa79f]" />
      <p className="max-w-md text-sm text-[#718078]">{message}</p>
    </div>
  );
}
