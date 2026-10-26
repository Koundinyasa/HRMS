import { useNavigate } from "react-router-dom";

import TDSReportFilters from "../components/TDSReportFilters";
import TDSReportHeader from "../components/TDSReportHeader";
import TDSReportTable from "../components/TDSReportTable";
import TDSReportTopBar from "../components/TDSReportTopBar";
import useTDSReport from "../hooks/useTDSReport";
import { TDS_REPORT_ENDPOINTS } from "../api/tdsReport.endpoints";

export default function StatementOfTotalIncomePage() {
  const navigate = useNavigate();
  const { rows, filteredRows, searchValue, setSearchValue, loading, financialYears } = useTDSReport(TDS_REPORT_ENDPOINTS.statementOfTotalIncome);

  return (
    <main className="min-h-full min-w-0 bg-white p-3 sm:p-4 lg:p-6">
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <TDSReportTopBar />
        <TDSReportHeader
          title="Statement Of Total Income Report"
          onBack={() => navigate("../tds-report")}
          showFinancialYear
          financialYearOptions={financialYears}
          showVerificationControls
          showStatusIcon
          backFirst
        />
        <TDSReportFilters rows={rows} searchValue={searchValue} onSearchChange={setSearchValue} />
        <TDSReportTable
          columns={[
            "Sl.No.",
            "Employee ID",
            "Employee Name",
            "Email ID",
            "Email Verification Status",
          ]}
          rows={filteredRows}
          loading={loading}
          emptyMessage="No Statement Of Total Income data found."
          onAction={() => undefined}
        />
      </div>
    </main>
  );
}
