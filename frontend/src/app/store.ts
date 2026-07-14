import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import authReducer from "../features/auth/authSlice";
import domainReducer from "../features/domain-verification/domainSlice";
//import employeeReducer from "../features/employee/employeeSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,       
    domain: domainReducer,
    //employee: employeeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;