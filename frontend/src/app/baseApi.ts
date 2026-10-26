import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
    credentials: 'include',
  }),
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
  ],
  endpoints: () => ({}),
});