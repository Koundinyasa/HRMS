export const RESIGNATION_REQUEST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export const RESIGNATION_STATUS_OPTIONS = [
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Approved",
    value: "APPROVED",
  },
  {
    label: "Rejected",
    value: "REJECTED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
];

export const RESIGNATION_REQUEST_MESSAGES = {
  EMPTY: "No resignation requests found",
  LOAD_ERROR: "Failed to load resignation requests.",
  APPROVE_SUCCESS: "Resignation request approved successfully.",
  REJECT_SUCCESS: "Resignation request rejected successfully.",
  APPROVE_ERROR: "Failed to approve resignation request.",
  REJECT_ERROR: "Failed to reject resignation request.",
};