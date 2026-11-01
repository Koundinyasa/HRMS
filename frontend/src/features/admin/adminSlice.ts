import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "../admin/dashboard/dashboardSlice";
import { talentHubReducer } from "../admin/Time & Office/talenthubSlice";

export const adminReducer = combineReducers({
  dashboard: dashboardReducer,
  talentHub: talentHubReducer,
});
