import type { TAInsightCount } from "../types/taInsightsTypes";

export const TA_INSIGHTS_LOADING_MESSAGE = "Loading TA Insights...";

export const TA_INSIGHT_CARD_DEFINITIONS: Array<{
  key: TAInsightCount["key"];
  title: string;
  color: string;
  insightId: number;
}> = [
  { key: "totalAbsent", title: "Total Absent", color: "#1683ee", insightId: 1 },
  { key: "lopOverride", title: "LOP Override", color: "#b83cd1", insightId: 2 },
  { key: "leaveAndPunch", title: "Leave and Punch", color: "#009688", insightId: 3 },
  { key: "otPendingAuth", title: "OT Pending Auth.", color: "#0877b9", insightId: 4 },
  { key: "cwPendingAuth", title: "CW Pending Auth.", color: "#c76767", insightId: 5 },
  { key: "cwStatus", title: "CW Status", color: "#ff8b32", insightId: 6 },
  { key: "overTime", title: "Over Time", color: "#a99b00", insightId: 7 },
  { key: "pendingPermissionPunches", title: "Pending Permission Punches", color: "#5dbbaa", insightId: 8 },
  { key: "punchProcessPending", title: "Punch Process Pending", color: "#626aa3", insightId: 9 },
  { key: "integrationPending", title: "Integration Pending", color: "#5a8fa3", insightId: 10 },
];