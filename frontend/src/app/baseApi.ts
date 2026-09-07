
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
 
export const baseApi = createApi({
  reducerPath: "api",
 
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: [
    "Leave",
    "AssetRequests",
    "AssetTypes",
     "Separation",
     "HelpDesk",

  ],

  endpoints: () => ({}),
});

