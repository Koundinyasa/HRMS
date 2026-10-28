import { Navigate, Route } from "react-router-dom";
import RecruitmentPage from "../pages/RecruitmentPage";

export const RecruitmentRoutes = (
  <Route path="talent-hub">
    <Route index element={<Navigate to="recruitment" replace />} />
    <Route path="recruitment/:view?/:action?" element={<RecruitmentPage />} />
  </Route>
);
