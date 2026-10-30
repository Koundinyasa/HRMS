import { useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { applyTheme } from "../../employee/components/theme"; 
import { useLoginMutation, useLazyGetCaptchaQuery } from "../api/authApi";
import { loginSuccess } from "../authSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { showPageLoader } from "../../employee/employeeSlice"; 
import type { LoginFormData } from "../validation/loginSchema";
import { baseApi } from "../../../app/baseApi";
import { getHomePath } from "@/shared/constants/roles";
 
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { domain } = useParams(); 
  const [triggerGetCaptcha, { data: captcha, isFetching: captchaLoading }] =useLazyGetCaptchaQuery();
  const [triggerLogin] = useLoginMutation();
  const hasFetched = useRef(false); 
  const loadCaptcha = useCallback(() => {triggerGetCaptcha();}, [triggerGetCaptcha]);
 
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
 
      dispatch(baseApi.util.resetApiState());
      dispatch(loginSuccess(response));
      localStorage.removeItem(`hrmsChatbotWidgetMessages-${response.data.employeeId}`);
      applyTheme("blue");
      dispatch(showPageLoader());
      toast.success("Login successful.");
      if (response.mustChangePassword) {
        navigate(`/${domain}/first-login-reset-password`);
        return;
      }
      const homePath = getHomePath(domain, response.data.roleId);
      if (!homePath) {
        toast.error("Unauthorized role");
        return;
      }
      navigate(homePath);
    } catch (error: unknown) {
      const errorRecord =
        error && typeof error === "object"
          ? (error as Record<string, unknown>)
          : {};
      const data =
        errorRecord.data && typeof errorRecord.data === "object"
          ? (errorRecord.data as Record<string, unknown>)
          : {};
      const message = data.message ?? "Login failed. Please try again.";

      if (Array.isArray(message)) {
        message.forEach((item) => {
          if (typeof item === "string") toast.error(item);
        });
      } else {
        toast.error(typeof message === "string" ? message : String(message));
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
 
