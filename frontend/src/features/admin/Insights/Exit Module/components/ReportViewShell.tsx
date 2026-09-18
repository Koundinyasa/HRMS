// import { useState, type ReactNode } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { ChevronLeft, History } from "lucide-react";

// import ExitModuleNavbar from "./ExitModuleNavbar";
// import FilterBar from "./FilterBar";
// import AuditLogModal from "./AuditLogModal";
// import EmptyState from "./EmptyState";

// import { useExitFilters } from "../hooks/useExitFilters";

// import type { ExitReportKind } from "../types/exitReport.types";
// // (useExitFilters imported above as a value so `typeof useExitFilters` below can be used)

// type ReportViewShellProps = {
//   reportType: ExitReportKind;
//   title: string;
//   emptyMessage?: string;
//   isLoading: boolean;
//   isEmpty: boolean;
//   children: ReactNode;
//   filters: ReturnType<typeof useExitFilters>;
// };

// export default function ReportViewShell({
//   reportType,
//   title,
//   emptyMessage = "No Data Found in - Exit module report",
//   isLoading,
//   isEmpty,
//   children,
//   filters,
// }: ReportViewShellProps) {
//   const navigate = useNavigate();
//   const { domain } = useParams();
//   const [auditLogOpen, setAuditLogOpen] = useState(false);

//   return (
//     <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6">
//       <div className="mx-auto w-full max-w-[1600px]">
//         <ExitModuleNavbar />

//         <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
//           {/* Tab row */}
//           <div className="flex items-center justify-between px-5 py-3">
//             <span className="border-b-2 border-[#2F6FED] pb-2 text-sm font-semibold text-[#2F6FED]">
//               {title}
//             </span>

//             <div className="flex items-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => navigate(`/${domain}/admin/insights/exit-module`)}
//                 className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 <ChevronLeft size={15} />
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setAuditLogOpen(true)}
//                 title="Audit Log"
//                 className="text-gray-400 hover:text-gray-700"
//               >
//                 <History size={18} />
//               </button>
//             </div>
//           </div>

//           <FilterBar filters={filters} onOpenAuditLog={() => setAuditLogOpen(true)} />

//           {/* Content */}
//           <div className="min-h-[260px]">
//             {isLoading ? (
//               <div className="space-y-3 p-4">
//                 {Array.from({ length: 6 }).map((_, index) => (
//                   <div
//                     key={index}
//                     className="h-11 w-full animate-pulse rounded-md bg-gray-100"
//                   />
//                 ))}
//               </div>
//             ) : isEmpty ? (
//               <EmptyState message={emptyMessage} />
//             ) : (
//               children
//             )}
//           </div>
//         </div>
//       </div>

//       <AuditLogModal
//         reportType={reportType}
//         open={auditLogOpen}
//         onClose={() => setAuditLogOpen(false)}
//       />
//     </div>
//   );
// }


import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, FileText, SquareArrowOutUpRight } from "lucide-react";

import ExitModuleNavbar from "./ExitModuleNavbar";
import FilterBar from "./FilterBar";
import AuditLogModal from "./AuditLogModal";
import EmptyState from "./EmptyState";

import { useExitFilters } from "../hooks/useExitFilters";

import type { ExitReportKind } from "../types/exitReport.types";
// (useExitFilters imported above as a value so `typeof useExitFilters` below can be used)

type ReportViewShellProps = {
  reportType: ExitReportKind;
  title: string;
  description?: string;
  emptyMessage?: string;
  isLoading: boolean;
  isEmpty: boolean;
  children: ReactNode;
  filters: ReturnType<typeof useExitFilters>;
};

export default function ReportViewShell({
  reportType,
  title,
  description,
  emptyMessage = "No data found in Exit Module reoort",
  isLoading,
  isEmpty,
  children,
  filters,
}: ReportViewShellProps) {
  const navigate = useNavigate();
  const { domain } = useParams();
  const [auditLogOpen, setAuditLogOpen] = useState(false);
  const base = `/${domain}/admin/insights/exit-module`;

  return (
    // <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6"> CHANGED
      <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <ExitModuleNavbar />

        {/* Exit Module Report CTA */}
        {reportType !== "exit-report" && (
          <div className="mb-4 w-full rounded-xl border border-[#E9C9BC] bg-[#FEF3EF] p-3">
            <Link
              to={`${base}/report`}
              className="inline-flex items-center gap-2 rounded-lg border border-[#C7AFA9] bg-white px-4 py-2 text-sm font-semibold text-[#8B4A3C] shadow-sm transition-colors hover:bg-[#FEF3EF]"
            >
              <SquareArrowOutUpRight className="h-4 w-4" strokeWidth={2} />
              Exit Module Report
            </Link>
          </div>
        )}

        {/* Header row */}
        {/* <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-sm"> */}
        {/* CHANGED */}
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white px-3 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E9C9BC] bg-[#FEF3EF] text-[#8B4A3C]">
              <FileText className="h-4 w-4" strokeWidth={2} />
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
              {description && (
                <p className="mt-0.5 truncate text-xs text-gray-500">{description}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/${domain}/admin/insights/exit-module`)}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft size={15} />
            Back
          </button>
        </div>

        {/* Filters + content */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <FilterBar filters={filters} onOpenAuditLog={() => setAuditLogOpen(true)} />

          <div className="min-h-[260px]">
            {isLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-11 w-full animate-pulse rounded-md bg-gray-100"
                  />
                ))}
              </div>
            ) : isEmpty ? (
              <EmptyState message={emptyMessage} />
            ) : (
              children
            )}
          </div>
        </div>
      </div>

      <AuditLogModal
        reportType={reportType}
        open={auditLogOpen}
        onClose={() => setAuditLogOpen(false)}
      />
    </div>
  );
}