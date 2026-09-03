// import authReducer from "../features/auth/authSlice.ts";
// import domainReducer from "../features/domain-verification/domainSlice";
// import adminDashboardReducer from "../features/admin/dashboard/dashboardSlice.ts";
// import employeeReducer from "../features/employee/employeeSlice";
// import backgroundVerificationReducer from "../features/admin/Enrollment/BackgroundVerification/backgroundverificationSlice.ts";
// import timeOfficeReducer from "../features/admin/TalentHub/TimeOffice/timeofficeSlice.ts";


// export const rootReducer = {
//   auth: authReducer,
//   domain: domainReducer,
//   employee: employeeReducer,
//   adminDashboard: adminDashboardReducer,
//   backgroundVerification: backgroundVerificationReducer,
//   timeOffice: timeOfficeReducer,
// };
// export type { RootState } from "./store";



import authReducer from "../features/auth/authSlice";
import domainReducer from "../features/domain-verification/domainSlice";
import employeeReducer from "../features/employee/employeeSlice";
import { adminReducer } from "../features/admin/adminSlice";

export const rootReducer = {
  auth: authReducer,
  domain: domainReducer,
  employee: employeeReducer,
  admin: adminReducer,
};


export type { RootState } from "./store";