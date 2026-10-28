// export interface TimeOfficeSection {
//   title: string;
//   reports: string[];
// }

// export const TIME_OFFICE_SECTIONS: TimeOfficeSection[] = [
//   {
//     title: "Day-Wise Reports",
//     reports: [
//       "Day-Wise Summary",
//       "Day-Wise Detailed",
//       "Attendance Register",
//       "Day-Wise Employee Shift",
//       "Employee Day Summary",
//       "Employee CW Details",
//       "Employee Day-Wise Overview",
//     ],
//   },

//   {
//     title: "TA Employee wise Report",
//     reports: [
//       "Assigned shift",
//       "Assigned Temp. Shift",
//       "Assigned Pattern",
//       "Assigned Policy",
//       "Temporary Policy",
//       "Employee TA Details",
//       "Non Working Hours",
//       "Penalty Leave Adjustment",
//       "Employee Break Slots",
//       "Exception Report",
//     ],
//   },

//   {
//     title: "Day Wise Attendance Summary",
//     reports: [
//       "Late In",
//       "Early Out",
//       "Early In",
//       "Late Out",
//       "InOut Punch",
//       "Over Time",
//       "Attendance Status",
//       "Work Hours",
//       "Week Off",
//       "Absent Status",
//     ],
//   },

//   {
//     title: "Monthly Attendance Summary",
//     reports: [
//       "Late In",
//       "Early Out",
//       "Early In",
//       "Late Out",
//       "Over Time",
//       "Work Hours",
//       "Attendance Status",
//       "Monthly Shift",
//       "Monthly Overview",
//       "Continuous absent Days",
//     ],
//   },

//   {
//     title: "Employee Punch Reports",
//     reports: [
//       "Punch Report",
//       "Time Card",
//       "Punch Events",
//       "Punch Penalty",
//     ],
//   },

//   {
//     title: "Employee Exceptions",
//     reports: [
//       "Personal Permission",
//       "Official Permission",
//       "Auto Permission",
//       "Day Wise Grace",
//     ],
//   },

//   {
//     title: "Regularizations/Authorization",
//     reports: [
//       "Punch Correction",
//       "Attendance Override",
//       "CW Authorization",
//       "OT Authorization",
//     ],
//   },

//   {
//     title: "Yearly",
//     reports: [
//       "Yearly Performance",
//     ],
//   },
// ];

import type { TimeOfficeSection } from "../types/timeOffice.types";

export const TIME_OFFICE_SECTIONS: TimeOfficeSection[] = [
  {
    title: "Day-Wise Reports",
    reports: [
      {
        label: "Day-Wise Summary",
        path: "day-wise-summary",
      },
      {
        label: "Day-Wise Detailed",
        path: "day-wise-detailed",
      },
      {
        label: "Attendance Register",
        path: "attendance-register",
      },
      {
        label: "Day-Wise Employee Shift",
        path: "day-wise-employee-shift",
      },
      {
        label: "Employee Day Summary",
        path: "employee-day-summary",
      },
      {
        label: "Employee CW Details",
        path: "employee-cw-details",
      },
      {
        label: "Employee Day-Wise Overview",
        path: "employee-day-wise-overview",
      },
    ],
  },

  {
    title: "TA Employee wise Report",
    reports: [
      {
        label: "Assigned shift",
        path: "assigned-shift",
      },
      {
        label: "Assigned Temp. Shift",
        path: "assigned-temp-shift",
      },
      {
        label: "Assigned Pattern",
        path: "assigned-pattern",
      },
      {
        label: "Assigned Policy",
        path: "assigned-policy",
      },
      {
        label: "Temporary Policy",
        path: "temporary-policy",
      },
      {
        label: "Employee TA Details",
        path: "employee-ta-details",
      },
      {
        label: "Non Working Hours",
        path: "non-working-hours",
      },
      {
        label: "Penalty Leave Adjustment",
        path: "penalty-leave-adjustment",
      },
      {
        label: "Employee Break Slots",
        path: "employee-break-slots",
      },
      {
        label: "Exception Report",
        path: "exception-report",
      },
    ],
  },

  {
    title: "Day Wise Attendance Summary",
    reports: [
      {
        label: "Late In",
        path: "late-in",
      },
      {
        label: "Early Out",
        path: "early-out",
      },
      {
        label: "Early In",
        path: "early-in",
      },
      {
        label: "Late Out",
        path: "late-out",
      },
      {
        label: "InOut Punch",
        path: "in-out-punch",
      },
      {
        label: "Over Time",
        path: "over-time",
      },
      {
        label: "Attendance Status",
        path: "attendance-status",
      },
      {
        label: "Work Hours",
        path: "work-hours",
      },
      {
        label: "Week Off",
        path: "week-off",
      },
      {
        label: "Absent Status",
        path: "absent-status",
      },
    ],
  },

  {
    title: "Monthly Attendance Summary",
    reports: [
      {
        label: "Late In",
        path: "monthly-late-in",
      },
      {
        label: "Early Out",
        path: "monthly-early-out",
      },
      {
        label: "Early In",
        path: "monthly-early-in",
      },
      {
        label: "Late Out",
        path: "monthly-late-out",
      },
      {
        label: "Over Time",
        path: "monthly-over-time",
      },
      {
        label: "Work Hours",
        path: "monthly-work-hours",
      },
      {
        label: "Attendance Status",
        path: "monthly-attendance-status",
      },
      {
        label: "Monthly Shift",
        path: "monthly-shift",
      },
      {
        label: "Monthly Overview",
        path: "monthly-overview",
      },
      {
        label: "Continuous absent Days",
        path: "continuous-absent-days",
      },
    ],
  },

  {
    title: "Employee Punch Reports",
    reports: [
      {
        label: "Punch Report",
        path: "punch-report",
      },
      {
        label: "Time Card",
        path: "time-card",
      },
      {
        label: "Punch Events",
        path: "punch-events",
      },
      {
        label: "Punch Penalty",
        path: "punch-penalty",
      },
    ],
  },

  {
    title: "Employee Exceptions",
    reports: [
      {
        label: "Personal Permission",
        path: "personal-permission",
      },
      {
        label: "Official Permission",
        path: "official-permission",
      },
      {
        label: "Auto Permission",
        path: "auto-permission",
      },
      {
        label: "Day Wise Grace",
        path: "day-wise-grace",
      },
    ],
  },

  {
    title: "Regularizations/Authorization",
    reports: [
      {
        label: "Punch Correction",
        path: "punch-correction",
      },
      {
        label: "Attendance Override",
        path: "attendance-override",
      },
      {
        label: "CW Authorization",
        path: "cw-authorization",
      },
      {
        label: "OT Authorization",
        path: "ot-authorization",
      },
    ],
  },

  {
    title: "Yearly",
    reports: [
      {
        label: "Yearly Performance",
        path: "yearly-performance",
      },
    ],
  },
];