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

export type RootState = ReturnType<typeof rootReducer>;