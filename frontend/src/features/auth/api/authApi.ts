import axiosInstance from '../../../services/axios';
import type {LoginRequest,LoginResponse,CaptchaResponse} from '../types/auth.types';

export const getCaptchaApi = async (): Promise<CaptchaResponse> => {
  const response = await axiosInstance.get('/auth/captcha');
  return response.data;
};

export const loginApi = async (
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/login', payload);
  return response.data;
};