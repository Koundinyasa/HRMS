// import type { ResignationRequest } from "../types/separation.types";

// export const getMinimumLastWorkingDate = (fromDate = new Date()) => {
//   const minimumDate = new Date(
//     fromDate.getFullYear(),
//     fromDate.getMonth(),
//     fromDate.getDate()
//   );
//   minimumDate.setDate(minimumDate.getDate() + 30);

//   const year = minimumDate.getFullYear();
//   const month = String(minimumDate.getMonth() + 1).padStart(2, "0");
//   const day = String(minimumDate.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// /**
//  * Validates resignation request.
//  * Returns null if valid.
//  */
// export const validateResignation = (
//   data: ResignationRequest
// ): string | null => {
//   const { requestedLastWorkingDate, reason } = data;

//   if (!reason.trim()) {
//     return "Reason is required.";
//   }

//   if (!requestedLastWorkingDate) {
//     return "Requested Last Working Date is required.";
//   }

//   if (requestedLastWorkingDate < getMinimumLastWorkingDate()) {
//     return "Requested Last Working Date must be at least 30 days from today.";
//   }

//   return null;
// };


import type { ResignationRequest } from "../types/separation.types";
 
/**
 * Validates resignation request.
 * Returns null if valid.
 */
export const validateResignation = (
  data: ResignationRequest
): string | null => {
  const { requestedLastWorkingDate, reason } = data;
 
  if (!reason.trim()) {
    return "Reason is required.";
  }
  // Requested Last Working Date is optional.
  if (requestedLastWorkingDate) {
    const selectedDate = new Date(
      `${requestedLastWorkingDate}T00:00:00`
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    // Minimum allowed date = 30 days from today
    const minimumDate = new Date(today);
    minimumDate.setDate(
      minimumDate.getDate() + 30
    );
    if (selectedDate < minimumDate) {
      return "Requested Last Working Date must be at least 30 days from today.";
    }
  }
 
  return null;
};
 