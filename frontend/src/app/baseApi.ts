import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: async () => {
    return { data: {} };
  },

  endpoints: () => ({}),
});