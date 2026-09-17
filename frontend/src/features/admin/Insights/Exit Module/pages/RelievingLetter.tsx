// import { useState } from "react";
// import { X } from "lucide-react";

// import ReportViewShell from "../components/ReportViewShell";
// import ExitReportTable from "../components/ExitReportTable";
// import LetterPreview from "../components/LetterPreview";

// import { useExitFilters } from "../hooks/useExitFilters";
// import { useExitReports } from "../hooks/useExitReports";

// import type { ExitEmployee } from "../types/exitReport.types";

// export default function RelievingLetter() {
//   const filters = useExitFilters();
//   const { employees, isLoading } = useExitReports(filters.filters);
//   const [activeEmployee, setActiveEmployee] = useState<ExitEmployee | null>(null);

//   return (
//     <>
//       <ReportViewShell
//         reportType="relieving-letter"
//         title="Relieving Letter"
//         isLoading={isLoading}
//         isEmpty={employees.length === 0}
//         filters={filters}
//       >
//         <ExitReportTable employees={employees} onView={setActiveEmployee} />
//       </ReportViewShell>

//       {activeEmployee && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white">
//             <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 print:hidden">
//               <h2 className="text-sm font-semibold text-gray-900">
//                 {activeEmployee.employeeName} &mdash; Relieving Letter
//               </h2>

//               <button
//                 type="button"
//                 onClick={() => setActiveEmployee(null)}
//                 className="text-gray-400 hover:text-gray-700"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <LetterPreview />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useState } from "react";
import { X } from "lucide-react";

import ReportViewShell from "../components/ReportViewShell";
import ExitReportTable from "../components/ExitReportTable";
import LetterPreview from "../components/LetterPreview";

import { useExitFilters } from "../hooks/useExitFilters";
import { useExitReports } from "../hooks/useExitReports";

import type { ExitEmployee } from "../types/exitReport.types";

export default function RelievingLetter() {
  const filters = useExitFilters();
  const { employees, isLoading } = useExitReports(filters.filters);
  const [activeEmployee, setActiveEmployee] = useState<ExitEmployee | null>(null);

  return (
    <>
      <ReportViewShell
        reportType="relieving-letter"
        title="Relieving Letter"
        description="Generate and access standard Relieving Letters for employees."
        isLoading={isLoading}
        isEmpty={employees.length === 0}
        filters={filters}
      >
        <ExitReportTable employees={employees} onView={setActiveEmployee} />
      </ReportViewShell>

      {activeEmployee && (
        // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-2 sm:p-4">
          {/* <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white"> */}
          <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white sm:max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 print:hidden">
              <h2 className="text-sm font-semibold text-gray-900">
                {activeEmployee.employeeName} &mdash; Relieving Letter
              </h2>

              <button
                type="button"
                onClick={() => setActiveEmployee(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <LetterPreview />
          </div>
        </div>
      )}
    </>
  );
}