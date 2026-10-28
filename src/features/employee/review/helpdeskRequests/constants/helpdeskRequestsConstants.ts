export const HELPDESK_REQUEST_STATUS = {
  PENDING: "PENDING",
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
  REJECTED: "REJECTED",
} as const;

export const HELPDESK_REQUEST_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export const HELPDESK_STATUS_OPTIONS = [
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Open",
    value: "OPEN",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Resolved",
    value: "RESOLVED",
  },
  {
    label: "Closed",
    value: "CLOSED",
  },
  {
    label: "Rejected",
    value: "REJECTED",
  },
];

export const HELPDESK_PRIORITY_OPTIONS = [
  {
    label: "Low",
    value: "LOW",
  },
  {
    label: "Medium",
    value: "MEDIUM",
  },
  {
    label: "High",
    value: "HIGH",
  },
  {
    label: "Critical",
    value: "CRITICAL",
  },
];

export const HELPDESK_REQUEST_MESSAGES = {
  EMPTY: "No helpdesk requests found",
  LOAD_ERROR: "Failed to load helpdesk requests.",
  CLOSE_SUCCESS: "Helpdesk request closed successfully.",
  CLOSE_ERROR: "Failed to close helpdesk request.",
};