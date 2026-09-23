import { baseApi } from "@/app/baseApi";
 
import type {
  LoginRequest,
  LoginResponse,
  CaptchaResponse,
  LogoutResponse,
  FirstLoginResetPasswordRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/auth.types";
 
import type { DomainRequest } from "@/features/domain-verification/types/domain.types";
 
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // Captcha
    // =========================
    getCaptcha: builder.query<CaptchaResponse, void>({
      query: () => "/auth/captcha",
    }),
 
    // =========================
    // Login
    // =========================
    login: builder.mutation<LoginResponse, LoginRequest, DomainRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
 
    // =========================
    // Logout
    // =========================
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
 
    // =========================
    // Forgot Password
    // =========================
    forgotPassword: builder.mutation<
      {
        success: boolean;
        employeeId: string;
        remainingSeconds: number;
        remainingMinutes: number;
      },
      {
        userId: string;
      }
    >({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
 
    // =========================
    // Verify OTP
    // =========================
    verifyOtp: builder.mutation<
      void,
      {
        employeeId: string;
        otp: string;
      }
    >({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
 
    // =========================
    // Reset Forgot Password
    // =========================
    resetForgotPassword: builder.mutation<
      void,
      {
        employeeId: string;
        userId?: string | null;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (body) => ({
        url: "/auth/forgot-password/reset",
        method: "POST",
        body,
      }),
    }),
 
    // =========================
    // Reset Password
    // =========================
    resetPassword: builder.mutation<
      void,
      {
        password: string;
        token: string;
      }
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
 
    // =========================
    // First Login Reset Password
    // =========================
    firstLoginResetPassword: builder.mutation<
      void,
      FirstLoginResetPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
 
    // =========================
    // Change Password
    // =========================
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});
 
export const {
  useGetCaptchaQuery,
  useLazyGetCaptchaQuery,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useResetForgotPasswordMutation,
  useLogoutMutation,
  useFirstLoginResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
 