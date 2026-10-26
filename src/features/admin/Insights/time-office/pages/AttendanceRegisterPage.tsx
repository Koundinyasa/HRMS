// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
// import TimeOfficeFilters from "../components/TimeOfficeFilters";
// import TimeOfficeTable from "../components/TimeOfficeTable";
// import TimeOfficePagination from "../components/TimeOfficePagination";

// import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
// import { validateDateRange } from "../validations/timeOffice.validation";

// const getTodayDate = (): string => {
//   const today = new Date();

//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// const COLUMNS = ["Emp Id", "Emp Name"];

// export default function AttendanceRegisterPage() {
//   const navigate = useNavigate();

//   const today = getTodayDate();

//   const {
//     filters,
//     updateFilter,
//     resetFilters,
//   } = useTimeOfficeFilters();

//   const [rows] = useState<Record<string, unknown>[]>([]);
//   const [loading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);

//   const handleSearch = () => {
//     const validation = validateDateRange(
//       filters.fromDate || today,
//       filters.toDate || today
//     );

//     if (!validation.isValid) {
//       alert(validation.message);
//       return;
//     }

//     setCurrentPage(1);
//   };

//   const handleReset = () => {
//     resetFilters();
//     setCurrentPage(1);
//   };

//   return (
//     <div className="min-h-full bg-[#f3f6fa] p-2 font-[Urbanist]">

//       {/* =====================================================
//           TIME OFFICE + ATTENDANCE REGISTER HEADER
//           ===================================================== */}

//       <TimeOfficeReportHeader
//         title="Attendance Register"

//         fromDate={filters.fromDate || today}
//         toDate={filters.toDate || today}

//         onFromDateChange={(value) =>
//           updateFilter("fromDate", value)
//         }

//         onToDateChange={(value) =>
//           updateFilter("toDate", value)
//         }

//         onBack={() => navigate(-1)}

//         /*
//          * Top:
//          * Time Office + Vessel + ClockFading
//          */
//         showTimeOfficeBanner

//         /*
//          * Report controls
//          */
//         showDateRange
//         showCategories

//         /*
//          * Match the 2nd reference image
//          */
//         showPdfExport
//         showExcelExport
//         showRefresh

//         showGraceTypes={false}
//         showMonthDropdown={false}

//         columns={COLUMNS}
//         rows={rows}
//       />

//       {/* =====================================================
//           FILTER TOOLBAR
//           ===================================================== */}

//       <div className="mb-3">
//         <TimeOfficeFilters
//           fromDate={filters.fromDate || today}
//           toDate={filters.toDate || today}
//           employeeId={filters.employeeId}
//           employeeName={filters.employeeName}

//           onFromDateChange={(value) =>
//             updateFilter("fromDate", value)
//           }

//           onToDateChange={(value) =>
//             updateFilter("toDate", value)
//           }

//           onEmployeeIdChange={(value) =>
//             updateFilter("employeeId", value)
//           }

//           onEmployeeNameChange={(value) =>
//             updateFilter("employeeName", value)
//           }

//           onSearch={handleSearch}
//           onReset={handleReset}

//           showDayWiseDropdownOptions
//         />
//       </div>

//       {/* =====================================================
//           TABLE
//           ===================================================== */}

//       <TimeOfficeTable
//         columns={COLUMNS}
//         rows={rows}
//         loading={loading}
//         emptyMessage="No attendance records found."
//         onView={(row) => {
//           console.log(
//             "Selected employee:",
//             row
//           );
//         }}
//       />

//       {/* =====================================================
//           PAGINATION
//           ===================================================== */}

//       <TimeOfficePagination
//         currentPage={currentPage}
//         totalPages={16}
//         onPageChange={setCurrentPage}
//       />

//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";

import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const COLUMNS = [
  "Emp Id",
  "Emp Name",
];

const CATEGORY_COLUMNS = [
  "Shift Worked",
  "Shift Start",
  "Shift End",
  "Check IN Time",
  "Check OUT Time",
  "Late IN",
  "Early OUT",
  "OT Hrs",
  "Extra Worked Hrs",
  "Total WorkHrs",
  "FH Status",
  "Reconciled FH Status",
  "SH Status",
  "Reconciled SH Status",
];

export default function AttendanceRegisterPage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

  const [rows] =
    useState<Record<string, unknown>[]>([]);

  const [loading] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(() => [
      ...CATEGORY_COLUMNS,
    ]);

  const handleSearch = () => {
    const validation =
      validateDateRange(
        filters.fromDate || today,
        filters.toDate || today
      );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setCurrentPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setSelectedCategories([
      ...CATEGORY_COLUMNS,
    ]);
    setCurrentPage(1);
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f3f6fa] p-2 font-[Urbanist]">

      {/* =====================================================
          TIME OFFICE + ATTENDANCE REGISTER HEADER
          ===================================================== */}

      <TimeOfficeReportHeader
        title="Attendance Register"

        fromDate={
          filters.fromDate || today
        }

        toDate={
          filters.toDate || today
        }

        onFromDateChange={(value) =>
          updateFilter(
            "fromDate",
            value
          )
        }

        onToDateChange={(value) =>
          updateFilter(
            "toDate",
            value
          )
        }

        onBack={() =>
          navigate(-1)
        }

        /*
         * TOP HEADER
         *
         * Time Office
         * Vessel
         * ClockFading
         */
        showTimeOfficeBanner
        showBannerHistory

        /*
         * REPORT HEADER
         */
        showDateRange
        showCategories
        selectedCategories={
          selectedCategories
        }
        onCategoriesChange={
          setSelectedCategories
        }
        categoryOptions={
          CATEGORY_COLUMNS
        }

        /*
         * REPORT EXPORTS
         */
        showPdfExport={false}
        showExcelExport

        /*
         * Not required
         */
        showGraceTypes={false}
        showMonthDropdown={false}

        /*
         * Export data
         */
        columns={COLUMNS}
        rows={rows}
      />

      {/* =====================================================
          SEARCH / FILTER TOOLBAR
          ===================================================== */}

      <div className="mb-3">
        <TimeOfficeFilters
          fromDate={
            filters.fromDate || today
          }

          toDate={
            filters.toDate || today
          }

          employeeId={
            filters.employeeId
          }

          employeeName={
            filters.employeeName
          }

          onFromDateChange={(value) =>
            updateFilter(
              "fromDate",
              value
            )
          }

          onToDateChange={(value) =>
            updateFilter(
              "toDate",
              value
            )
          }

          onEmployeeIdChange={(value) =>
            updateFilter(
              "employeeId",
              value
            )
          }

          onEmployeeNameChange={(value) =>
            updateFilter(
              "employeeName",
              value
            )
          }

          onSearch={handleSearch}
          onReset={handleReset}

          showDayWiseDropdownOptions
        />
      </div>

      {/* =====================================================
          ATTENDANCE REGISTER TABLE
          ===================================================== */}

      <TimeOfficeTable
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        emptyMessage="No attendance records found."
        onView={(row) => {
          console.log(
            "Selected employee:",
            row
          );
        }}
      />

      {/* =====================================================
          PAGINATION
          ===================================================== */}

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={16}
        onPageChange={
          setCurrentPage
        }
      />

    </div>
  );
}