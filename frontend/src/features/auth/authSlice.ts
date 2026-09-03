import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoginResponse } from './types/auth.types';
// import {roleId} from '../../routes/ProtectedRoute';
 
 
const STORAGE_KEYS = {
  accessToken: 'hrms_auth_accessToken',
  employeeId:  'hrms_auth_employeeId',
  userId:      'hrms_auth_userId',
  roleId:      'hrms_auth_roleId',
} as const;
 
interface AuthState {
  accessToken: string | null;
  employeeId: string | null;
  userId: string | null;
  isFirstLogin: boolean;
  isAuthenticated: boolean;
  forgotPasswordUserId: string;
  forgotPasswordMobile: string;
  isOtpVerified: boolean;
  isPasswordReset: boolean;
  forgotPasswordEmployeeId: string;
  roleId: string | null;
  otpRemainingMinutes?: number;
  otpRemainingSeconds?: number;
}
 
const persistedAccessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
const persistedEmployeeId  = localStorage.getItem(STORAGE_KEYS.employeeId);
const persistedUserId      = localStorage.getItem(STORAGE_KEYS.userId);
const persistedRoleId      = localStorage.getItem(STORAGE_KEYS.roleId);
 
const initialState: AuthState = {
  accessToken: persistedAccessToken,
  employeeId: persistedEmployeeId,
  userId: persistedUserId,
  isFirstLogin: false,
  isAuthenticated: !!persistedAccessToken,
  forgotPasswordUserId: "",
  forgotPasswordMobile: "",
  isOtpVerified: false,
  isPasswordReset: false,
  forgotPasswordEmployeeId: sessionStorage.getItem("hrms_employeeId") ?? "",
  roleId:persistedRoleId,
  otpRemainingSeconds: 0,
  otpRemainingMinutes: 3,
};
 
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
 
      const roleId =(action.payload.data as { roleId?:string | null }).roleId ?? null;
 
      state.accessToken = action.payload.accessToken;
      state.employeeId = action.payload.data.employeeId;
      state.userId = action.payload.data.userId;
      state.roleId = roleId;
      state.isFirstLogin = action.payload.isFirstLogin;
      state.isAuthenticated = true;
 
 
      localStorage.setItem(STORAGE_KEYS.accessToken, action.payload.accessToken);
      localStorage.setItem(STORAGE_KEYS.employeeId, action.payload.data.employeeId);
      localStorage.setItem(STORAGE_KEYS.userId, action.payload.data.userId);
 
      if (roleId) {
        localStorage.setItem(STORAGE_KEYS.roleId,roleId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.roleId);
      }
    },
    logout(state) {
      state.accessToken = null;
      state.employeeId = null;
      state.userId = null;
      state.isFirstLogin = false;
      state.isAuthenticated = false;
      state.roleId = null;
 
 
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.employeeId);
      localStorage.removeItem(STORAGE_KEYS.userId);
      localStorage.removeItem(STORAGE_KEYS.roleId);
    },
 
 
    firstLoginPasswordResetSuccess(state) {
      state.isFirstLogin = false;
      state.isPasswordReset = true;
    },
    setForgotPasswordData: (state,action: PayloadAction<{
        userId: string;
        mobileNumber: string;
        employeeId: string;
      }>
    ) => {
      state.forgotPasswordUserId = action.payload.userId;
      state.forgotPasswordMobile = action.payload.mobileNumber;
      state.forgotPasswordEmployeeId = action.payload.employeeId;
      sessionStorage.setItem("hrms_employeeId", action.payload.employeeId);
    },
 
    setOtpVerified: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isOtpVerified = action.payload;
    },
 
    setOtpExpiry: (state, action: PayloadAction<{ remainingSeconds: number; remainingMinutes: number }>) => {
      state.otpRemainingSeconds = action.payload.remainingSeconds;
      state.otpRemainingMinutes = action.payload.remainingMinutes;
    },
 
    setPasswordReset: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isPasswordReset =
        action.payload;
    },
  },
});
 
export const {
  loginSuccess,
  firstLoginPasswordResetSuccess,
  logout,
  setForgotPasswordData,
  setOtpVerified,
  setPasswordReset,
  setOtpExpiry,
} = authSlice.actions;
 
export default authSlice.reducer;
 
 