import { baseApi } from "@/app/baseApi";

const REG_BASE = "admin/timeattendance/timeoffice/regularization";

interface PunchBody {
  punchType: "In" | "Out";
  time: string;
  remarks?: string;
}

// Used by both the admin Daily Log and the employee Review > Punch screen, so it
// lives here and not under features/admin.
export const dailyLogPunchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDailyLogPunch: builder.mutation<void, { employeeId: string; date: string } & PunchBody>({
      query: ({ employeeId, ...body }) => ({
        url: `${REG_BASE}/attendance/dailylog/punch`,
        method: "POST",
        params: { employeeId },
        body,
      }),
      invalidatesTags: [{ type: "TimeOffice", id: "DAILY_LOG" }],
    }),
  }),
});

export const { useAddDailyLogPunchMutation } = dailyLogPunchApi;
