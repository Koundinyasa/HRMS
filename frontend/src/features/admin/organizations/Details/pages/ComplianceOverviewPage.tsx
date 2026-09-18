// import { useState } from "react";
// import { MONTH_OPTIONS } from "../constants/details.constants";
// import ComplianceTable from "../components/ComplianceTable";
// import { useComplianceOverview } from "../hooks/useComplianceOverview";

// export default function ComplianceOverviewPage() {
//   const [month, setMonth] = useState(MONTH_OPTIONS[0]);
//   const { rows, isLoading, isError } = useComplianceOverview(month);

//   return (
//     <div className="flex w-full min-w-0 flex-col">
//       <div
//         className="
//           w-full overflow-hidden rounded-2xl border border-slate-100 bg-white
//           shadow-[0_12px_24px_-8px_rgba(15,23,42,0.18)]
//         "
//       >
//         <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
//           <h2 className="text-[13px] font-bold text-slate-800">
//             Companies Summary
//           </h2>

//           <div className="flex items-center gap-2">
//             <span className="text-xs text-slate-500">Month Year</span>
//             <div className="relative">
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(e.target.value)}
//                 className="
//                   h-7 min-w-[100px] appearance-none rounded-full
//                   border border-slate-200 bg-white px-3 pr-7 text-xs
//                   text-slate-700 outline-none focus:border-blue-400
//                 "
//               >
//                 {MONTH_OPTIONS.map((m) => (
//                   <option key={m} value={m}>
//                     {m}
//                   </option>
//                 ))}
//               </select>
//               <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
//                 ▾
//               </span>
//             </div>
//           </div>
//         </div>

//         {isLoading && (
//           <div className="border-t border-slate-100 p-6 text-sm text-slate-500">
//             Loading…
//           </div>
//         )}

//         {isError && (
//           <div className="border-t border-slate-100 p-6 text-sm text-red-500">
//             Failed to load compliance overview.
//           </div>
//         )}

//         {!isLoading && !isError && rows[0] && (
//           <ComplianceTable row={rows[0]} />
//         )}

//         {!isLoading && !isError && rows.length === 0 && (
//           <div className="border-t border-slate-100 p-6 text-sm text-slate-500">
//             No compliance data.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











// import { useState } from "react";
// import { MONTH_OPTIONS } from "../constants/details.constants";
// import ComplianceTable from "../components/ComplianceTable";
// import { useComplianceOverview } from "../hooks/useComplianceOverview";

// export default function ComplianceOverviewPage() {
//   const [month, setMonth] = useState(MONTH_OPTIONS[0]);
//   const { rows, isLoading, isError } = useComplianceOverview(month);

//   return (
//     <div className="flex w-full min-w-0 flex-col">
//       <div
//         className="
//           w-full overflow-hidden rounded-2xl border border-slate-100 bg-white
//           shadow-[0_12px_24px_-8px_rgba(15,23,42,0.18)]
//         "
//       >
//         <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
//           <h2 className="text-[13px] font-bold text-slate-800">
//             Companies Summary
//           </h2>

//           <div className="flex items-center gap-2">
//             <span className="text-xs text-slate-500">Month Year</span>
//             <div className="relative">
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(e.target.value)}
//                 className="
//                   h-7 min-w-[100px] appearance-none rounded-full
//                   border border-slate-200 bg-white px-3 pr-7 text-xs
//                   text-slate-700 outline-none focus:border-blue-400
//                 "
//               >
//                 {MONTH_OPTIONS.map((m) => (
//                   <option key={m} value={m}>
//                     {m}
//                   </option>
//                 ))}
//               </select>
//               <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
//                 ▾
//               </span>
//             </div>
//           </div>
//         </div>

//         {isLoading && (
//           <div className="border-t border-slate-100 p-6 text-sm text-slate-500">
//             Loading…
//           </div>
//         )}

//         {isError && (
//           <div className="border-t border-slate-100 p-6 text-sm text-red-500">
//             Failed to load compliance overview.
//           </div>
//         )}

//         {!isLoading && !isError && rows[0] && (
//           <ComplianceTable row={rows[0]} />
//         )}

//         {!isLoading && !isError && rows.length === 0 && (
//           <div className="border-t border-slate-100 p-6 text-sm text-slate-500">
//             No compliance data.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }








import { useState } from "react";
import { MONTH_OPTIONS } from "../constants/details.constants";
import ComplianceTable from "../components/ComplianceTable";
import { useComplianceOverview } from "../hooks/useComplianceOverview";

export default function ComplianceOverviewPage() {
  const [month, setMonth] = useState(MONTH_OPTIONS[0]);

  const { rows, isLoading, isError } = useComplianceOverview(month);

  return (
    <div className="w-full min-w-0 bg-[#F4F8FE]">
      <div className="w-full px-5 pt-5">
        <div
          className="
            w-full
            overflow-hidden
            rounded-[18px]
            border border-slate-100
            bg-white
            shadow-[0_12px_24px_-8px_rgba(15,23,42,0.18)]
          "
        >
          {/* Card Header */}
          <div
            className="
              flex
              min-h-[59px]
              items-center
              justify-between
              gap-4
              px-[18px]
              py-3
            "
          >
            <h2
              className="
                whitespace-nowrap
                text-[14px]
                font-semibold
                leading-5
                text-slate-800
              "
            >
              Companies Summary
            </h2>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className="
                  whitespace-nowrap
                  text-[12px]
                  font-normal
                  text-slate-500
                "
              >
                Month Year
              </span>

              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="
                    h-8
                    min-w-[114px]
                    appearance-none
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    px-3
                    pr-7
                    text-[12px]
                    font-normal
                    text-slate-700
                    outline-none
                    transition
                    focus:border-blue-400
                    focus:ring-0
                  "
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <span
                  className="
                    pointer-events-none
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    text-[10px]
                    leading-none
                    text-slate-500
                  "
                >
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div
              className="
                border-t
                border-slate-100
                px-[18px]
                py-6
                text-[12px]
                text-slate-500
              "
            >
              Loading…
            </div>
          )}

          {/* Error */}
          {isError && (
            <div
              className="
                border-t
                border-slate-100
                px-[18px]
                py-6
                text-[12px]
                text-red-500
              "
            >
              Failed to load compliance overview.
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && rows[0] && (
            <ComplianceTable row={rows[0]} />
          )}

          {/* Empty */}
          {!isLoading && !isError && rows.length === 0 && (
            <div
              className="
                border-t
                border-slate-100
                px-[18px]
                py-6
                text-[12px]
                text-slate-500
              "
            >
              No compliance data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}