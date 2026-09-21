// import { useNavigate } from "react-router-dom";
// import { ChevronRight, Clock3, FileText, Funnel, Percent } from "lucide-react";

// import { TDS_REPORT_GROUPS } from "../constants/tdsReport.constants";

// export default function TDSReportPage() {
//   const navigate = useNavigate();

//   return (
//     <main className="min-h-full bg-white p-4 sm:p-5">
//       <header className="mb-6 flex h-[53px] items-center justify-between rounded-xl border border-[#c98f82] bg-[#fff5f2] px-4 shadow-sm">
//         <div className="flex h-[34px] w-[176px] items-center justify-center gap-2 rounded-lg border border-[#c98f82] bg-white text-[12px] font-semibold text-[#9d6155] shadow-sm">
//           <Percent size={15} strokeWidth={1.8} />
//           <span>TDS Report</span>
//         </div>

//         <div className="flex items-center gap-1 text-[#737373]">
//           <button
//             type="button"
//             aria-label="Report history"
//             className="grid h-6 w-6 place-items-center rounded hover:bg-[#f7e7e2]"
//           >
//             <Clock3 size={17} strokeWidth={2} />
//           </button>
//           <button
//             type="button"
//             aria-label="Filter reports"
//             className="grid h-6 w-6 place-items-center rounded hover:bg-[#f7e7e2]"
//           >
//             <Funnel size={16} strokeWidth={2} />
//           </button>
//         </div>
//       </header>

//       <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
//         {TDS_REPORT_GROUPS.map((group) => (
//           <section
//             key={group.title}
//             className="min-h-[282px] overflow-hidden rounded-xl border border-[#bfc1c4] bg-white shadow-sm"
//           >
//             <div className="flex h-10 items-center gap-2 border-b border-[#e5e5e5] bg-[#f5f7f9] px-4">
//               <FileText size={17} strokeWidth={1.8} className="text-[#ae7c70]" />
//               <h2 className="text-[13px] font-semibold leading-4 text-[#9d6155]">
//                 {group.title}
//               </h2>
//             </div>
//             <div className="px-2 py-2">
//               {group.reports.map((report) => (
//                 <button
//                   key={report.path}
//                   type="button"
//                   onClick={() => navigate(report.path)}
//                   className="flex w-full items-center justify-between gap-2 rounded px-1 py-1.5 text-left text-[12px] font-medium leading-4 text-[#555] transition-colors hover:bg-[#fff4f1] hover:text-[#9d6155]"
//                 >
//                   {report.label}
//                   <ChevronRight size={16} strokeWidth={2.5} className="shrink-0" />
//                 </button>
//               ))}
//             </div>
//           </section>
//         ))}
//       </div>
//     </main>
//   );
// }


import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Clock3,
  FileText,
  Funnel,
  Percent,
} from "lucide-react";

import { TDS_REPORT_GROUPS } from "../constants/tdsReport.constants";

export default function TDSReportPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-full bg-white p-4 sm:p-5">
      <header className="mb-6 flex h-[53px] items-center justify-between rounded-xl border border-[#c98f82] bg-[#fff5f2] px-4 shadow-sm">
        <div className="flex h-[34px] w-[176px] items-center justify-center gap-2 rounded-lg border border-[#c98f82] bg-white font-[Urbanist] text-[22px] font-extrabold text-[#9d6155] shadow-sm">
          <Percent size={15} strokeWidth={1.8} />

          {/* Display/SM — Urbanist ExtraBold — 22px */}
          <span className="font-[Urbanist] text-[22px] font-extrabold">
            TDS Report
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#737373]">
          {/* Utility/UI */}
          <button
            type="button"
            aria-label="Report history"
            className="grid h-6 w-6 place-items-center rounded hover:bg-[#f7e7e2]"
          >
            <Clock3 size={17} strokeWidth={2} />
          </button>

          {/* Utility/UI */}
          <button
            type="button"
            aria-label="Filter reports"
            className="grid h-6 w-6 place-items-center rounded hover:bg-[#f7e7e2]"
          >
            <Funnel size={16} strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {TDS_REPORT_GROUPS.map((group) => (
          <section
            key={group.title}
            className="min-h-[282px] overflow-hidden rounded-xl border border-[#bfc1c4] bg-white shadow-sm"
          >
            <div className="flex h-10 items-center gap-2 border-b border-[#e5e5e5] bg-[#f5f7f9] px-4">
              <FileText
                size={17}
                strokeWidth={1.8}
                className="text-[#ae7c70]"
              />

              {/* Heading */}
              <h2 className="font-[Urbanist] text-[18px] font-bold leading-5 text-[#9d6155]">
                {group.title}
              </h2>
            </div>

            <div className="px-2 py-2">
              {group.reports.map((report) => (
                <button
                  key={report.path}
                  type="button"
                  onClick={() => navigate(report.path)}
                  className="flex w-full items-center justify-between gap-2 rounded px-1 py-1.5 text-left font-[Urbanist] text-[13px] font-normal leading-4 text-[#555] transition-colors hover:bg-[#fff4f1] hover:text-[#9d6155]"
                >
                  {/* Body */}
                  <span className="font-[Urbanist] text-[13px] font-normal">
                    {report.label}
                  </span>

                  {/* Utility/UI */}
                  <ChevronRight
                    size={16}
                    strokeWidth={2.5}
                    className="shrink-0"
                  />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}