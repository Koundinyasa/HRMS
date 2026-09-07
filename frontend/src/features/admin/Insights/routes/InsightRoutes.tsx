import { Navigate, Route } from "react-router-dom";


import InsightPage from "../Pages/InsightsPage";


export const InsightsRoutes= (
    <Route path="insights" element={<InsightPage />} />
);