import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { loginApi, getCaptchaApi } from '../api/authApi';
import { loginSuccess } from '../authSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

import type { CaptchaResponse } from '../types/auth.types';
import type { LoginFormData } from '../validation/loginSchema';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [captcha, setCaptcha] = useState<CaptchaResponse | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const hasFetched = useRef(false); // ← StrictMode guard

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const response = await getCaptchaApi();
      setCaptcha(response);
    } catch {
      toast.error('Unable to load captcha. Please refresh.');
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return; // prevent StrictMode double call
    hasFetched.current = true;
    loadCaptcha();
  }, [loadCaptcha]);

  const login = async (data: LoginFormData) => {
    if (!captcha?.captchaId) {
      toast.error('Captcha not loaded. Please refresh.');
      await loadCaptcha();
      return;
    }

    try {
      const response = await loginApi({
        userId: data.userId,
        password: data.password,
        captchaId: captcha.captchaId,
        captchaAnswer: data.captcha,
      });

      // Store token for axios interceptor
      localStorage.setItem('accessToken', response.accessToken);

      dispatch(loginSuccess(response));

      toast.success(response.message ?? 'Login successful');

      // Redirect based on first login flag
      if (response.isFirstLogin) {
        navigate('/auth/reset-password');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? 'Login failed. Please try again.';

      if (Array.isArray(message)) {
        message.forEach((m: string) => toast.error(m));
      } else {
        toast.error(message);
      }

      // Only refresh captcha on failure — don't clear form
      await loadCaptcha();
    }
  };

  return {
    captcha,
    captchaLoading,
    loadCaptcha,
    login,
  };
};