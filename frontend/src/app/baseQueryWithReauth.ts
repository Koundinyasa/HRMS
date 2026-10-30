import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { API_BASE_URL } from './apiConfig';
import {
  getLastRefreshAt,
  getLastSessionEndCode,
  isRefreshablePath,
  notifySessionExpired,
  refreshSession,
} from './sessionRefresh';
import { passwordChangeRequired } from '../features/auth/authSlice';
import { AuthErrorCode, isSessionEndCode } from '../features/auth/constants/authErrorCodes';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});

/** The path part of the request, always starting with "/". */
function pathOf(args: string | FetchArgs): string {
  const url = typeof args === 'string' ? args : args.url;
  return url.startsWith('/') ? url : `/${url}`;
}

function errorCodeOf(error: FetchBaseQueryError | undefined): string | undefined {
  const data = error?.data;
  if (data && typeof data === 'object' && 'code' in data) {
    const code = (data as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

/**
 * The base query for every RTK Query endpoint.
 *
 * The access cookie lives only 15 minutes. When a request answers 401:
 *  1. ask the server for a new access cookie (all failing requests share one
 *     refresh call),
 *  2. repeat the request once,
 *  3. if the session is really over, mark the user as logged out.
 *
 * A 403 with code PASSWORD_CHANGE_REQUIRED sends the user to the
 * change-password screen.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const startedAt = Date.now();
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && isRefreshablePath(pathOf(args))) {
    // The server already said this login is over (replaced, logged out, timed
    // out): renewing it cannot work, so go straight to signing out.
    const firstCode = errorCodeOf(result.error);
    if (isSessionEndCode(firstCode)) {
      notifySessionExpired(firstCode);
      return result;
    }

    // Another request may already have refreshed after this one started;
    // then its cookie is fresh and only a retry is needed.
    if (getLastRefreshAt() < startedAt) {
      const outcome = await refreshSession();
      if (outcome === 'expired') {
        notifySessionExpired(getLastSessionEndCode());
        return result;
      }
      // Server or network trouble: keep the user logged in, show the error.
      if (outcome === 'unavailable') return result;
    }

    result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401) notifySessionExpired(errorCodeOf(result.error));
  }

  if (
    result.error?.status === 403 &&
    errorCodeOf(result.error) === AuthErrorCode.PASSWORD_CHANGE_REQUIRED
  ) {
    api.dispatch(passwordChangeRequired());
  }

  return result;
};
