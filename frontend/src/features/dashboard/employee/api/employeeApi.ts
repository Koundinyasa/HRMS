import { baseApi } from "../../../../app/baseApi";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => ({
        url: "/employee/profile",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
} = employeeApi;