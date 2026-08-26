import { baseApi } from "@/app/baseApi";
 
import type {
  PunchResponse,
  RecentPunchesResponse,
  FaceStatusResponse,
  EnrollResponse,
  CheckFrameResponse,
  RegistrationStatusResponse,
} from "../types/attendance.types";
 
export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    punchAttendance: builder.mutation<PunchResponse, FormData>({
      query: (formData) => ({
        url: "/employee/attendance/punch",
        method: "POST",
        body: formData,
      }),
    }),
 
    // Checked before the punch camera opens, to decide whether to show
    // the normal punch flow or the "register first" prompt.
    getFaceStatus: builder.query<FaceStatusResponse, void>({
      query: () => ({
        url: "/employee/attendance/face-status",
        method: "GET",
      }),
    }),
 
    // The 5-angle enrollment submission.
    enrollFace: builder.mutation<EnrollResponse, FormData>({
      query: (formData) => ({
        url: "/employee/attendance/enroll",
        method: "POST",
        body: formData,
      }),
    }),
 
    // Backs the "Recent Punches" history slide. Lazy since it's only
    // needed once the employee actually swipes to that slide, not on
    // every modal open.
    getRecentPunches: builder.query<RecentPunchesResponse, void>({
      query: () => ({
        url: "/employee/attendance/recent",
        method: "GET",
      }),
    }),
 
    // Live, per-step feedback during enrollment — one photo at a time,
    // fired right after each capture, BEFORE the real enrollFace
    // submission at the end. Purely informational, never blocks progress.
    checkEnrollmentFrame: builder.mutation<CheckFrameResponse, FormData>({
      query: (formData) => ({
        url: "/employee/attendance/enroll/check-frame",
        method: "POST",
        body: formData,
      }),
    }),
 
    // Backs the "Manage Face Registration" page.
    getRegistrationStatus: builder.query<RegistrationStatusResponse, void>({
      query: () => ({
        url: "/employee/attendance/registration-status",
        method: "GET",
      }),
    }),
 
    // REMOVED — getTodaySummary. That data now comes from the dashboard's
    // getProfile query instead (see dashboardApi.ts) — USP_GetUserInfo
    // merges it in directly, so there's no reason to fetch it twice from
    // two different endpoints.
  }),
});
 
export const {
  usePunchAttendanceMutation,
  useGetFaceStatusQuery,
  useLazyGetFaceStatusQuery,
  useEnrollFaceMutation,
  useLazyGetRecentPunchesQuery,
  useCheckEnrollmentFrameMutation,
  useGetRegistrationStatusQuery,
} = attendanceApi;