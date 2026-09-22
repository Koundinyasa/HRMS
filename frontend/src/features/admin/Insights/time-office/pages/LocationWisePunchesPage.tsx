// import React, { useState } from "react";
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

// export default function LocationWisePunchesPage() {
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

//     // =====================================================
//     // LOCATION WISE PUNCHES API
//     // =====================================================
//     //
//     // TIME_OFFICE_ENDPOINTS.punch.locationPunchesDetails
//     //
//     // Add API request/response mapping after confirming
//     // the backend response structure.
//   };

//   const handleReset = () => {
//     resetFilters();
//     setCurrentPage(1);
//   };

//   const handleExcelExport = () => {
//     // Connect the existing Excel export logic here.
//   };

//   return (
//     <div className="min-h-full bg-[#f5f6fa] p-4">

//       {/* =====================================================
//           LOCATION WISE PUNCHES HEADER
//           ===================================================== */}

//       <TimeOfficeReportHeader
//         title="Location Wise Punches"
//         fromDate={filters.fromDate || today}
//         toDate={filters.toDate || today}
//         onFromDateChange={(value) =>
//           updateFilter("fromDate", value)
//         }
//         onToDateChange={(value) =>
//           updateFilter("toDate", value)
//         }
//         onBack={() => navigate(-1)}
//         showTimeOfficeBanner={true}
//         showBannerHistory={true}
//         showDateRange={true}
//         showPdfExport={false}
//         showExcelExport={true}
//         onExcelExport={handleExcelExport}
//         showRefresh={false}
//         showAdvanceFilter={false}
//       />

//       {/* =====================================================
//           FILTER ROW
//           ===================================================== */}

//       <TimeOfficeFilters
//         fromDate={filters.fromDate || today}
//         toDate={filters.toDate || today}

//         employeeId={filters.employeeId}
//         employeeName={filters.employeeName}

//         onFromDateChange={(value) =>
//           updateFilter("fromDate", value)
//         }

//         onToDateChange={(value) =>
//           updateFilter("toDate", value)
//         }

//         onEmployeeIdChange={(value) =>
//           updateFilter("employeeId", value)
//         }

//         onEmployeeNameChange={(value) =>
//           updateFilter("employeeName", value)
//         }

//         onSearch={handleSearch}
//         onReset={handleReset}
//       />

//       {/* =====================================================
//           TABLE
//           ===================================================== */}

//       <TimeOfficeTable
//         columns={[]}
//         rows={rows}
//         loading={loading}
//         emptyMessage="No location wise punch records found."
//       />

//       {/* =====================================================
//           PAGINATION
//           ===================================================== */}

//       <TimeOfficePagination
//         currentPage={currentPage}
//         totalPages={1}
//         onPageChange={setCurrentPage}
//       />
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";

import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const EXCEL_LAYOUT_OPTIONS = [
  "Location Wise",
  "Employee Wise",
];

export default function LocationWisePunchesPage() {
  const navigate = useNavigate();
  const today = getTodayDate();

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

  const [rows] = useState<Record<string, unknown>[]>([]);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [excelLayout, setExcelLayout] =
    useState("Location Wise");

  const handleSearch = () => {
    const validation = validateDateRange(
      filters.fromDate || today,
      filters.toDate || today
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // =====================================================
    // LOCATION WISE PUNCHES API
    // =====================================================
    //
    // TIME_OFFICE_ENDPOINTS.punch.locationPunchesDetails
    //
    // Add API request/response mapping after confirming
    // the backend response structure.
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
    setExcelLayout("Location Wise");
  };

  const handleExcelExport = () => {
    const exportColumns =
      rows.length > 0
        ? Object.keys(rows[0] as Record<string, unknown>)
        : ["No data available"];

    const sheetData =
      rows.length > 0
        ? rows.map((row) =>
            exportColumns.map((column) =>
              (row as Record<string, unknown>)[column] ?? ""
            )
          )
        : [["No data available"]];

    const worksheet = XLSX.utils.aoa_to_sheet([
      exportColumns,
      ...sheetData,
    ]);

    worksheet["!cols"] = exportColumns.map((column) => ({
      wch: Math.max(column.length + 2, 15),
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Location Wise Punches"
    );

    XLSX.writeFile(
      workbook,
      `Location_Wise_Punches_${today}.xlsx`
    );
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f5f6fa] p-4">
      {/* =====================================================
          LOCATION WISE PUNCHES HEADER
          ===================================================== */}

      <TimeOfficeReportHeader
        title="Location Wise Punches"
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        onFromDateChange={(value) =>
          updateFilter("fromDate", value)
        }
        onToDateChange={(value) =>
          updateFilter("toDate", value)
        }
        onBack={() => navigate(-1)}

        showTimeOfficeBanner={true}
        showBannerHistory={true}
        showDateRange={true}

        showPdfExport={false}
        showExcelExport={true}
        onExcelExport={handleExcelExport}

        showRefresh={false}
        showAdvanceFilter={false}

        /* Excel Layout dropdown */
        showExcelLayout={true}
        selectedExcelLayout={excelLayout}
        onExcelLayoutChange={setExcelLayout}
        excelLayoutOptions={EXCEL_LAYOUT_OPTIONS}
      />

      {/* =====================================================
          FILTER ROW
          ===================================================== */}

      <TimeOfficeFilters
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        employeeId={filters.employeeId}
        employeeName={filters.employeeName}
        onFromDateChange={(value) =>
          updateFilter("fromDate", value)
        }
        onToDateChange={(value) =>
          updateFilter("toDate", value)
        }
        onEmployeeIdChange={(value) =>
          updateFilter("employeeId", value)
        }
        onEmployeeNameChange={(value) =>
          updateFilter("employeeName", value)
        }
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* =====================================================
          TABLE
          ===================================================== */}

      <TimeOfficeTable
        columns={[]}
        rows={rows}
        loading={loading}
        emptyMessage="No location wise punch records found."
      />

      {/* =====================================================
          PAGINATION
          ===================================================== */}

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
