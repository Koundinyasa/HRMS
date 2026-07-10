import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.ts";
import domainReducer from "../features/domain-verification/domainSlice";
import adminDashboardReducer from "../features/admin/dashboard/dashboardSlice.ts"

export const rootReducer = combineReducers({
  auth: authReducer,
  domain: domainReducer,
  adminDashboard:adminDashboardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;