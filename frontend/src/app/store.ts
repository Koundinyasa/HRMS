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
 
// Every caller (RTK Query, plain fetch, axios) reports an ended session
// through this: mark the user as logged out and drop all cached API data so
// the next person to sign in on this browser never sees it.
setSessionExpiredHandler(() => {
  store.dispatch(sessionExpired());
  store.dispatch(baseApi.util.resetApiState());
});
 
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
 
