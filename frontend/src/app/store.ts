import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import { rootReducer } from "./rootReducer";
import { setSessionExpiredHandler } from "./sessionRefresh";
import { broadcastSignedOut, onSignedOutElsewhere } from "./crossTab";
import { sessionExpired } from "../features/auth/authSlice";
import { showSessionEndedMessage } from "../features/auth/sessionMessages";
 
export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
 
// Every caller (RTK Query, plain fetch, axios) reports an ended session
// through this: mark the user as logged out, drop all cached API data so the
// next person to sign in on this browser never sees it, say why (replaced on
// another device, timed out, ...) and tell the other tabs of this browser.
setSessionExpiredHandler((code) => {
  const wasSignedIn = store.getState().auth.isAuthenticated;
  store.dispatch(sessionExpired());
  store.dispatch(baseApi.util.resetApiState());
  showSessionEndedMessage(code);
  if (wasSignedIn) broadcastSignedOut(code);
});

// Another tab of this browser signed out (or learned the login is over).
onSignedOutElsewhere((code) => {
  if (!store.getState().auth.isAuthenticated) return;
  store.dispatch(sessionExpired());
  store.dispatch(baseApi.util.resetApiState());
  showSessionEndedMessage(code);
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
 
