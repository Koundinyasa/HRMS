import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoginResponse } from './types/auth.types';


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
}

const initialState: AuthState = {
  accessToken: null,
  employeeId: null,
  userId: null,
  isFirstLogin: false,
  isAuthenticated: false,
  forgotPasswordUserId: "",
  forgotPasswordMobile: "",
  isOtpVerified: false,
  isPasswordReset: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      state.accessToken = action.payload.accessToken;
      state.employeeId = action.payload.data.employeeId;
      state.userId = action.payload.data.userId;
      state.isFirstLogin = action.payload.isFirstLogin;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.accessToken = null;
      state.employeeId = null;
      state.userId = null;
      state.isFirstLogin = false;
      state.isAuthenticated = false;
    },

    setForgotPasswordData: (
      state,
      action: PayloadAction<{
        userId: string;
        mobileNumber: string;
      }>
    ) => {
      state.forgotPasswordUserId = action.payload.userId;
      state.forgotPasswordMobile = action.payload.mobileNumber;
    },

    setOtpVerified: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isOtpVerified = action.payload;
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
  logout,
  setForgotPasswordData,
  setOtpVerified,
  setPasswordReset,
} = authSlice.actions;

export default authSlice.reducer;