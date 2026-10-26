import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  FinalSettlement,
  GratuityDetails,
  SeparationEmployee,
  SeparationFormData,
  SeparationResponse,
} from "../types/separationTypes";

export const separationApi = createApi({
  reducerPath: "separationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),

  tagTypes: ["Separation", "Settlement", "Gratuity"],

  endpoints: (builder) => ({
    getSeparationEmployees: builder.query<
      SeparationResponse,
      {
        search?: string;
        status?: string;
        separationType?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/separation",
        method: "GET",
        params,
      }),

      providesTags: ["Separation"],
    }),

    getSeparationEmployeeById: builder.query<
      SeparationEmployee,
      string
    >({
      query: (id) => `/separation/${id}`,

      providesTags: (_result, _error, id) => [
        {
          type: "Separation",
          id,
        },
      ],
    }),

    createSeparation: builder.mutation<
      SeparationEmployee,
      SeparationFormData
    >({
      query: (body) => ({
        url: "/separation",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Separation"],
    }),

    updateSeparation: builder.mutation<
      SeparationEmployee,
      {
        id: string;
        data: Partial<SeparationFormData>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/separation/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["Separation"],
    }),

    deleteSeparation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/separation/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Separation"],
    }),

    getFinalSettlements: builder.query<
      FinalSettlement[],
      void
    >({
      query: () => "/separation/full-final",

      providesTags: ["Settlement"],
    }),

    getGratuityDetails: builder.query<
      GratuityDetails[],
      void
    >({
      query: () => "/separation/gratuity",

      providesTags: ["Gratuity"],
    }),
  }),
});

export const {
  useGetSeparationEmployeesQuery,
  useGetSeparationEmployeeByIdQuery,
  useCreateSeparationMutation,
  useUpdateSeparationMutation,
  useDeleteSeparationMutation,
  useGetFinalSettlementsQuery,
  useGetGratuityDetailsQuery,
} = separationApi;