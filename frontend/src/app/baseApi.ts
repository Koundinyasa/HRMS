import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';
 
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
    "Holiday",
    "WeeklyOff",
    "ForceLeaveApproval",
    "Punch",
    "TimeOffice",
    "ApprovalSummary",
    "Candidate",
    "Payroll",
  ],
  endpoints: () => ({}),
});