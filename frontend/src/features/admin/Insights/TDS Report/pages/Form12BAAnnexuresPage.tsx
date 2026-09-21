import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

import TDSReportFilters from "../components/TDSReportFilters";
import TDSReportHeader from "../components/TDSReportHeader";
import TDSReportTable from "../components/TDSReportTable";
import TDSReportTopBar from "../components/TDSReportTopBar";
import useTDSReport from "../hooks/useTDSReport";
import { TDS_REPORT_ENDPOINTS } from "../api/tdsReport.endpoints";

export default function Form12BAAnnexuresPage() {
  const navigate = useNavigate();

  const { rows, loading, financialYears } = useTDSReport(
    TDS_REPORT_ENDPOINTS.form12BAAnnexures
  );

  return (
    <main className="min-h-full bg-white p-4 sm:p-6">
      <div className="space-y-5">
        {/* TDS Report Top Bar */}
        <TDSReportTopBar />

        {/* FORM-12BA and Annexures Header */}
        <TDSReportHeader
          title="FORM-12BA And Annexures Report"
          onBack={() => navigate("../tds-report")}
          showFinancialYear
          financialYearOptions={financialYears}
          financialYear="2026-2027"
          showMoreOptions
          showStatusIcon
          backFirst
        />

        {/* Filters */}
        <TDSReportFilters rows={rows} />

        {/* Information Note */}
        <section className="flex min-h-[62px] items-center gap-4 rounded-lg border border-[#e2e4f3] bg-[#f8f8ff] px-5 shadow-sm">
          <Info
            size={24}
            strokeWidth={2}
            className="shrink-0 text-[#8187de]"
          />

          <p className="font-[Urbanist] text-[13px] font-normal text-[#555a7a]">
            Note : Form12BA and Annexure reports can&apos;t generated for
            PANNOTAVBL, PANINVALID, PANAPPLIED employees
          </p>
        </section>

        {/* Report Table */}
        <TDSReportTable
          columns={[
            "Sl.No.",
            "Employee ID",
            "Employee Name",
            "PAN No.",
          ]}
          rows={rows}
          loading={loading}
          emptyMessage="No FORM-12BA and Annexures data found."
          onAction={() => undefined}
        />
      </div>
    </main>
  );
}