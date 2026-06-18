import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.ts";
import domainReducer from "../features/domain-verification/domainSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  domain: domainReducer,
});

export type RootState = ReturnType<typeof rootReducer>;