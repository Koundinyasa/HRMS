import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from './apiConfig';
import {
  getLastRefreshAt,
  isRefreshablePath,
  refreshSession,
} from './sessionRefresh';
import {
  passwordChangeRequired,
  sessionExpired,
} from '@/features/auth/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});

const requestPath = (args: string | FetchArgs): string =>
  typeof args === 'string' ? args : args.url;

const canRefresh = (args: string | FetchArgs): boolean =>
  isRefreshablePath(requestPath(args));

const isPasswordChangeRequired = (error: FetchBaseQueryError): boolean => {
  if (error.status !== 403) return false;
  try {
    return JSON.stringify(error.data).toLowerCase().includes('change your password');
  } catch {
    return false;
  }
};

/**
 * Every API call goes through here.
 *  - 401 on a normal call: refresh the session once, then repeat the call once.
 *  - refresh says the session is over: mark the user logged out (the route
 *    guard then sends them to the login page).
 *  - 403 "change your password": remember it so the guard sends the user to
 *    the set-password screen.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const startedAt = Date.now();
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && isPasswordChangeRequired(result.error)) {
    api.dispatch(passwordChangeRequired());
    return result;
  }

  if (result.error?.status !== 401 || !canRefresh(args)) return result;

  // If another request already refreshed after this one started, its cookie is
  // newer than the one this request used, so just repeat the call.
  if (getLastRefreshAt() < startedAt) {
    const outcome = await refreshSession();
    if (outcome === 'expired') {
      api.dispatch(sessionExpired());
      return result;
    }
    if (outcome === 'unavailable') return result;
  }

  result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(sessionExpired());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Leave",
    "AssetRequests",
    "AssetTypes",
    "Separation",
    "HelpDesk",
    "Employees",
    "HolidayMaster",
    "Holiday",
    "WeeklyOff",
    "ForceLeaveApproval",
    "Punch",
    "TAInsights",
    "ClassificationSummary",
    "Branches",
    "Designations",
    "Banks",
    "AdditionalClassifications",
    "BankFieldMapping",
    "SalaryComponents",
    "Recruitment",
    "TimeOffice",
  ],
  endpoints: () => ({}),
});