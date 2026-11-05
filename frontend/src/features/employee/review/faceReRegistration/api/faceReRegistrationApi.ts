import { baseApi } from "@/app/baseApi";

import type {
  FaceReRegistrationActionResponse,
  FaceReRegistrationRequest,
  FaceReRegistrationStatusFilter,
} from "../types/faceReRegistration.types";

const faceReRegistrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Requests routed to the signed-in Reporting Manager.
    getFaceReRegistrationRequests: builder.query<
      FaceReRegistrationRequest[],
      FaceReRegistrationStatusFilter
    >({
      query: (status) => ({
        url: "/review/face-reregistration",
        method: "GET",
        params: status === "All" ? undefined : { status },
      }),
      providesTags: ["FaceReRegistration"],
    }),

    approveFaceReRegistration: builder.mutation<
      FaceReRegistrationActionResponse,
      number
    >({
      query: (id) => ({
        url: `/review/face-reregistration/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["FaceReRegistration", "ApprovalSummary"],
    }),

    rejectFaceReRegistration: builder.mutation<
      FaceReRegistrationActionResponse,
      { id: number; rejectionReason: string }
    >({
      query: ({ id, rejectionReason }) => ({
        url: `/review/face-reregistration/${id}/reject`,
        method: "POST",
        body: { rejectionReason },
      }),
      invalidatesTags: ["FaceReRegistration", "ApprovalSummary"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFaceReRegistrationRequestsQuery,
  useApproveFaceReRegistrationMutation,
  useRejectFaceReRegistrationMutation,
} = faceReRegistrationApi;

export default faceReRegistrationApi;
