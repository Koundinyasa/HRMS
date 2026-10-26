// import { useNavigate } from "react-router-dom";

// import TDSReportFilters from "../components/TDSReportFilters";
// import TDSReportHeader from "../components/TDSReportHeader";
// import TDSReportTable from "../components/TDSReportTable";
// import TDSReportTopBar from "../components/TDSReportTopBar";

// export default function STIWithAnnexuresPage() {
//   const navigate = useNavigate();

//   return (
//     <main className="min-h-full bg-[#f7f9fc] p-4 sm:p-5">
//       <div className="space-y-3">
//         {/* TDS Report Header */}
//         <TDSReportTopBar variant="blue" />

//         {/* STI With Annexures Header */}
//         <TDSReportHeader
//           title="STI With Annexures"
//           onBack={() => navigate("../tds-report")}
//           showFinancialYear
//           financialYear="2026-2027"
//           showStatusIcon
//           backFirst
//           variant="blue"
//         />

//         {/* Filters */}
//         <TDSReportFilters />

//         {/* Table */}
//         <TDSReportTable
//           columns={[
//             "Sl.No.",
//             "Employee ID",
//             "Employee Name",
//           ]}
//           rows={[]}
//           loading={false}
//           emptyMessage="No STI With Annexures data found."
//         />
//       </div>
//     </main>
//   );
// }

import { useNavigate } from "react-router-dom";

import TDSReportFilters from "../components/TDSReportFilters";
import TDSReportHeader from "../components/TDSReportHeader";
import TDSReportTable from "../components/TDSReportTable";
import TDSReportTopBar from "../components/TDSReportTopBar";
import useTDSReport from "../hooks/useTDSReport";
import { TDS_REPORT_ENDPOINTS } from "../api/tdsReport.endpoints";

export default function STIWithAnnexuresPage() {
  const navigate = useNavigate();
  const { rows, filteredRows, searchValue, setSearchValue, loading, financialYears } = useTDSReport(TDS_REPORT_ENDPOINTS.stiWithAnnexures);

  return (
    <main className="min-h-full min-w-0 bg-white p-3 sm:p-4 lg:p-6">
      <div className="space-y-5">
        <TDSReportTopBar />

        <TDSReportHeader
          title="STI With Annexures"
          onBack={() => navigate("../tds-report")}
          showFinancialYear
          financialYearOptions={financialYears}
          financialYear="2026-2027"
          showStatusIcon
          backFirst
        />

        <TDSReportFilters rows={rows} searchValue={searchValue} onSearchChange={setSearchValue} />

        <TDSReportTable
          columns={[
            "Sl.No.",
            "Employee ID",
            "Employee Name",
          ]}
          rows={filteredRows}
          loading={loading}
          emptyMessage="No STI With Annexures data found."
          onAction={() => undefined}
        />
      </div>
    </main>
  );
}
