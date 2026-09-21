import type React from "react";
export interface EmployeeProfile {
  FullName: string;
  ShortName: string;
  Code: string;
  CompanyName: string;
  BranchName: string;
  Department: string;
  Designation: string;
  EmployeeID: string;
  Email: string;
  WelcomeMessage: string;
  LastLoginDateTime: string;
}

export interface MenuItem {
  menuId: number;
  menuName: string;
  routeUrl?: string;
  iconClass?: string | null;
  children?: MenuItem[];
}

export interface AttendanceSummary {
  EmployeeID: string;
  AverageHours: string;
  "AverageCheck-In": string;
  "On-TimeArrival": string;
  "AverageCheck-Out": string;
  CurrentSessionStartTime: string | null;
  TotalCompletedMinutesToday: number;
  CheckInTime: string | null;
  CheckOutTime: string | null;
  LateOrEarlyInStatus: "Early" | "Late" | "OnTime" | null;
  LateOrEarlyInMinutes: number | null;
  LateOrEarlyOutStatus: "Early" | "Late" | "OnTime" | null;
  LateOrEarlyOutMinutes: number | null;
}

export interface UpcomingEvent {
  FullName: string;
  Code: string;
  EventName: string;
  EventDate: string;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    profile: EmployeeProfile;
    attendanceSummary: AttendanceSummary;
    upcomingEvents: UpcomingEvent[];
  };
}

export type TeamAttendanceRow = Record<string, string | number | null>;

export interface MenuResponse {
  success: boolean;
  data: MenuItem[];
}

export type TeamAttendanceResponse = TeamAttendanceRow[];

export interface Holiday {
  HolidayId: number;
  HolidayName: string;
  HolidayDate: string;
  StateCode: string;
  HolidayYear: number;
  IsOptional: boolean;
}

export interface HolidayResponse {
  success: boolean;
  data: Holiday[];
}

export interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// ===============================
// NEW — Approval Summary (Quick Access)
// ===============================
export interface RequestDetail {
  RequestType: string;
  RequestCount: number;
}

export interface ApprovalSummaryResponse {
  PendingApprovals: number;
  MyRequests: number;
  MyRequestsDetails: RequestDetail[];
  MyApprovalsDetails: RequestDetail[];
}
