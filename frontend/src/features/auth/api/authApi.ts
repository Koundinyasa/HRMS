import { baseApi } from '@/app/baseApi';
import type { LoginRequest, LoginResponse, CaptchaResponse, LogoutResponse } from '../types/auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaptcha: builder.query<CaptchaResponse, void>({
      query: () => '/auth/captcha',
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),


    forgotPassword: builder.mutation<{ success: boolean; employeeId: string }, { userId: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),


    verifyOtp: builder.mutation<void, { employeeId: string; otp: string }>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    resetForgotPassword: builder.mutation<void, { employeeId: string; newPassword: string; confirmPassword: string }>({
      query: (body) => ({
        url: '/auth/forgot-password/reset',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<void, { password: string; token: string }>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
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
} = authApi;