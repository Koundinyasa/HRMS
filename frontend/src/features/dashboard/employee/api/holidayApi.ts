import { baseApi } from "../../../../app/baseApi";

export const holidayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHolidayList: builder.query<any, void>({
      query: () => ({
        url: "/holiday/list",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetHolidayListQuery,
} = holidayApi;