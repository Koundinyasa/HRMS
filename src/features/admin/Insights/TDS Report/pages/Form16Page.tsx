import TDSReportDetailPage from "../components/TDSReportDetailPage";
import { TDS_REPORT_ENDPOINTS } from "../api/tdsReport.endpoints";

export default function Form16Page() {
  return (
    <TDSReportDetailPage
      title="FORM-16 Report"
      showFinancialYear
      showVerificationControls
      showMoreOptions
      showStatusIcon
      backFirst
      variant="peach"
      endpoint={TDS_REPORT_ENDPOINTS.form16}
    />
  );
}
