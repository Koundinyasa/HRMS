// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import TimeOfficeFilters from "../components/TimeOfficeFilters";
// import TimeOfficeEmptyState from "../components/TimeOfficeEmptyState";
// import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";
// import {
//   ChevronLeft,
// } from "lucide-react";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { exportTimeOfficeExcel, exportTimeOfficePdf } from "../utils/timeOfficeExport";

// const DAY_WISE_SUMMARY_COLUMNS = [
//   "Emp ID",
//   "Emp Name",
//   "Present Days",
//   "Absent Days",
//   "WO",
//   "GH",
//   "Early-IN Count",
//   "Late-IN Minutes",
//   "Late-IN Count",
//   "Early-OUT Minutes",
//   "Early-OUT Count",
//   "Overstay Minutes",
//   "Overstay Count",
//   "Total Work Hrs",
//   "View",
// ];

// export default function DayWiseSummaryPage() {
//   const navigate = useNavigate();
//   const today = new Date().toISOString().split("T")[0];

//   const [fromDate, setFromDate] = useState(today);
//   const [toDate, setToDate] = useState(today);
//   const [employeeId, setEmployeeId] = useState("");
//   const [employeeName, setEmployeeName] = useState("");
//   const exportColumns = DAY_WISE_SUMMARY_COLUMNS
//     .filter((header) => header !== "View")
//     .map((header) => ({ header, key: header }));
//   const exportOptions = { title: "Day-Wise Summary", columns: exportColumns, rows: [], fromDate, toDate };

//   return (
//     <div className="min-h-screen bg-[#f3f6fa] p-2">
//       <div className="mb-3 flex h-auto flex-col gap-3 rounded-md border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm sm:h-[76px] sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-0">
//         <div className="flex items-center">
//           <h1 className="inline-block border-b-[3px] border-[#3ba5d6] pb-2 text-base font-semibold text-[#3ba5d6] sm:text-[18px]">
//             Time Office
//           </h1>
//         </div>

//         <div className="flex items-center justify-end gap-3 sm:gap-6">
//           <Button
//             variant="ghost"
//             type="button"
//             title="Filter"
//             className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-[#f3f6fa]"
//           >
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px] text-[#8b9bb5]">
//               <path d="M4 6h16" />
//               <path d="M7 12h10" />
//               <path d="M10 18h4" />
//             </svg>
//           </Button>

//           <Button
//             variant="ghost"
//             type="button"
//             title="History"
//             className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-[#f3f6fa]"
//           >
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[20px] w-[20px] text-[#8b9bb5]">
//               <path d="M3 12a9 9 0 1 0 3-6.7" />
//               <path d="M3 4v5h5" />
//               <path d="M12 7v5l3 2" />
//             </svg>
//           </Button>
//         </div>
//       </div>

//       {/* =========================
//           REPORT HEADER
//       ========================= */}
//       <div className="mb-3 flex h-[76px] items-center justify-between rounded-md border border-[#e1e4ea] bg-white px-6 shadow-sm">
//         <h1 className="border-b-[3px] border-[#3ba5d6] pb-2 text-[18px] font-semibold text-[#3ba5d6]">
//           Day-Wise Summary
//         </h1>

//         <div className="flex items-center gap-5">
//           <Button
//             variant="ghost"
//             type="button"
//             onClick={() => navigate(-1)}
//             className="h-12 rounded-md border border-[#d6d9de] bg-white px-5 text-[#555]"
//           >
//             <ChevronLeft size={18} className="mr-1" />
//             Back
//           </Button>

//           <DateField label="From Date" value={fromDate} onChange={setFromDate} className="flex items-center gap-3 text-[15px] text-[#333] [&_input]:h-12 [&_input]:w-[180px] [&_input]:rounded-md [&_input]:border-[#e1e4ea]" />
//           <DateField label="To Date" value={toDate} onChange={setToDate} className="flex items-center gap-3 text-[15px] text-[#333] [&_input]:h-12 [&_input]:w-[180px] [&_input]:rounded-md [&_input]:border-[#e1e4ea]" />

//           {/* PDF */}
//           <Button
//             variant="ghost"
//             type="button"
//             title="Export PDF"
//             onClick={() => exportTimeOfficePdf(exportOptions)}
//             className="flex h-[40px] w-[34px] items-center justify-center rounded-md bg-white p-0 text-[#ef5350] shadow-none hover:bg-[#fff3f3]"
//           >
//             <FaFilePdf className="h-7 w-7" />
//           </Button>

//           {/* Excel */}
//           <Button
//             variant="ghost"
//             type="button"
//             title="Export Excel"
//             onClick={() => exportTimeOfficeExcel(exportOptions)}
//             className="flex h-[40px] w-[34px] items-center justify-center rounded-md bg-white p-0 text-[#35a853] shadow-none hover:bg-[#f1faf3]"
//           >
//             <FaFileExcel className="h-7 w-7" />
//           </Button>
//         </div>
//       </div>

//       {/* =========================
//           FILTER TOOLBAR
//       ========================= */}
//       <TimeOfficeFilters
//         fromDate={fromDate}
//         toDate={toDate}
//         employeeId={employeeId}
//         employeeName={employeeName}
//         onFromDateChange={setFromDate}
//         onToDateChange={setToDate}
//         onEmployeeIdChange={setEmployeeId}
//         onEmployeeNameChange={setEmployeeName}
//         onSearch={() => undefined}
//         onReset={() => {
//           setFromDate(today);
//           setToDate(today);
//           setEmployeeId("");
//           setEmployeeName("");
//         }}
//         showDayWiseDropdownOptions
//       />

//       {/* =========================
//           TABLE HEADER
//       ========================= */}
//       <div className="overflow-hidden rounded-md border border-[#e2e6ea] bg-white">
//         <div className="overflow-x-auto">
//           <table className="min-w-[1200px] w-full border-collapse">
//             <thead>
//               <tr className="bg-[#cfe6f5] text-[#1f2937]">
//                 {DAY_WISE_SUMMARY_COLUMNS.map((column) => (
//                   <th
//                     key={column}
//                     className="border-r border-[#d3e5f2] px-2 py-3 text-center text-[14px] font-semibold leading-5"
//                   >
//                     {column}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td colSpan={DAY_WISE_SUMMARY_COLUMNS.length} className="bg-[#f5f6fa] p-0">
//                   <TimeOfficeEmptyState message="No attendance records found." />
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Button } from "@/components/ui/button";
import {
  ClockFading,
  Funnel,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeEmptyState from "../components/TimeOfficeEmptyState";

const DAY_WISE_SUMMARY_COLUMNS = [
  "Emp ID",
  "Emp Name",
  "Present Days",
  "Absent Days",
  "WO",
  "GH",
  "Early-IN Count",
  "Late-IN Minutes",
  "Late-IN Count",
  "Early-OUT Minutes",
  "Early-OUT Count",
  "Overstay Minutes",
  "Overstay Count",
  "Total Work Hrs",
  "View",
];

export default function DayWiseSummaryPage() {
  const navigate = useNavigate();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  /* =========================================================
     DATE / FILTER STATE
  ========================================================= */

  const [fromDate, setFromDate] =
    useState(today);

  const [toDate, setToDate] =
    useState(today);

  const [employeeId, setEmployeeId] =
    useState("");

  const [employeeName, setEmployeeName] =
    useState("");

  const [showFilterBar, setShowFilterBar] =
    useState(true);

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    setFromDate(today);
    setToDate(today);
    setEmployeeId("");
    setEmployeeName("");
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = () => {
    // Keep existing API/search functionality here.
    // No mock data is added.
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] p-2 font-[Urbanist]">

      {/* =====================================================
          TIME OFFICE MODULE HEADER
      ===================================================== */}

      <div className="mb-3 w-full overflow-hidden rounded-[14px] border border-[#df8f7b] bg-[#fff8f6]">
        <div className="flex min-h-[72px] items-center justify-between px-5">

          {/* =================================================
              TIME OFFICE TITLE
          ================================================= */}

          <div className="flex h-[40px] shrink-0 items-center rounded-[8px] border border-[#df8f7b] bg-white px-5">
            <h1 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-none text-[#9a5547]">
              Time Office
            </h1>
          </div>

          {/* =================================================
              RIGHT SIDE ICONS
          ================================================= */}

          <div className="flex shrink-0 items-center gap-2">

            {/* Filter */}
            <Button
              type="button"
              variant="ghost"
              title="Filter"
              className="flex h-[32px] w-[32px] items-center justify-center rounded-md p-0 text-[#3f3f3f] shadow-none hover:bg-[#fff0eb]"
            >
              <Funnel
                size={20}
                strokeWidth={2}
              />
            </Button>

            {/* Clock Fading */}
            <Button
              type="button"
              variant="ghost"
              title="History"
              className="flex h-[32px] w-[32px] items-center justify-center rounded-md p-0 text-[#3f3f3f] shadow-none hover:bg-[#fff0eb]"
            >
              <ClockFading
                size={20}
                strokeWidth={2}
              />
            </Button>

          </div>
        </div>
      </div>

      {/* =====================================================
          DAY-WISE SUMMARY REPORT HEADER
      ===================================================== */}

      <TimeOfficeReportHeader
        title="Day-Wise Summary"
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onBack={() => navigate(-1)}
        showTimeOfficeBanner={false}
        showDateRange
        showCategories
        showPdfExport
        showExcelExport
        showMonthDropdown={false}
        showGraceTypes={false}
        columns={DAY_WISE_SUMMARY_COLUMNS}
        rows={[]}
      />

      {/* =====================================================
          FILTER TOOLBAR
      ===================================================== */}

      <TimeOfficeFilters
        fromDate={fromDate}
        toDate={toDate}
        employeeId={employeeId}
        employeeName={employeeName}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onEmployeeIdChange={setEmployeeId}
        onEmployeeNameChange={setEmployeeName}
        onSearch={handleSearch}
        onReset={handleReset}
        onHideFilters={() =>
          setShowFilterBar(false)
        }
        showFilters={showFilterBar}
        showDayWiseDropdownOptions
      />

      {/* =====================================================
          REPORT TABLE
      ===================================================== */}

      <div className="mt-8 w-full overflow-hidden rounded-[14px] border border-[#d5d9df] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.18)]">

        <div className="w-full overflow-hidden">

          <table className="w-full table-fixed border-collapse">

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead>
              <tr className="border-b border-[#eaded9] bg-[#fff5f2] text-[#7f4b3d]">

                {DAY_WISE_SUMMARY_COLUMNS.map(
                  (column) => (
                    <th
                      key={column}
                      className={`
                        border-r
                        border-[#f0e3df]
                        px-2
                        py-3
                        text-center
                        font-[Urbanist]
                        text-[13px]
                        font-semibold
                        leading-[18px]
                        text-[#7f4b3d]
                      `}
                    >
                      {column}
                    </th>
                  )
                )}

              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>

              <tr>

                <td
                  colSpan={
                    DAY_WISE_SUMMARY_COLUMNS.length
                  }
                  className="bg-[#f5f6fa] p-0"
                >
                  <TimeOfficeEmptyState
                    message="No attendance records found."
                  />
                </td>

              </tr>

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}