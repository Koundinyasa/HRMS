import { Navigate, Route } from "react-router-dom";

import InsightsPage from "../Pages/InsightsPage";

import ExitModuleHome from "../Exit Module/pages/ExitModuleHome";
import ExitModuleReport from "../Exit Module/pages/ExitModuleReport";
import RelievingLetter from "../Exit Module/pages/RelievingLetter";
import ExperienceLetter from "../Exit Module/pages/ExperienceLetter";


import InsightsPlaceholderPage from "../pages/InsightsPlaceholderPage";
 

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
   
  </Route>
);