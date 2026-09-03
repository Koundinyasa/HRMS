// import { combineReducers } from "@reduxjs/toolkit";

// import authReducer from "../features/auth/authSlice";
// import domainReducer from "../features/domain-verification/domainSlice";
// import employeeReducer from "../features/employee/employeeSlice";
// import assetReducer from "../features/employee/asset/assetSlice";
// import separationReducer from "@/features/employee/separation/separationSlice";
// import helpDeskReducer from "../features/employee/helpdesk/helpDeskSlice";
// import { baseApi } from "./baseApi";

// export const rootReducer = combineReducers({
//   auth: authReducer,
//   domain: domainReducer,
//   employee: employeeReducer,
//   asset: assetReducer,
//   separation: separationReducer,
//    helpDesk: helpDeskReducer,

//   [baseApi.reducerPath]: baseApi.reducer,
// });

// export type RootState = ReturnType<typeof rootReducer>;


import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import domainReducer from "../features/domain-verification/domainSlice";

import employeeReducer from "../features/employee/employeeSlice";

import { baseApi } from "./baseApi";

export const rootReducer = combineReducers({
  auth: authReducer,

  domain: domainReducer,

  employee: employeeReducer,

  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState =
  ReturnType<typeof rootReducer>;