import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import { rootReducer } from "./rootReducer";
import { setSessionExpiredHandler } from "./sessionRefresh";
import { sessionExpired } from "../features/auth/authSlice";
 
export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
 
// Plain fetch/axios callers report an ended session through this.
setSessionExpiredHandler(() => store.dispatch(sessionExpired()));
 
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
 
