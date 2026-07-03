import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useLoginMutation, useLazyGetCaptchaQuery } from '../api/authApi';
import { loginSuccess } from '../authSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

import type { LoginFormData } from '../validation/loginSchema';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { domain } = useParams();
  console.log("Current domain:", domain);

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

      localStorage.setItem('accessToken', response.accessToken);

      dispatch(loginSuccess(response));

      toast.success(response.message ?? 'Login successful');

      if (response.isFirstLogin) {
        setTimeout(() => {
          navigate(`/${domain}/reset-password`);
        }, 1000);
      } else {
        setTimeout(() => {
          navigate(`/${domain}/employee/dashboard`);
        }, 1000);
      }
    } catch (err: any) {
      const message =
        err?.data?.message ?? 'Login failed. Please try again.';

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