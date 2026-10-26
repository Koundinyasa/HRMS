import { useNavigate } from "react-router-dom";

import TDSReportFilters from "../components/TDSReportFilters";
import TDSReportHeader from "../components/TDSReportHeader";
import TDSReportTable from "../components/TDSReportTable";
import TDSReportTopBar from "../components/TDSReportTopBar";
import useTDSReport from "../hooks/useTDSReport";
import { TDS_REPORT_ENDPOINTS } from "../api/tdsReport.endpoints";

export default function Form12BAAPage() {
  const navigate = useNavigate();
  const { rows, filteredRows, searchValue, setSearchValue, loading, financialYears } = useTDSReport(TDS_REPORT_ENDPOINTS.form12BBReport);

  return (
    <main className="min-h-full min-w-0 bg-white p-3 sm:p-4 lg:p-6">
      <div className="space-y-5">
        {/* TDS Report Top Bar */}
        <TDSReportTopBar />

        {/* Form-12BAA Header */}
        <TDSReportHeader
          title="Form-12BAA Report"
          onBack={() => navigate("../tds-report")}
          showFinancialYear
          financialYearOptions={financialYears}
          financialYear="2026-2027"
          showVerificationControls
          showStatusIcon
          backFirst
        />

        {/* Filters */}
        <TDSReportFilters rows={rows} searchValue={searchValue} onSearchChange={setSearchValue} />
        <TDSReportTable
          columns={["Sl.No.", "Employee ID", "Employee Name"]}
          rows={filteredRows}
          loading={loading}
          emptyMessage="No Form-12BAA data found."
        />
      </div>
    </main>
  );
}
