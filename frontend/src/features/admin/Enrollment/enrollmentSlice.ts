import { combineReducers } from "@reduxjs/toolkit";
import backgroundVerificationReducer from "./BackgroundVerification/backgroundverificationSlice";
// import preEnrollmentReducer from "./Pre-Enrollment/preenrollmentSlice";
// import employeeDetailsReducer from "./employeeDetailsSlice";
import bulkUpdateReducer from "./bulkUpdate/bulkUpdateSlice";
// import separationReducer from "./Separation/seperationSlice";
 
export const enrollmentReducer = combineReducers({
  backgroundVerification: backgroundVerificationReducer,
//   preEnrollment: preEnrollmentReducer,
//   employeeDetails: employeeDetailsReducer,
  bulkUpdate: bulkUpdateReducer,
//   separation: separationReducer,
});
 