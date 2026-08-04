import { useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { applyTheme } from "../../employee/components/theme";
import { useLoginMutation, useLazyGetCaptchaQuery } from "../api/authApi";
import { loginSuccess } from "../authSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice";
import type { LoginFormData } from "../validation/loginSchema";
 
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { domain } = useParams();
 
  const [triggerGetCaptcha, { data: captcha, isFetching: captchaLoading }] =useLazyGetCaptchaQuery();
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
      toast.error("Captcha not loaded. Please refresh.");
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
      localStorage.removeItem(`hrmsChatbotWidgetMessages-${response.data.employeeId}`);
      applyTheme("blue");
      dispatch(showPageLoader());
      toast.success("Login successful.");
 
      if (response.isFirstLogin) {
        navigate(`/${domain}/auth/reset-password`);
        return;
      }
 
      const roleId =
        (response.data as any)?.roleId ?? (response as any)?.roleId;
 
      if (roleId === 1 || roleId === 2) {
        navigate(`/${domain}/admin/dashboard`); 
      } else if (roleId === 3) {
        navigate(`/${domain}/employee/dashboard`); 
      } else {
        toast.error("Unauthorized role");
        return;
      }
    } catch (err: any) {
      const message = err?.data?.message ?? "Login failed. Please try again.";
 
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