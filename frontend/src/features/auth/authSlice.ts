import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  forgotPasswordUserId: string;
  forgotPasswordMobile: string;
  isOtpVerified: boolean;
  isPasswordReset: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  forgotPasswordUserId: "",
  forgotPasswordMobile: "",
  isOtpVerified: false,
  isPasswordReset: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
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