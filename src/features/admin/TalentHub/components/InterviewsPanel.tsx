import { INTERVIEWS } from "../constants/recruitment.constants";
import { EmptyState } from "./RecruitmentShared";

interface InterviewsPanelProps {
  search: string;
}

export function InterviewsPanel({ search }: InterviewsPanelProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">
        Today,{" "}
        {new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "long",
        }).format(new Date())}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-[#dfe6e1] bg-white">
        {INTERVIEWS.filter((interview) => {
          const normalizedSearch = search.trim().toLowerCase();
          return (
            !normalizedSearch ||
            interview.name.toLowerCase().includes(normalizedSearch) ||
            interview.round.toLowerCase().includes(normalizedSearch) ||
            interview.interviewers.some((interviewer) =>
              interviewer.toLowerCase().includes(normalizedSearch),
            )
          );
        }).map((interview) => (
          <article
            key={interview.name}
            className="grid min-h-20 grid-cols-[84px_minmax(0,1fr)_minmax(150px,0.8fr)] items-center gap-3 border-b border-[#dfe6e1] px-4 py-4 last:border-b-0 sm:grid-cols-[100px_minmax(0,1fr)_minmax(220px,0.8fr)] sm:px-6"
          >
            <time className="text-sm font-bold text-[#26332c]">
              {interview.time}
            </time>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-[#28332d]">
                {interview.name}
              </h3>
              <p className="mt-0.5 truncate text-sm text-[#78867e]">
                {interview.round} · {interview.duration}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                Assigned interviewer
              </p>
              <p className="mt-1 text-sm text-[#55635a]">
                {interview.interviewers.join(", ")}
              </p>
            </div>
          </article>
        ))}
        {INTERVIEWS.filter((interview) => {
          const normalizedSearch = search.trim().toLowerCase();
          return (
            !normalizedSearch ||
            interview.name.toLowerCase().includes(normalizedSearch) ||
            interview.round.toLowerCase().includes(normalizedSearch) ||
            interview.interviewers.some((interviewer) =>
              interviewer.toLowerCase().includes(normalizedSearch),
            )
          );
        }).length === 0 && (
          <EmptyState message="No interviews match your search." />
        )}
      </div>
    </section>
  );
}
