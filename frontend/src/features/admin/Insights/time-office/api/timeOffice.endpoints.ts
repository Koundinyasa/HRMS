export const TIME_OFFICE_ENDPOINTS = {
  // These are the actual Time Office API groups present in this project.
  // Backend routes are under /api/admin/timeattendance/timeoffice/... 
  // and are defined in the NestJS controllers under backend/src/admin/talenthub/timeoffice.
  dayWiseAttendance: {
    lateIn: "/admin/timeattendance/timeoffice/masters/policy/latein",
    earlyOut: "/admin/timeattendance/timeoffice/masters/policy/earlyout",
    earlyIn: "/admin/timeattendance/timeoffice/masters/policy/attendance",
    lateOut: "/admin/timeattendance/timeoffice/masters/policy/attendance",
    inOutPunch: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/punchdetails",
    overTime: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    attendanceStatus:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    workHours: "/admin/timeattendance/timeoffice/masters/policy/workhours",
    weekOff: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    absentStatus: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
  },

  monthlyAttendance: {
    lateIn: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
    earlyOut: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
    earlyIn: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
    lateOut: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
    overTime: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
    workHours: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
    attendanceStatus:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
    monthlyShift:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
    monthlyOverview:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
    continuousAbsentDays:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/monthlysummary",
  },

  dayWise: {
    summary: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    detailed: "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview/punchdetails",
    attendanceRegister:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    employeeShift:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    employeeDaySummary:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    employeeCWDetails:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    employeeDayWiseOverview:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    assignedShift:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    assignedTempShift:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    assignedPattern:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    assignedPatternDetails:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    assignedPolicy:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    assignedPolicySettings:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    temporaryPolicy:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    employeeTADetails:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    nonWorkingHours:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    penaltyLeaveAdjustment:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    employeeBreakSlots:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    exceptionReport:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    auditLog:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    yearlyPerformance:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
  },

  exceptions: {
    personalPermission:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
    officialPermission:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
    autoPermission:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
    dayWiseGrace:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
    monthlyGrace:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
    punchCorrection:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
    attendanceOverride:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
    cwAuthorization:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
    otAuthorization:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
    otToCwConverted:
      "/admin/timeattendance/timeoffice/masters/policy/attendance",
  },

  punch: {
    punchReport:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    timeCard:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    punchEvents:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    punchPenalty:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    wfhPunch:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    wfhPunchSettings:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    odPunch:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    missedPunch:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    absentee:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    locationPunches:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
    locationPunchesDetails:
      "/admin/timeattendance/timeoffice/punchprocess/attendanceoverview",
  },
} as const;