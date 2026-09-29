export const LEAVE_REPORTS = [
  {
    key: "leave-allotment-report",
    title: "Leave Allotment Report",
  },
  {
    key: "leave-availed-report",
    title: "Leave Availed Report",
  },
  {
    key: "leave-lapsed-report",
    title: "Leave Lapsed Report",
  },
  {
    key: "leave-encashed-report",
    title: "Leave Encashed Report",
  },
  {
    key: "leave-summary-report",
    title: "Leave Summary Report",
  },
  {
    key: "leave-summary-report-between-months",
    title: "Leave Summary Report Between Months",
  },
  {
    key: "leave-summary-report-detailed",
    title: "Leave Summary Report Detailed",
  },
  {
    key: "leave-history-report-month-wise",
    title: "Leave History Report Month Wise",
  },
  {
    key: "leave-history-report-date-wise",
    title: "Leave History Report Date Wise",
  },
  {
    key: "attendance-independent-report",
    title: "Attendance Independent Report",
  },
  {
    key: "hourly-attendance-report",
    title: "Hourly Attendance Report",
  },
  {
    key: "attendance-integration-report",
    title: "Attendance Integration Report",
  },
  {
    key: "over-time-report",
    title: "Over Time Report",
  },
  {
    key: "late-in-early-out-report",
    title: "Late In Early Out Report",
  },
  {
    key: "late-in-early-out-report-monthly",
    title: "Late In Early Out Report Monthly",
  },
  {
    key: "exception-report-reconcile",
    title: "Exception Report Reconcile",
  },
  {
    key: "exception-report-reconcile-monthly",
    title: "Exception Report Reconcile Monthly",
  },
  {
    key: "top-attendance",
    title: "Top Attendance",
  },
  {
    key: "top-leave-taken",
    title: "Top Leave Taken",
  },
] as const;

export type LeaveReportKey =
  (typeof LEAVE_REPORTS)[number]["key"];