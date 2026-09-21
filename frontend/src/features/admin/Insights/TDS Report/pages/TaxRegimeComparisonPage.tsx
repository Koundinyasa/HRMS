import { useNavigate } from "react-router-dom";

import TDSReportFilters from "../components/TDSReportFilters";
import TDSReportHeader from "../components/TDSReportHeader";
import TDSReportTable from "../components/TDSReportTable";
import TDSReportTopBar from "../components/TDSReportTopBar";
import { downloadTDSReportExcel } from "../utils/tdsReportExport";
import useTDSReport from "../hooks/useTDSReport";
import { TDS_REPORT_ENDPOINTS } from "../api/tdsReport.endpoints";

const TAX_REGIME_COLUMNS = [
  "Sl.No.",
  "Employee ID",
  "Employee Name",
  "Current Regime",
  "Gross Income(Old)",
  "Total Deduction (Old)",
  "Taxable Income (Old)",
  "Total Tax(Old)",
  "Gross Income(New)",
  "Total Deduction (New)",
  "Taxable Income (New)",
  "Total Tax(New)",
];

export default function TaxRegimeComparisonPage() {
  const navigate = useNavigate();
  const { rows, loading, financialYears } = useTDSReport(TDS_REPORT_ENDPOINTS.taxRegimeComparison);

  return (
    <main className="min-h-full bg-white p-4 sm:p-6">
      <div className="space-y-5">
        <TDSReportTopBar />

        <TDSReportHeader
          title="Tax Regime Comparison Report"
          onBack={() => navigate("../tds-report")}
          showFinancialYear
          financialYearOptions={financialYears}
          financialYear="2026-2027"
          showExcel
          onExcel={() => downloadTDSReportExcel("Tax Regime Comparison Report", TAX_REGIME_COLUMNS, rows)}
          showStatusIcon
          backFirst
        />

        <TDSReportFilters rows={rows} />

        <TDSReportTable
          columns={TAX_REGIME_COLUMNS}
          rows={rows}
          loading={loading}
          emptyMessage="No Tax Regime Comparison data found."
          fitColumns
        />
      </div>
    </main>
  );
}