import { useNavigate } from "react-router-dom";

import TDSReportFilters from "../components/TDSReportFilters";
import TDSReportHeader from "../components/TDSReportHeader";
import TDSReportTable from "../components/TDSReportTable";
import TDSReportTopBar from "../components/TDSReportTopBar";
import useTDSReport from "../hooks/useTDSReport";
import { TDS_REPORT_ENDPOINTS } from "../api/tdsReport.endpoints";

export default function Form12BBWithoutDataPage() {
  const navigate = useNavigate();
  const { rows, loading, financialYears } = useTDSReport(TDS_REPORT_ENDPOINTS.form12BBWithoutData);

  return (
    <main className="min-h-full bg-white p-4 sm:p-6">
      <div className="space-y-5">
        {/* TDS Report Top Bar */}
        <TDSReportTopBar />

        {/* Form-12BB Header */}
        <TDSReportHeader
          title="Form-12BB (Without Data)"
          onBack={() => navigate("../tds-report")}
          showFinancialYear
          financialYearOptions={financialYears}
          financialYear="2026-2027"
          showVerificationControls
          showStatusIcon
          backFirst
        />

        {/* Filters */}
        <TDSReportFilters rows={rows} />

        {/* Report Table */}
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
          emptyMessage="No Form-12BB (Without Data) data found."
          onAction={() => undefined}
        />
      </div>
    </main>
  );
}