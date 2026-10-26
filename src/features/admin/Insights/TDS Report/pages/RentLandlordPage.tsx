import { useNavigate } from "react-router-dom";

import TDSReportEmptyState from "../components/TDSReportEmptyState";
import TDSReportHeader from "../components/TDSReportHeader";
import TDSReportTopBar from "../components/TDSReportTopBar";
import useTDSReport from "../hooks/useTDSReport";
import { TDS_REPORT_ENDPOINTS } from "../api/tdsReport.endpoints";
import { downloadTDSReportExcel } from "../utils/tdsReportExport";

const RENT_LANDLORD_COLUMNS = ["Employee ID", "Employee Name"];

export default function RentLandlordPage() {
  const navigate = useNavigate();
  const { rows, financialYears } = useTDSReport(TDS_REPORT_ENDPOINTS.rentLandlord);

  return (
    <main className="min-h-full bg-white p-4 sm:p-6">
      <div className="space-y-5">
        {/* TDS Report Top Bar */}
        <TDSReportTopBar showFilterIcon={false} />

        {/* Rent Landlord Header */}
        <TDSReportHeader
          title="Rent Landlord"
          onBack={() => navigate("../tds-report")}
          showFinancialYear
          financialYearOptions={financialYears}
          financialYear="2026-2027"
          showExcel
          onExcel={() => downloadTDSReportExcel("Rent Landlord", RENT_LANDLORD_COLUMNS, rows)}
          showStatusIcon
          backFirst
        />

        {/* No Data */}
        <section className="overflow-hidden rounded-xl border border-[#d1d1d1] bg-white">
          <TDSReportEmptyState message="No Rent Landlord data found." />
        </section>
      </div>
    </main>
  );
}