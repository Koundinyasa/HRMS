export interface PunchResponse {
  success: boolean;
  action?: "IN" | "OUT";
  employeeId?: string;
  employeeName?: string;
  time?: string;
  message: string;
  mode?: string;
  device?: string;
  latitude?: number;
  longitude?: number;
}
 
export interface RecentPunch {
  action: "IN" | "OUT";
  time: string;
  mode: string;
  location: string | null;
}
 
export interface RecentPunchesResponse {
  punches: RecentPunch[];
}
 
export interface FaceStatusResponse {
  registered: boolean;
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