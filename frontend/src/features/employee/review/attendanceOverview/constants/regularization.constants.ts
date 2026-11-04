import type { OverviewDetailConfig } from "../types/attendanceOverview.types";

// ============================================================
// OVERVIEW DETAIL CONFIG
// ============================================================

export const overviewDetailConfig: Record<
  string,
  OverviewDetailConfig
> = {
  present: {
    title: "Present Days Details",
    columns: ["Sl. No", "Date", "Status"],
  },

  absent: {
    title: "Absent Days Details",
    columns: [
      "Sl. No",
      "Date",
      "Status",
      "Remarks",
    ],
  },

  earlyIn: {
    title: "Early In Details",
    columns: ["Sl. No", "Date", "Early In"],
  },

  lateIn: {
    title: "Late In Details",
    columns: ["Sl. No", "Date", "Late In"],
  },

  earlyOut: {
    title: "Early Out Details",
    columns: ["Sl. No", "Date", "Early Out"],
  },

  overstay: {
    title: "Overstay Details",
    columns: ["Sl. No", "Date", "Overstay"],
  },
};


// ============================================================
// ATTENDANCE NAVIGATION / UI
// ============================================================

export const attendanceTabs = [
  { label: "Punch", path: "punch" },
  { label: "Missed Punch", path: "missed-punch" },
  { label: "Attendance", path: "attendance" },
  { label: "TA Insights", path: "ta-insights" },
];

export const weeklyHours = [
  { label: "Week 1", hours: 38 },
  { label: "Week 2", hours: 41 },
  { label: "Week 3", hours: 36 },
  { label: "Week 4", hours: 40 },
];

export const insightBreakdown = [
  { label: "Present", value: 12.5, color: "bg-emerald-500" },
  { label: "Absent", value: 7.5, color: "bg-red-500" },
  { label: "Week off", value: 4, color: "bg-sky-500" },
];

export const scrollRowClass =
  "overflow-x-auto lg:overflow-x-visible [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [scrollbar-width:thin]";
