import { CheckCircle2 } from "lucide-react";

const teamTasks: string[] = [
  "Welcome Mail",
  "Candidate Portal",
  "Asset Issue",
  "Training Request",
  "Intimation Mail",
];

const candidateTasks: string[] = [
  "Welcome Mail",
  "Candidate Portal",
];

function CompletedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold text-white">
      <CheckCircle2 size={12} strokeWidth={2.5} />
      Completed
    </span>
  );
}

function TaskTable({
  title,
  tasks,
}: {
  title: string;
  tasks: string[];
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-sky-50 px-4 py-2.5">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      </div>

      <div className="grid grid-cols-[1fr_110px] border-b border-slate-200 px-4 py-2.5">
        <span className="text-xs font-semibold text-slate-700">Activity</span>
        <span className="text-right text-xs font-semibold text-slate-700">Status</span>
      </div>

      {tasks.map((task) => (
        <div
          key={task}
          className="grid min-h-[42px] grid-cols-[1fr_110px] items-center border-b border-slate-200 px-4 last:border-b-0"
        >
          <span className="text-xs text-slate-700">{task}</span>

          <div className="flex justify-end">
            <CompletedBadge />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CandidateTasksPage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TaskTable title="Team Tasks" tasks={teamTasks} />
      <TaskTable title="Candidate Task" tasks={candidateTasks} />
    </div>
  );
}
