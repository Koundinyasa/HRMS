import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useLoginMutation, useLazyGetCaptchaQuery } from '../api/authApi';
import { loginSuccess } from '../authSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

import type { LoginFormData } from '../validation/loginSchema';

import type { RootState } from "@/app/store";
import { useAppSelector } from "@/hooks/useAppSelector";


export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const domainFromRedux = useAppSelector((state: RootState) => state.domain.domain);
  const domain = domainFromRedux || sessionStorage.getItem("hrms_domain") || "";


  const [triggerGetCaptcha, { data: captcha, isFetching: captchaLoading }] =
    useLazyGetCaptchaQuery();

  const [triggerLogin] = useLoginMutation();

  const hasFetched = useRef(false); // StrictMode guard

  const loadCaptcha = useCallback(() => {
    triggerGetCaptcha();
  }, [triggerGetCaptcha]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    loadCaptcha();
  }, [loadCaptcha]);

  const login = async (data: LoginFormData) => {
    if (!captcha?.captchaId) {
      toast.error('Captcha not loaded. Please refresh.');
      loadCaptcha();
      return;
    }

    try {
      const response = await triggerLogin({
        userId: data.userId,
        password: data.password,
        captchaId: captcha.captchaId,
        captchaAnswer: data.captchaAnswer,
      }).unwrap();


      dispatch(loginSuccess(response));
      toast.success(response.message ?? 'Login successful');

      if (response.isFirstLogin) {
        navigate(`/${domain}/auth/reset-password`);
        return;
      }

      const roleId = (response.data as any)?.roleId ?? (response as any)?.roleId;

      if (roleId === 1 || roleId === 2) {
        navigate(`/${domain}/admin/dashboard`); // ✅ Admin + HR Admin → admin dashboard
      } else if (roleId === 3) {
        navigate(`/${domain}/employee/dashboard`); // ✅ regular employee
      } else {
        toast.error("Unauthorized role");
        return;
      }

    } catch (err: any) {
      const message = err?.data?.message ?? 'Login failed. Please try again.';
      if (Array.isArray(message)) {
        message.forEach((m: string) => toast.error(m));
      } else {
        toast.error(message);
      }
      loadCaptcha();
    }
  };

  return {
    captcha,
    captchaLoading,
    loadCaptcha,
    login,
  };
};