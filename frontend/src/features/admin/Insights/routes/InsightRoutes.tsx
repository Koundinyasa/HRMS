import { Route } from "react-router-dom";

import InsightsPage from "../Pages/InsightsPage";

import ExitModuleHome from "../Exit Module/pages/ExitModuleHome";
import ExitModuleReport from "../Exit Module/pages/ExitModuleReport";
import RelievingLetter from "../Exit Module/pages/RelievingLetter";
import ExperienceLetter from "../Exit Module/pages/ExperienceLetter";


// import InsightsPlaceholderPage from "../pages/InsightsPlaceholderPage";
 

//Onboard

import OnboardLandingPage from "../Onboard/pages/OnboardLandingPage";
import OnboardConfirmationLetterPage from "../Onboard/pages/OnboardConfirmationLetterPage";
import ConfirmationLetterViewerPage from "../Onboard/pages/ConfirmationLetterViewerPage";
import OnboardReportsPage from "../Onboard/pages/OnboardReportsPage";


//Craft Report
import CraftReportPage from "../CraftReport/pages/CraftReportPage";

//Others
// import OthersPage from "../";


// LeaveReport
import LeaveReportLayout from "../LeaveReport/components/LeaveReportLayout";
import LeaveReportLanding from "../LeaveReport/components/LeaveReportLanding";
import LeaveAllotmentReport from "../LeaveReport/pages/LeaveAllotmentReport";
import LeaveAvailedReport from "../LeaveReport/pages/LeaveAvailedReport";
import LeaveLapsedReport from "../LeaveReport/pages/LeaveLapsedReport";
import LeaveEncashedReport from "../LeaveReport/pages/LeaveEncashedReport";
import LeaveSummaryReport from "../LeaveReport/pages/LeaveSummaryReport";
import LeaveSummaryBetweenMonths from "../LeaveReport/pages/LeaveSummaryBetweenMonths";
import LeaveSummaryDetailed from "../LeaveReport/pages/LeaveSummaryDetailed";
import LeaveHistoryMonthWise from "../LeaveReport/pages/LeaveHistoryMonthWise";
import LeaveHistoryDateWise from "../LeaveReport/pages/LeaveHistoryDateWise";
import AttendanceRegularizationReport from "../LeaveReport/pages/AttendanceRegularizationReport";
import HourlyAttendanceReport from "../LeaveReport/pages/HourlyAttendanceReport";
import AttendanceIntegrationReport from "../LeaveReport/pages/AttendanceIntegrationReport";
import OverTimeReport from "../LeaveReport/pages/OverTimeReport";
import LateEarlyOutReport from "../LeaveReport/pages/LateEarlyOutReport";
import LateEarlyOutReportMonthly from "../LeaveReport/pages/LateEarlyOutReportMonthly";
import ExceptionReport from "../LeaveReport/pages/ExceptionReport";
import ExceptionReportMonthly from "../LeaveReport/pages/ExceptionReportMonthly";
import TagAttendanceReport from "../LeaveReport/pages/TagAttendanceReport";
import TagLeaveReport from "../LeaveReport/pages/TagLeaveReport";

//General Report

import GeneralReport from "../General Report/pages/GeneralReport";
import FormMasterPage from "../General Report/pages/FormMasterPage";
import MailMergePage from "../General Report/pages/MailMergePage";
import FactoryActFormsPage from "../General Report/pages/FactoryActFormsPage";


//TDS 
import TDSReportPage from "../TDS Report/pages/TDSReportPage";
import StatementOfTotalIncomePage from "../TDS Report/pages/StatementOfTotalIncomePage";
import STIWithSalaryExtractPage from "../TDS Report/pages/STIWithSalaryExtractPage";
import STIWithAnnexuresPage from "../TDS Report/pages/STIWithAnnexuresPage";
import TaxRegimeComparisonPage from "../TDS Report/pages/TaxRegimeComparisonPage";
import RentLandlordPage from "../TDS Report/pages/RentLandlordPage";
import Form12BBWithDataPage from "../TDS Report/pages/Form12BBWithDataPage";
import Form12BBWithoutDataPage from "../TDS Report/pages/Form12BBWithoutDataPage";
import Form12BAAPage from "../TDS Report/pages/Form12BAAPage";
import Form12BAAnnexuresPage from "../TDS Report/pages/Form12BAAnnexuresPage";
import Form16Page from "../TDS Report/pages/Form16Page";


import StatutoryReportPage from "../Statutory Report/pages/StatutoryReportPage";

import PFMonthlyReportPage from "../Statutory Report/pages/PFMonthlyReportPage"; 
import SupplementaryReportPage from "../Statutory Report/pages/SupplementaryReportPage";
import SalaryReportPage from "../Statutory Report/pages/SalaryReportPage";
import ArrearReportPage from "../Statutory Report/pages/ArrearReportPage"; 
import PFMonthlyForm5Page from "../Statutory Report/pages/PFMonthlyForm5Page"; 
import PFMonthlyForm10Page from "../Statutory Report/pages/PFMonthlyForm10Page"; 
import PFYearlyForm6APage from "../Statutory Report/pages/PFYearlyForm6APage"; 
import PFYearlyEPFForm3APage from "../Statutory Report/pages/PFYearlyEPFForm3APage"; 
import NonPFEmployeeDetailsPage from "../Statutory Report/pages/NonPFEmployeeDetailsPage";  
import PFMemberRegistrationPage from "../Statutory Report/pages/PFMemberRegistrationPage";
import PFAcknowledgementPage from "../Statutory Report/pages/PFAcknowledgementPage"; 
import PFAcknowledgementViewPage from "../Statutory Report/pages/PFAcknowledgementViewPage"; 
import PFExitFilePage from "../Statutory Report/pages/PFExitFilePage";
import PFKYCFilePage from "../Statutory Report/pages/PFKYCFilePage";
 
import ESIReportPage from "../Statutory Report/pages/ESIReportPage";
import ESIMonthlyReportPage from "../Statutory Report/pages/ESIMonthlyReportPage"; 
import ESISupplementaryReportPage from "../Statutory Report/pages/ESISupplementaryReportPage"; 
import ESIMonthlyReturnPage from "../Statutory Report/pages/ESIMonthlyReturnPage" 
import ESIReturnSupplementaryPage from "../Statutory Report/pages/LWFMonthlyReportPage";
import LWFAcknowledgementPage from "../Statutory Report/pages/LWFAcknowledgementPage";
 
import LWFAcknowledgementViewPage from "../Statutory Report/pages/LWFAcknowledgementViewPage";
import PTReportPage from "../Statutory Report/pages/PTReportPage"; 
import PTMonthlyReportPage from "../Statutory Report/pages/PTMonthlyReportPage";
import PTMonthlyStatutoryReportPage from "../Statutory Report/pages/PTMonthlyStatutoryReportPage"; 
import PTHalfYearlyStatutoryReportPage from "../Statutory Report/pages/PTHalfYearlyStatutoryReportPage"; 
import PTYearlyStatutoryReportPage from "../Statutory Report/pages/PTYearlyStatutoryReportPage";
import PTAcknowledgementPage from "../Statutory Report/pages/PTAcknowledgementPage"; 
import PTAcknowledgementViewPage from "../Statutory Report/pages/PTAcknowledgementViewPage";
import ESIAcknowledgementViewPage from "../Statutory Report/pages/ESIAcknowledgementViewPage";
import ESIAcknowledgementPage from "../Statutory Report/pages/ESIAcknowledgementPage";
import LWFReportPage from "../Statutory Report/pages/LWFReportPage";
import LWFMonthlyReportPage from "../Statutory Report/pages/LWFMonthlyReportPage";

export const InsightsRoutes = (
  <Route path="insights" element={<InsightsPage />}>
    <Route path="exit-module">
      <Route index element={<ExitModuleHome />} />
      <Route path="report" element={<ExitModuleReport />} />
      <Route path="relieving-letter" element={<RelievingLetter />} />
      <Route path="experience-letter" element={<ExperienceLetter />} />
    </Route>


    {/* <Route path="craft-report" element={<CraftReportPage />}/> */}

    <Route path="onboard" element={<OnboardLandingPage />} />
    <Route path="onboard/document/confirmation-letter" element={<OnboardConfirmationLetterPage />} />
    <Route path="onboard/document/confirmation-letter/:employeeId" element={<ConfirmationLetterViewerPage />} />
    <Route path="onboard/document/:docType" element={ <OnboardConfirmationLetterPage />} />
    <Route path="onboard/reports/:reportCategory" element={<OnboardReportsPage />} />



    {/* <Route path="/" element={<OthersPage />} >
    ` <Route path="/attrition-report" element={<OthersPage />} />
      <Route path="/audit-trail" element={<OthersPage />} />
      <Route path="/audit-trail-import" element={<OthersPage />} />
      <Route path="/workflow-status" element={<OthersPage />} />
      <Route path="*" element={<Navigate to="/admin/insights/others" replace />}/>
    </Route> */}



    // Leave Report

    {/* Leave Report section */}
    <Route path="leave-report" element={<LeaveReportLayout />}>
      <Route index element={<LeaveReportLanding />} />
 
      {/* Leave Report */}
      <Route path="leave-allotment-report" element={<LeaveAllotmentReport />} />
      <Route path="leave-availed-report" element={<LeaveAvailedReport />} />
      <Route path="leave-lapsed-report" element={<LeaveLapsedReport />} />
      <Route path="leave-encashed-report" element={<LeaveEncashedReport />} />
      <Route path="leave-summary-report" element={<LeaveSummaryReport />} />
      <Route path="leave-summary-report-between-months" element={<LeaveSummaryBetweenMonths />} />
      <Route path="leave-summary-report-detailed" element={<LeaveSummaryDetailed />} />
      <Route path="leave-history-report-month-wise" element={<LeaveHistoryMonthWise />} />
      <Route path="leave-history-report-date-wise" element={<LeaveHistoryDateWise />} />
 
      {/* Attendance Report */}
      <Route path="attendance-independent-report" element={<AttendanceRegularizationReport />} />
      <Route path="hourly-attendance-report" element={<HourlyAttendanceReport />} />
      <Route path="attendance-integration-report" element={<AttendanceIntegrationReport />} />
 
      {/* Additional Report */}
      <Route path="over-time-report" element={<OverTimeReport />} />
      <Route path="late-in-early-out-report" element={<LateEarlyOutReport />} />
      <Route path="late-in-early-out-report-monthly" element={<LateEarlyOutReportMonthly />} />
      <Route path="exception-report-reconcile" element={<ExceptionReport />} />
      <Route path="exception-report-reconcile-monthly" element={<ExceptionReportMonthly />} />
 
      {/* Add. Attendance Report */}
      <Route path="top-attendance" element={<TagAttendanceReport />} />
      <Route path="top-leave-taken" element={<TagLeaveReport />} />
    </Route>


    //Craft Report

    <Route path="craft-report" element={<CraftReportPage />} />


    //General Report
    <Route path="general-report" element={<GeneralReport />} >
      <Route index element={<GeneralReport />} />
      <Route path="form_master" element={<FormMasterPage />} />
      <Route path="mail_merge" element={<MailMergePage />} />
      <Route path="factory_act_forms" element={<FactoryActFormsPage />}/> 
    </Route>

    //TDS
        <Route path="tds-report" element={<TDSReportPage />} />
        <Route path="tds-report/statement-of-total-income" element={<StatementOfTotalIncomePage />} />
        <Route path="tds-report/sti-with-salary-extract" element={<STIWithSalaryExtractPage />} />
        <Route path="tds-report/sti-with-annexures" element={<STIWithAnnexuresPage />} />
        <Route path="tds-report/tax-regime-comparison" element={<TaxRegimeComparisonPage />} />
        <Route path="tds-report/rent-landlord" element={<RentLandlordPage />} />
        <Route path="tds-report/form-12bb-with-data" element={<Form12BBWithDataPage />} />
        <Route path="tds-report/form-12bb-without-data" element={<Form12BBWithoutDataPage />} />
        <Route path="tds-report/form-12baa" element={<Form12BAAPage />} />
        <Route path="tds-report/form-12ba-annexures" element={<Form12BAAnnexuresPage />} />
        <Route path="tds-report/form-16" element={<Form16Page />} />

      <Route path="statutory-report">
      <Route index element={<StatutoryReportPage />} />
      <Route path="pf" element={<StatutoryReportPage />} /> 
      <Route path="pf/monthly-report" element={<PFMonthlyReportPage />}/>
      <Route path="pf/supplementary-report" element={<SupplementaryReportPage />} />
      <Route path="pf/salary" element={<SalaryReportPage />} /> 
      <Route path="pf/arrear" element={<ArrearReportPage />} />
      <Route path="pf/exit-file" element={<PFExitFilePage />} />
      <Route path="pf/kyc-file" element={<PFKYCFilePage />} />
      <Route path="pf/monthly-form-5" element={<PFMonthlyForm5Page />} />
      <Route path="pf/monthly-form-10" element={<PFMonthlyForm10Page />} />
      <Route path="pf/yearly-form-6a" element={<PFYearlyForm6APage />} />
      <Route path="pf/yearly-epf-form-3a" element={<PFYearlyEPFForm3APage />} />
      <Route path="pf/non-pf-employee-details" element={<NonPFEmployeeDetailsPage />} />
      <Route path="pf/registration" element={<PFMemberRegistrationPage />} /> 
      <Route path="pf/acknowledgement" element={<PFAcknowledgementPage />} /> 
      <Route path="pf/acknowledgement-view" element={<PFAcknowledgementViewPage />} />
      <Route path="esi" element={<ESIReportPage />} />
      <Route path="esi/monthly-report" element={<ESIMonthlyReportPage />} /> 
      <Route path="esi/supplementary-report" element={<ESISupplementaryReportPage />} /> 
      <Route path="esi/monthly-return" element={<ESIMonthlyReturnPage />} />
      <Route path="esi/return-supplementary" element={<ESIReturnSupplementaryPage />}/>
      <Route path="esi/acknowledgement" element={<ESIAcknowledgementPage />} />
      <Route path="esi/acknowledgement-view" element={<ESIAcknowledgementViewPage />} />
      <Route path="lwf" element={<LWFReportPage />} /> 
      <Route path="lwf/monthly-report" element={<LWFMonthlyReportPage />} />
      <Route path="lwf/acknowledgement" element={<LWFAcknowledgementPage />} />
      <Route path="lwf/acknowledgement-view" element={<LWFAcknowledgementViewPage />} />
      <Route path="pt" element={<PTReportPage />} />
      <Route path="pt/monthly-report" element={<PTMonthlyReportPage />} /> 
      <Route path="pt/monthly-statutory-report" element={<PTMonthlyStatutoryReportPage />} /> 
      <Route path="pt/half-yearly-statutory-report" element={<PTHalfYearlyStatutoryReportPage />} /> 
      <Route path="pt/yearly-statutory-report" element={<PTYearlyStatutoryReportPage />} /> 
      <Route path="pt/acknowledgement" element={<PTAcknowledgementPage />} /> 
      <Route path="pt/acknowledgement-view" element={<PTAcknowledgementViewPage />} />
    </Route>

  </Route>
);