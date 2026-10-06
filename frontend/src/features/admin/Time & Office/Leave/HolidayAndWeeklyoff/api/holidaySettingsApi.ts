import { baseApi } from "@/app/baseApi"; // ⚠️ adjust to wherever baseApi.ts actually lives

export interface HolidayMaster {
  id: number;
  label: string;
}

export interface Holiday {
  id: number;
  masterId: number;
  holidayName: string;
  holidayDate: string;
  isNationalHoliday: boolean;
  isRestrictedHoliday: boolean;
}

export interface HolidayListQuery {
  masterId: number;
  yearType: "calendar" | "financial";
  year: number;
  month?: number;
}

export interface HolidayCreatePayload {
  masterId: number;
  holidayName: string;
  holidayDate: string;
  isNationalHoliday: boolean;
  isRestrictedHoliday: boolean;
}

export interface HolidayUpdatePayload extends HolidayCreatePayload {
  id: number;
}

export const holidaySettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHolidayMasters: builder.query<HolidayMaster[], void>({
      query: () => ({
        url: "/api/admin/ta/leave/holidaysettings/weeklyoff",
        method: "GET",
      }),
      providesTags: ["HolidayMaster"],
    }),

    listHolidays: builder.query<Holiday[], HolidayListQuery>({
      query: (body) => ({
        url: "/api/admin/ta/leave/holidaysettings/list",
        method: "POST",
        body,
      }),
      providesTags: ["Holiday"],
    }),

    updateHoliday: builder.mutation<Holiday, HolidayUpdatePayload>({
      query: (body) => ({
        url: "/api/admin/ta/leave/holidaysettings/update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Holiday"],
    }),

    createHoliday: builder.mutation<Holiday, HolidayCreatePayload>({
      query: (body) => ({
        url: "/api/admin/ta/leave/holidaysettings/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Holiday"],
    }),

    importHolidays: builder.mutation<void, { masterId: number; file: File }>({
      query: ({ masterId, file }) => {
        const formData = new FormData();
        formData.append("masterId", String(masterId));
        formData.append("file", file);
        return {
          url: "/api/admin/ta/leave/holidaysettings/import",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Holiday"],
    }),

    // ⚠️ ASSUMED — no delete endpoint was given. Confirm/replace the URL.
    deleteHoliday: builder.mutation<void, { id: number }>({
      query: (body) => ({
        url: "/api/admin/ta/leave/holidaysettings/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Holiday"],
    }),

    
  }),
});

export const {
  useGetHolidayMastersQuery,
  useListHolidaysQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useImportHolidaysMutation,
  useDeleteHolidayMutation,
} = holidaySettingsApi;