import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "../admin/dashboard/dashboardSlice";
import { adminCenterReducer } from "../admin/admincenter/admincenterSlice";
import { enrollmentReducer } from "../admin/Enrollment/enrollmentSlice";
import { talentHubReducer } from "../admin/TalentHub/talenthubSlice";


export const adminReducer = combineReducers({
  dashboard: dashboardReducer,
  adminCenter: adminCenterReducer,
  enrollment: enrollmentReducer,
  talentHub: talentHubReducer,
});