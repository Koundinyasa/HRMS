import { useNavigate } from "react-router-dom";

import TDSReportFilters from "../components/TDSReportFilters";
import TDSReportHeader from "../components/TDSReportHeader";
import TDSReportTable from "../components/TDSReportTable";
import TDSReportTopBar from "../components/TDSReportTopBar";
import useTDSReport from "../hooks/useTDSReport";
import { TDS_REPORT_ENDPOINTS } from "../api/tdsReport.endpoints";

export default function STIWithSalaryExtractPage() {
  const navigate = useNavigate();
  const { rows, loading, financialYears } = useTDSReport(TDS_REPORT_ENDPOINTS.stiWithSalaryExtract);

  return (
    <main className="min-h-full bg-white p-4 sm:p-6">
      <div className="space-y-5">
        <TDSReportTopBar />
        <TDSReportHeader
          title="STI With Salary Extract"
          onBack={() => navigate("../tds-report")}
          showFinancialYear
          financialYearOptions={financialYears}
          showVerificationControls
          showStatusIcon
          backFirst
        />
        <TDSReportFilters rows={rows} />
        <TDSReportTable
          columns={[
            "Sl.No.",
            "Employee ID",
            "Employee Name",
            "Email ID",
            "Email Verification Status",
          ]}
          rows={rows}
          loading={loading}
          emptyMessage="No STI With Salary Extract data found."
          onAction={() => undefined}
        />
      </div>
    </main>
  );
}
