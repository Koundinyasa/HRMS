import { combineReducers } from "@reduxjs/toolkit";
// import attendanceReducer from "./Attendance/attendanceSlice";
// import leaveReducer from "./Leave/leaveSlice";
import timeOfficeReducer from "./TimeOffice/timeofficeSlice";
 
export const talentHubReducer = combineReducers({
//   attendance: attendanceReducer,
//   leave: leaveReducer,
  timeOffice: timeOfficeReducer,
});
 