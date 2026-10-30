import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoginResponse, SessionUser } from './types/auth.types';

// The login token now lives only in httpOnly cookies, which JavaScript cannot
// read. Older versions of the app kept it (and the user's ids) in localStorage.
// Remove those leftovers so a stale token does not sit in the browser.
const LEGACY_STORAGE_KEYS = [
  'hrms_auth_accessToken',
  'hrms_auth_employeeId',
  'hrms_auth_userId',
  'hrms_auth_roleId',
];

try {
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  // The forgot-password screens used to keep the employee id here.
  sessionStorage.removeItem('hrms_employeeId');
} catch {
  /* storage can be blocked; nothing to clean in that case */
}

interface AuthState {
  employeeId: string | null;
  userId: string | null;
  roleId: string | null;
  /** The server says this user must set a new password before doing anything else. */
  mustChangePassword: boolean;
  isAuthenticated: boolean;
  /**
   * false until we know whether a session exists. It becomes true after a login
   * or after GET /auth/me answers. Until then the route guard waits instead of
   * guessing.
   */
  sessionChecked: boolean;
  /** The user ID typed on the forgot-password screen (kept in memory only). */
  forgotPasswordUserId: string;
  isOtpVerified: boolean;
  isPasswordReset: boolean;
  otpRemainingMinutes?: number;
  otpRemainingSeconds?: number;
  /** When the current OTP stops being valid (ms since epoch; 0 = none). */
  otpExpiresAt: number;
}

const initialState: AuthState = {
  employeeId: null,
  userId: null,
  roleId: null,
  mustChangePassword: false,
  isAuthenticated: false,
  sessionChecked: false,
  forgotPasswordUserId: '',
  isOtpVerified: false,
  isPasswordReset: false,
  otpRemainingSeconds: 0,
  otpRemainingMinutes: 3,
  otpExpiresAt: 0,
};

const toRoleId = (value: unknown): string | null =>
  value === null || value === undefined || value === '' ? null : String(value);

const clearSession = (state: AuthState) => {
  state.employeeId = null;
  state.userId = null;
  state.roleId = null;
  state.mustChangePassword = false;
  state.isAuthenticated = false;
  state.sessionChecked = true;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called after a successful login.
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      const { data } = action.payload;
      state.employeeId = String(data.employeeId);
      state.userId = data.userId;
      state.roleId = toRoleId(data.roleId);
      state.mustChangePassword = action.payload.mustChangePassword ?? false;
      state.isAuthenticated = true;
      state.sessionChecked = true;
    },

    // Called when GET /auth/me confirms the browser still has a valid session
    // (for example after a page reload).
    sessionLoaded(state, action: PayloadAction<SessionUser>) {
      state.employeeId = String(action.payload.employeeId);
      state.userId = action.payload.userId;
      state.roleId = toRoleId(action.payload.roleId);
      state.mustChangePassword = action.payload.mustChangePassword === true;
      state.isAuthenticated = true;
      state.sessionChecked = true;
    },

    // The server refused the session and it could not be refreshed.
    sessionExpired(state) {
      clearSession(state);
    },

    // The server answered 403 "you must change your password first".
    passwordChangeRequired(state) {
      state.mustChangePassword = true;
    },

    // The user signed out (or was signed out on purpose).
    logout(state) {
      clearSession(state);
    },

    firstLoginPasswordResetSuccess(state) {
      state.mustChangePassword = false;
      state.isPasswordReset = true;
    },

    setForgotPasswordData: (state, action: PayloadAction<{ userId: string }>) => {
      state.forgotPasswordUserId = action.payload.userId;
    },

    // The reset is finished (or abandoned): forget everything about it.
    clearForgotPassword: (state) => {
      state.forgotPasswordUserId = '';
      state.isOtpVerified = false;
      state.otpRemainingSeconds = 0;
      state.otpRemainingMinutes = 3;
      state.otpExpiresAt = 0;
    },

    setOtpVerified: (state, action: PayloadAction<boolean>) => {
      state.isOtpVerified = action.payload;
    },
    // Every new OTP gets its own expiry time. The countdown on the OTP screen
    // is worked out from it, so a resend restarts the timer even though the
    // number of seconds (180) is the same as before.
    setOtpExpiry: {
      reducer: (
        state,
        action: PayloadAction<{
          remainingSeconds: number;
          remainingMinutes: number;
          expiresAt: number;
        }>,
      ) => {
        state.otpRemainingSeconds = action.payload.remainingSeconds;
        state.otpRemainingMinutes = action.payload.remainingMinutes;
        state.otpExpiresAt = action.payload.expiresAt;
      },
      prepare: (payload: { remainingSeconds: number; remainingMinutes: number }) => ({
        payload: {
          ...payload,
          expiresAt: Date.now() + payload.remainingSeconds * 1000,
        },
      }),
    },
    setPasswordReset: (state, action: PayloadAction<boolean>) => {
      state.isPasswordReset = action.payload;
    },
  },
});

export const {
  loginSuccess,
  sessionLoaded,
  sessionExpired,
  passwordChangeRequired,
  firstLoginPasswordResetSuccess,
  logout,
  setForgotPasswordData,
  clearForgotPassword,
  setOtpVerified,
  setPasswordReset,
  setOtpExpiry,
} = authSlice.actions;

export default authSlice.reducer;
