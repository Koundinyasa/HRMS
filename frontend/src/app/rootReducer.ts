import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import domainReducer from "../features/domain-verification/domainSlice";
import themeReducer from "../features/dashboard/common/themeSlice";
import { baseApi } from "./baseApi";

export const rootReducer = combineReducers({
  auth: authReducer,
  domain: domainReducer,
  theme: themeReducer,

  [baseApi.reducerPath]:
    baseApi.reducer,
});

export type RootState =
  ReturnType<typeof rootReducer>;