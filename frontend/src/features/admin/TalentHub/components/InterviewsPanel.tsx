import type { Dispatch, SetStateAction } from "react";
import {
  FEEDBACK_TASKS,
  INTERVIEWS,
  avatarColors,
  initials,
} from "../constants/recruitment.constants";
import { EmptyState } from "./RecruitmentShared";

interface InterviewsPanelProps {
  search: string;
  completedFeedbackTasks: number[];
  setCompletedFeedbackTasks: Dispatch<SetStateAction<number[]>>;
}

export function InterviewsPanel({
  search,
  completedFeedbackTasks,
  setCompletedFeedbackTasks,
}: InterviewsPanelProps) {
  return (
    <section className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,2.15fr)_minmax(300px,0.85fr)]">
      <div>
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
              interview.round.toLowerCase().includes(normalizedSearch)
            );
          }).map((interview) => (
            <article
              key={interview.name}
              className="grid min-h-20 grid-cols-[84px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#dfe6e1] px-4 py-4 last:border-b-0 sm:grid-cols-[100px_minmax(0,1fr)_auto] sm:px-6"
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
              <div
                className="flex -space-x-2"
                aria-label={`Interviewers: ${interview.interviewers.join(
                  ", "
                )}`}
              >
                {interview.interviewers.map((interviewer, index) => (
                  <span
                    key={interviewer}
                    title={interviewer}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white"
                    style={{
                      backgroundColor:
                        avatarColors[
                          (index + interview.name.length) % avatarColors.length
                        ],
                    }}
                  >
                    {initials(interviewer)}
                  </span>
                ))}
              </div>
            </article>
          ))}
          {INTERVIEWS.filter((interview) => {
            const normalizedSearch = search.trim().toLowerCase();
            return (
              !normalizedSearch ||
              interview.name.toLowerCase().includes(normalizedSearch) ||
              interview.round.toLowerCase().includes(normalizedSearch)
            );
          }).length === 0 && (
            <EmptyState message="No interviews match your search." />
          )}
        </div>
      </div>

      <aside className="rounded-2xl border border-[#dfe6e1] bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-[#28332d]">Feedback due</h2>
        <ul>
          {FEEDBACK_TASKS.map((task, index) => {
            const isComplete = completedFeedbackTasks.includes(index);
            return (
              <li
                key={task}
                className="border-b border-[#dfe6e1] py-3 last:border-b-0"
              >
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#344139]">
                  <input
                    type="checkbox"
                    checked={isComplete}
                    onChange={() =>
                      setCompletedFeedbackTasks((previous) =>
                        isComplete
                          ? previous.filter((taskIndex) => taskIndex !== index)
                          : [...previous, index]
                      )
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-[#38634a]"
                  />
                  <span
                    className={isComplete ? "text-[#87938c] line-through" : ""}
                  >
                    {task}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </aside>
    </section>
  );
}
