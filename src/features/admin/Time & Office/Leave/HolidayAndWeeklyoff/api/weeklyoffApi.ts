import { baseApi } from "@/app/baseApi"; 

export type DayOfWeek =
  | "Sunday" | "Monday" | "Tuesday" | "Wednesday"
  | "Thursday" | "Friday" | "Saturday";

export interface WeekHalfFlags {
  firstHalf: boolean;
  secondHalf: boolean;
}

export interface WeeklyOff {
  id: number;
  masterId: number;
  effectiveFrom: string; // e.g. "Feb/2026"
  dayOfWeek: DayOfWeek;
  week1: WeekHalfFlags;
  week2: WeekHalfFlags;
  week3: WeekHalfFlags;
  week4: WeekHalfFlags;
  week5: WeekHalfFlags;
}

export interface WeeklyOffListQuery {
  masterId: number;
  month: number; // 1-12
  year: number;
}

export interface WeeklyOffPayload {
  masterId: number;
  effectiveFrom: string;
  dayOfWeek: DayOfWeek;
  week1: WeekHalfFlags;
  week2: WeekHalfFlags;
  week3: WeekHalfFlags;
  week4: WeekHalfFlags;
  week5: WeekHalfFlags;
}

export interface WeeklyOffUpdatePayload extends WeeklyOffPayload {
  id: number;
}

export const weeklyOffSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWeeklyOffs: builder.query<WeeklyOff[], WeeklyOffListQuery>({
      query: (body) => ({
        url: "/api/admin/ta/leave/weeklyoffsettings/list",
        method: "POST",
        body,
      }),
      providesTags: ["WeeklyOff"],
    }),

    createWeeklyOff: builder.mutation<WeeklyOff, WeeklyOffPayload>({
      query: (body) => ({
        url: "/api/admin/ta/leave/weeklyoffsettings/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WeeklyOff"],
    }),

    updateWeeklyOff: builder.mutation<WeeklyOff, WeeklyOffUpdatePayload>({
      query: (body) => ({
        url: "/api/admin/ta/leave/weeklyoffsettings/update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WeeklyOff"],
    }),

    // ⚠️ ASSUMED — confirm/replace
    deleteWeeklyOff: builder.mutation<void, { id: number }>({
      query: (body) => ({
        url: "/api/admin/ta/leave/weeklyoffsettings/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WeeklyOff"],
    }),
  }),
});

export const {
  useListWeeklyOffsQuery,
  useCreateWeeklyOffMutation,
  useUpdateWeeklyOffMutation,
  useDeleteWeeklyOffMutation,
} = weeklyOffSettingsApi;