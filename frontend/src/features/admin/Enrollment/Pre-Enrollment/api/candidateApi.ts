import { baseApi } from "@/app/baseApi";

import type {
  Candidate,
  CandidateDashboardStats,
  CandidateForm,
  CompletedCandidateRow,
  ImportCandidateRow,
  OffboardCandidate,
  PreEnrollmentSettings,
} from "../types/preEnrollment.types";

export const candidateApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // ==================================================
    // DASHBOARD
    // ==================================================

    getDashboard: builder.query<
      CandidateDashboardStats,
      void
    >({

      query: () => ({
        url: "/admin/pre-enrollment/dashboard",
        method: "GET",
      }),

      providesTags: ["Candidate"],
    }),


    // ==================================================
    // GET CANDIDATES
    // ==================================================

    getCandidates: builder.query<
      Candidate[],
      void
    >({

      query: () => ({
        url: "/admin/pre-enrollment/candidate",
        method: "GET",
      }),

      providesTags: ["Candidate"],
    }),


    // ==================================================
    // ADD CANDIDATE
    // ==================================================

    addCandidate: builder.mutation<
      Candidate,
      CandidateForm
    >({

      query: (body) => ({
        url: "/admin/pre-enrollment/candidate",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Candidate"],
    }),


    // ==================================================
    // UPDATE CANDIDATE
    // ==================================================

    updateCandidate: builder.mutation<
      Candidate,
      {
        candidateId: number;
        body: Partial<CandidateForm>;
      }
    >({

      query: ({
        candidateId,
        body,
      }) => ({
        url: `/admin/pre-enrollment/candidate/${candidateId}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Candidate"],
    }),


    // ==================================================
    // GET COMPLETED CANDIDATES
    // ==================================================

    getCompletedCandidates: builder.query<
      CompletedCandidateRow[],
      void
    >({

      query: () => ({
        url: "/admin/pre-enrollment/completed-candidate",
        method: "GET",
      }),

      providesTags: ["Candidate"],
    }),


    // ==================================================
    // GET OFFBOARDED CANDIDATES
    // ==================================================

    getOffboardedCandidates: builder.query<
      OffboardCandidate[],
      void
    >({

      query: () => ({
        url: "/admin/pre-enrollment/offboard",
        method: "GET",
      }),

      providesTags: ["Candidate"],
    }),


    // ==================================================
    // OFFBOARD CANDIDATE
    // ==================================================

    offboardCandidate: builder.mutation<
      OffboardCandidate,
      OffboardCandidate
    >({

      query: (body) => ({
        url: "/admin/pre-enrollment/offboard",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Candidate"],
    }),


    // ==================================================
    // UPDATE OFFBOARD CANDIDATE
    // ==================================================

    updateOffboardCandidate: builder.mutation<
      OffboardCandidate,
      {
        candidateId: number;
        body: Partial<OffboardCandidate>;
      }
    >({

      query: ({
        candidateId,
        body,
      }) => ({
        url: `/admin/pre-enrollment/offboard/${candidateId}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Candidate"],
    }),


    // ==================================================
    // GET SETTINGS
    // ==================================================

    getSettings: builder.query<
      PreEnrollmentSettings,
      void
    >({

      query: () => ({
        url: "/admin/pre-enrollment/settings",
        method: "GET",
      }),

      providesTags: ["Candidate"],
    }),


    // ==================================================
    // UPDATE SETTINGS
    // ==================================================

    updateSettings: builder.mutation<
      PreEnrollmentSettings,
      PreEnrollmentSettings
    >({

      query: (body) => ({
        url: "/admin/pre-enrollment/settings",
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Candidate"],
    }),


    // ==================================================
    // GET IMPORT
    // ==================================================

    getImport: builder.query<
      ImportCandidateRow[],
      void
    >({

      query: () => ({
        url: "/admin/pre-enrollment/import",
        method: "GET",
      }),

      providesTags: ["Candidate"],
    }),


    // ==================================================
    // IMPORT CANDIDATES
    // ==================================================

    importCandidates: builder.mutation<
      ImportCandidateRow,
      FormData
    >({

      query: (body) => ({
        url: "/admin/pre-enrollment/import",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Candidate"],
    }),

  }),
});


export const {

  // Dashboard

  useGetDashboardQuery,


  // Candidates

  useGetCandidatesQuery,

  useAddCandidateMutation,

  useUpdateCandidateMutation,


  // Completed

  useGetCompletedCandidatesQuery,


  // Offboard

  useGetOffboardedCandidatesQuery,

  useOffboardCandidateMutation,

  useUpdateOffboardCandidateMutation,


  // Settings

  useGetSettingsQuery,

  useUpdateSettingsMutation,


  // Import

  useGetImportQuery,

  useImportCandidatesMutation,

} = candidateApi;
