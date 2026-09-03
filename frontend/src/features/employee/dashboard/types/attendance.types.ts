export interface PunchResponse {
  success: boolean;
  action?: "IN" | "OUT";
  employeeId?: string;
  employeeName?: string;
  time?: string;
  message: string;
  // Immediate punch details, for the post-punch details slide.
  // location/address is deliberately NOT here — it resolves in the
  // background a moment later and only ever shows up via getRecentPunches.
  mode?: string;
  device?: string;
  latitude?: number;
  longitude?: number;
}
 
export interface RecentPunch {
  action: "IN" | "OUT";
  time: string;
  mode: string;
  // null = not yet resolved (or none captured) — render as "pending" either way
  location: string | null;
}
 
export interface RecentPunchesResponse {
  punches: RecentPunch[];
}
 
export interface FaceStatusResponse {
  registered: boolean;
  // The employee's real current punch state, from the backend (derived
  // from today's RawPunches). AttendanceCard uses this on mount to
  // correctly initialize its local punchedIn state instead of always
  // assuming "punched out" on every page load/login.
  punchedIn: boolean;
}
 
export interface EnrollResponse {
  success: boolean;
  message: string;
}
 
export interface CheckFrameResponse {
  passed: boolean;
  reason?: "unreadable" | "no_face" | "too_small" | "blurry" | null;
  message: string;
}
 
export interface RegistrationStatusResponse {
  registered: boolean;
  totalActiveTemplates: number;
  registeredAngles: string[];
  missingAngles: string[];
  lastUpdated: string | null;
}
 
// REMOVED — EarlyLateInfo / TodaySummaryResponse. This data now comes
// from the dashboard's ProfileResponse.data.attendanceSummary instead
// (see dashboard.types.ts) — USP_GetUserInfo merges it in directly.
 