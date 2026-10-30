import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/app/apiConfig';
import {
  isRefreshablePath,
  notifySessionExpired,
  refreshSession,
} from '@/app/sessionRefresh';

// Shared axios client. Login travels in httpOnly cookies, so there is no token
// to attach here: just send cookies, and renew the session once on a 401.
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !config ||
      !isRefreshablePath(config.url ?? '')
    ) {
      return Promise.reject(error);
    }

    // The repeated request was refused as well: the session is really over.
    if (config._retried) {
      notifySessionExpired();
      return Promise.reject(error);
    }

    config._retried = true;
    const outcome = await refreshSession();

    if (outcome === 'expired') {
      notifySessionExpired();
      return Promise.reject(error);
    }
    if (outcome === 'unavailable') return Promise.reject(error);

    return api.request(config);
  },
);

export default api;
