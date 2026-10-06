import type { AttendanceDayCode, InsightTile } from "../types/timeoffice.types";

export const DAY_STYLES: Record<AttendanceDayCode, { label: string; className: string }> = {
  P: { label: "P", className: "bg-white text-slate-700 border border-slate-200" },
  A: { label: "A", className: "bg-orange-100 text-orange-700" },
  H: { label: "H", className: "bg-purple-100 text-purple-700" },
  WO: { label: "W", className: "bg-slate-200 text-slate-600" },
  IN: { label: "IN", className: "bg-sky-100 text-sky-700" },
  P_A: { label: "P/A", className: "bg-orange-50 text-slate-700 border border-orange-200" },
  A_P: { label: "A/P", className: "bg-orange-50 text-slate-700 border border-orange-200" },
  P_AB: { label: "P/AB", className: "bg-red-50 text-red-600 border border-red-200" },
  AB_P: { label: "AB/P", className: "bg-red-50 text-red-600 border border-red-200" },
};

/** Fallback shown until the TA Insights summary endpoint responds. */
export const INSIGHT_TILES: InsightTile[] = [
  { key: "totalAbsent", label: "Total Absent", value: 33, total: 33, color: "#2563EB", active: true },
  { key: "lopOverride", label: "LOP Override", value: 0, total: 0, color: "#7C3AED", active: false },
  { key: "leaveAndPunch", label: "Leave and Punch", value: 0, total: 0, color: "#059669", active: false },
  { key: "otPendingAuth", label: "OT Pending Auth.", value: 0, total: 0, color: "#0EA5E9", active: false },
  { key: "cwPendingAuth", label: "CW Pending Auth.", value: 0, total: 0, color: "#EF4444", active: false },
  { key: "cwStatus", label: "CW Status", value: 0, total: 0, color: "#F59E0B", active: false },
  { key: "overTime", label: "Over Time", value: 0, total: 0, color: "#65A30D", active: false },
  { key: "pendingPermissionPunches", label: "Pending Permission Punches", value: 0, total: 0, color: "#0D9488", active: false },
  { key: "punchProcessPending", label: "Punch Process Pending", value: 0, total: 0, color: "#64748B", active: false },
  { key: "integrationPending", label: "Integration Pending", value: 90, total: 90, color: "#2563EB", active: true },
];
