export const REQUISITION_API_ENDPOINTS = {
  PENDING_LEAVE_REQUESTS: "/review/pendingleaverequests",
} as const;

export const REQUISITION_MESSAGES = {
  REQUIRED_DATES: "Please select both From Date and To Date.",
  INVALID_DATE_RANGE: "From Date cannot be after To Date.",
  FETCH_ERROR: "Failed to fetch pending leave requests.",
  NO_DATA: "No pending leave requests found.",
} as const;