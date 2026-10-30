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
    "ApprovalSummary",
  ],
  endpoints: () => ({}),
});