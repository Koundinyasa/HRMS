import { combineReducers } from "@reduxjs/toolkit";
// import companyReducer from "./company/companySlice";
// import settingsReducer from "./settings/settingsSlice";
import classificationReducer from "./classifications/classificationSlice";
import userManagementReducer from "./userManagement/usermanagementSlice";
import leaveReducer from "./classifications/leaveSlice";
// import essReducer from "./ess/essSlice";
// import workflowsReducer from "./workflows/workflowsSlice";
 
export const adminCenterReducer = combineReducers({
  // company: companyReducer,
  // settings: settingsReducer,
  classifications: classificationReducer,
  leave: leaveReducer,
  userManagement: userManagementReducer,
  // ess: essReducer,
  // workflows: workflowsReducer,
});
 