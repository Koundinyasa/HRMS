import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";

// Pages are loaded on demand (each one becomes its own file in the build).
const RecruitmentPage = lazy(() => import("../pages/RecruitmentPage"));

export const RecruitmentRoutes = (
  <Route path="talent-hub">
    <Route index element={<Navigate to="recruitment" replace />} />
    <Route path="recruitment/:view?/:action?" element={<RecruitmentPage />} />
  </Route>
);
