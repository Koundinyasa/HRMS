import type {
  PendingLeaveRequestParams,
  RequisitionValidationResult,
} from "../types/requisition.types";

import {
  REQUISITION_MESSAGES,
} from "../constants/requisition.constants";

export const validatePendingLeaveRequest = (
  values: PendingLeaveRequestParams
): RequisitionValidationResult => {
  const { fromDate, toDate } = values;

  if (!fromDate || !toDate) {
    return {
      isValid: false,
      message: REQUISITION_MESSAGES.REQUIRED_DATES,
    };
  }

  if (fromDate > toDate) {
    return {
      isValid: false,
      message:
        REQUISITION_MESSAGES.INVALID_DATE_RANGE,
    };
  }

  return {
    isValid: true,
    message: "",
  };
};
