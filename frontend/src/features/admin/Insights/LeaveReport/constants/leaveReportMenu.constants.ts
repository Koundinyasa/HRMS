// leaveReportMenu.constants.ts
export interface LeaveReportMenuItem {
  label: string;
  path: string;
}

export interface LeaveReportMenuColumn {
  title: string;
  items: LeaveReportMenuItem[];
}

export const LEAVE_REPORT_MENU: LeaveReportMenuColumn[] = [
  {
    title: "Leave Report",
    items: [
      { label: "Leave Allotment Report", path: "leave-allotment-report" },
      { label: "Leave Availed Report", path: "leave-availed-report" },
      { label: "Leave Lapsed Report", path: "leave-lapsed-report" },
      { label: "Leave Encashed Report", path: "leave-encashed-report" },
      { label: "Leave Summary Report", path: "leave-summary-report" },
      { label: "Leave Summary Report Between Month", path: "leave-summary-report-between-months" },
      { label: "Leave Summary Report(Detailed)", path: "leave-summary-report-detailed" },
      { label: "Leave History Report(Month-Wise)", path: "leave-history-report-month-wise" },
      { label: "Leave History Report(Date-Wise)", path: "leave-history-report-date-wise" },
    ],
  },
  {
    title: "Attendance Report",
    items: [
      { label: "Attendance Independent Report", path: "attendance-independent-report" },
      { label: "Hourly Attendance Report", path: "hourly-attendance-report" },
      { label: "Attendance Integration Report", path: "attendance-integration-report" },
    ],
  },
  {
    title: "Additional Report",
    items: [
      { label: "Over Time Report", path: "over-time-report" },
      { label: "Late In Early Out Report", path: "late-in-early-out-report" },
      { label: "Late In Early Out Report(Monthly)", path: "late-in-early-out-report-monthly" },
      { label: "Exception Report-Reconcile", path: "exception-report-reconcile" },
    ],
  },
  {
    title: "Add. Attendance Report",
    items: [
      { label: "Top Attendance", path: "top-attendance" },
      { label: "Top Leave Taken", path: "top-leave-taken" },
    ],
  },
];