// // import { NavLink, Outlet, useParams } from "react-router-dom";
// // import type { CompletedCandidateRow } from "../../types/completed-candidate.types";

// // interface CandidateDetailsTabsProps {
// //   candidate: CompletedCandidateRow;
// // }

// // const tabs = [
// //   { label: "Candidate Tasks", path: "tasks" },
// //   { label: "Candidate Portal Info", path: "portal-info" },
// //   { label: "Candidate Forms", path: "forms" },
// // ];

// // export default function CandidateDetailsTabs({ candidate }: CandidateDetailsTabsProps) {
// //   return (
// //     <div className="space-y-4 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
// //       <div className="overflow-x-auto pb-4">
// //         <div className="flex min-w-max gap-3 rounded-3xl bg-slate-50 p-2">
// //           {tabs.map((tab) => (
// //             <NavLink
// //               key={tab.path}
// //               to={tab.path}
// //               className={({ isActive }) =>
// //                 `px-4 py-3 text-sm font-semibold transition ${
// //                   isActive
// //                     ? "text-slate-900 border-b-2 border-sky-600"
// //                     : "text-slate-600 hover:text-slate-900"
// //                 }`
// //               }
// //             >
// //               {tab.label}
// //             </NavLink>
// //           ))}
// //         </div>
// //       </div>
// //       <div className="min-h-[520px]">
// //         <Outlet />
// //       </div>
// //     </div>
// //   );
// // }



// import { NavLink, Outlet } from "react-router-dom";
// import type { CompletedCandidateRow } from "../../types/completed-candidate.types";

// interface CandidateDetailsTabsProps {
//   candidate: CompletedCandidateRow;
// }

// const tabs = [
//   { label: "Candidate Tasks", path: "tasks" },
//   { label: "Candidate Portal Info", path: "portal-info" },
//   { label: "Candidate Forms", path: "forms" },
//   { label: "Activities Completed", path: "activities-completed" },
//   { label: "Offboard Candidate", path: "offboard-candidate" },
// ];

// export default function CandidateDetailsTabs({
//   candidate,
// }: CandidateDetailsTabsProps) {
//   return (
//     <div className="space-y-4 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">

//       {/* Secondary Navigation Tabs */}
//       <div className="w-full">
//         <div className="flex w-full flex-wrap items-center gap-2">
//           {tabs.map((tab) => (
//             <NavLink
//               key={tab.path}
//               to={tab.path}
//               className={({ isActive }) =>
//                 `inline-flex h-9 shrink-0 items-center rounded-lg border px-3.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
//                   isActive
//                     ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200"
//                     : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
//                 }`
//               }
//             >
//               {tab.label}
//             </NavLink>
//           ))}
//         </div>
//       </div>

//       {/* Page Content */}
//       <div className="min-h-[520px]">
//         <Outlet />
//       </div>

//     </div>
//   );
// }

import { NavLink, Outlet } from "react-router-dom";
import type { CompletedCandidateRow } from "../../types/preEnrollment.types";

interface CandidateDetailsTabsProps {
  candidate: CompletedCandidateRow;
}

const tabs = [
  { label: "Candidate Tasks", path: "tasks" },
  { label: "Candidate Portal Info", path: "portal-info" },
  { label: "Candidate Forms", path: "forms" },
  { label: "Activities Completed", path: "activities-completed" },
  { label: "Offboard Candidate", path: "offboard-candidate" },
];

export default function CandidateDetailsTabs({
  candidate,
}: CandidateDetailsTabsProps) {
  return (
    <div className="w-full">

      {/* Secondary Tabs */}
      <div className="flex w-full flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `inline-flex h-8 shrink-0 items-center rounded-lg border px-3 text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Page Content */}
      <div className="mt-4 min-h-[520px]">
        <Outlet />
      </div>

    </div>
  );
}
