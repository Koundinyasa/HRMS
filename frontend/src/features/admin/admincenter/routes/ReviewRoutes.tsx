import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";

// Review menu (menu route /admin/review/...). Both screens use the HR
// "apply leave for an employee" page.
const AppliedLeavePage = lazy(() => import("../appliedLeave/pages/AppliedLeavePage"));

export const ReviewRoutes = (
  <Route path="review">
    <Route index element={<Navigate to="appliedleave" replace />} />
    <Route path="appliedleave" element={<AppliedLeavePage />} />
    <Route path="applyleaveforemployee" element={<AppliedLeavePage />} />
  </Route>
);
