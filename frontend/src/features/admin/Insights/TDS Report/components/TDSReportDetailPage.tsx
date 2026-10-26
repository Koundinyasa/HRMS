import { useNavigate } from "react-router-dom";

import TDSReportFilters from "@/features/admin/Insights/TDS Report/components/TDSReportFilters";
import TDSReportHeader from "./TDSReportHeader";
import TDSReportTable from "./TDSReportTable";
import TDSReportTopBar from "./TDSReportTopBar";
import { downloadTDSReportExcel } from "../utils/tdsReportExport";
import useTDSReport from "../hooks/useTDSReport";

interface TDSReportDetailPageProps {
  title: string;
  showDate?: boolean;
  showFinancialYear?: boolean;
  showVerificationControls?: boolean;
  showMoreOptions?: boolean;
  showStatusIcon?: boolean;
  backFirst?: boolean;
  variant?: "peach" | "blue";
  endpoint?: string;
}

const COLUMNS = [
  "Sl.No.",
  "Employee ID",
  "Employee Name",
  "Email ID",
  "Email Verification Status",
];

export default function TDSReportDetailPage({
  title,
  showDate = false,
  showFinancialYear = false,
  showVerificationControls = false,
  showMoreOptions = false,
  showStatusIcon = false,
  backFirst = false,
  variant = "peach",
  endpoint,
}: TDSReportDetailPageProps) {
  const navigate = useNavigate();
  const { rows, filteredRows, searchValue, setSearchValue, loading, error, financialYears } = useTDSReport(endpoint);

  return (
    <main className="min-h-full min-w-0 bg-white p-3 sm:p-4 lg:p-6">
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <TDSReportTopBar />
        <TDSReportHeader
          title={title}
          onBack={() => navigate("../tds-report")}
          showDate={showDate}
          showFinancialYear={showFinancialYear}
          showVerificationControls={showVerificationControls}
          showMoreOptions={showMoreOptions}
          showStatusIcon={showStatusIcon}
          backFirst={backFirst}
          variant={variant}
          onExcel={() => downloadTDSReportExcel(title, COLUMNS, rows)}
          financialYearOptions={financialYears}
        />

        <TDSReportFilters rows={rows} searchValue={searchValue} onSearchChange={setSearchValue} />

        <TDSReportTable
          columns={COLUMNS}
          rows={filteredRows}
          loading={loading}
          emptyMessage={error ?? `No ${title} data found.`}
        />
      </div>
    </main>
  );
}
