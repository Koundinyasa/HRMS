// import CandidateBadge from "./CandidateBadge";
// import type { CandidateTaskItem } from "../../types/preEnrollment.types";

// interface CandidateTaskListProps {
//   title: string;
//   tasks: CandidateTaskItem[];
// }

// export default function CandidateTaskList({
//   title,
//   tasks,
// }: CandidateTaskListProps) {
//   return (
//     <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:rounded-[30px] sm:p-5">
//       {/* Header */}
//       <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
//         <h3 className="min-w-0 truncate text-sm font-semibold text-slate-900 sm:text-base">
//           {title}
//         </h3>

//         <span className="shrink-0 text-xs font-medium text-slate-500 sm:text-sm">
//           Status
//         </span>
//       </div>

//       {/* Tasks */}
//       <div className="space-y-2 sm:space-y-3">
//         {tasks.map((task) => (
//           <div
//             key={task.id}
//             className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 sm:rounded-3xl sm:px-4"
//           >
//             <div className="min-w-0 flex-1">
//               <p className="break-words text-xs font-medium text-slate-800 sm:text-sm">
//                 {task.activity}
//               </p>
//             </div>

//             <div className="shrink-0">
//               <CandidateBadge status={task.status} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import CandidateBadge from "./CandidateBadge";
import type { CandidateTaskItem } from "../../types/preEnrollment.types";

interface CandidateTaskListProps {
  title: string;
  tasks: CandidateTaskItem[];
}

export default function CandidateTaskList({
  title,
  tasks,
}: CandidateTaskListProps) {
  return (
    <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm font-urbanist sm:rounded-[30px] sm:p-5">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
        {/* Heading */}
        <h3 className="min-w-0 truncate font-urbanist text-base font-semibold leading-6 text-slate-900">
          {title}
        </h3>

        {/* Utility / UI */}
        <span className="shrink-0 font-urbanist text-sm font-semibold leading-5 text-slate-500">
          Status
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-2 sm:space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 sm:rounded-3xl sm:px-4"
          >
            <div className="min-w-0 flex-1">
              {/* Body */}
              <p className="break-words font-urbanist text-sm font-medium leading-5 text-slate-800">
                {task.activity}
              </p>
            </div>

            {/* Utility / UI */}
            <div className="shrink-0">
              <CandidateBadge status={task.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}