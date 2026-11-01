import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";

// Review menu (menu route /admin/review/...).
// Applied Leave: the pending leave requests to approve or reject.
// Apply Leave for Employee: the HR form to apply leave on an employee's behalf.
const RequisitionPage = lazy(
  () => import("@/features/employee/review/requisition/pages/RequisitionPage"),
);
const ApplyLeaveForEmployeePage = lazy(
  () => import("../appliedLeave/pages/AppliedLeavePage"),
);

export const ReviewRoutes = (
  <Route path="review">
    <Route index element={<Navigate to="appliedleave" replace />} />
    <Route path="appliedleave" element={<RequisitionPage />} />
    <Route path="applyleaveforemployee" element={<ApplyLeaveForEmployeePage />} />
  </Route>
);
