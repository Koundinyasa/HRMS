import { baseApi } from "@/app/baseApi";
 import type {
  LoginRequest,
  LoginResponse,
  CaptchaResponse,
  LogoutResponse,
  FirstLoginResetPasswordRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  SessionResponse,
} from "../types/auth.types";
import { sessionExpired, sessionLoaded } from "../authSlice";
 
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
    // Current session (who am I?)
    // Used when the page loads, to learn whether the browser still has a
    // valid login. The answer comes from the server; nothing is read from
    // browser storage.
    // =========================
    getSession: builder.query<SessionResponse, void>({
      query: () => "/auth/me",
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(sessionLoaded(data.data));
        } catch (error) {
          const status = (error as { error?: { status?: unknown } })?.error?.status;
          // Only a definite "not logged in" ends the session. If the server
          // could not be reached we do not know, so we leave the state alone
          // and the screen offers a retry.
          if (status === 401 || status === 403) {
            dispatch(sessionExpired());
          }
        }
      },
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
        message: string;
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
        userId: string;
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
  useGetSessionQuery,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useResetForgotPasswordMutation,
  useLogoutMutation,
  useFirstLoginResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
 
