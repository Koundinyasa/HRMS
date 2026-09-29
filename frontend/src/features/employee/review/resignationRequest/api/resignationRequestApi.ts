import { baseApi } from "@/app/baseApi";

import type {
  CreateResignationRequestPayload,
  ResignationRequest,
  SeparationApprovalPayload,
  UpdateResignationRequestPayload,
} from "../types/resignationRequest.types";

const getValue = (
  row: Record<string, unknown>,
  ...keys: string[]
): unknown => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return undefined;
};

const normalizeRequests = (response: unknown): ResignationRequest[] => {
  const container = Array.isArray(response)
    ? response
    : response && typeof response === "object"
      ? Object.values(response as Record<string, unknown>).find(Array.isArray)
      : undefined;

  if (!Array.isArray(container)) return [];

  return container
    .filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === "object",
    )
    .map((row) => ({
      id: String(
        getValue(row, "ResignationID", "resignationId", "ID", "id") ?? "",
      ),
      requestId: String(
        getValue(row, "ResignationID", "resignationId", "ID", "id") ?? "",
      ),
      employeeId: getValue(row, "EmployeeID", "employeeId") as
        | string
        | number
        | undefined,
      employeeName: String(
        getValue(row, "EmployeeName", "employeeName") ?? "",
      ),
      stageOrder: Number(
        getValue(row, "StageOrder", "CurrentStageOrder", "CurrentLevel") ?? 0,
      ),
      resignationDate: String(
        getValue(row, "ResignationDate", "SubmittedDate", "CreatedDate") ?? "",
      ),
      lastWorkingDate: String(
        getValue(
          row,
          "RequestedLastWorkingDate",
          "LastWorkingDate",
          "requestedLastWorkingDate",
        ) ?? "",
      ),
      reason: String(getValue(row, "Reason", "reason") ?? ""),
      status: String(
        getValue(row, "Status", "RequestStatus", "status") ?? "PENDING",
      ),
      remarks: String(getValue(row, "Remarks", "remarks") ?? ""),
    }));
};

const resignationRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResignationRequests: builder.query<
      ResignationRequest[],
      void
    >({
      query: () => ({
        url: "/employee/separation/approvals",
        method: "GET",
      }),
      transformResponse: normalizeRequests,

      providesTags: ["Separation"],
    }),

    getResignationRequestById: builder.query<
      ResignationRequest,
      string | number
    >({
      query: (id) => ({
        url: `/employee/resignation-requests/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "Separation",
          id,
        },
      ],
    }),

    createResignationRequest: builder.mutation<
      ResignationRequest,
      CreateResignationRequestPayload
    >({
      query: (body) => ({
        url: "/employee/resignation-requests",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Separation"],
    }),

    updateResignationRequest: builder.mutation<
      ResignationRequest,
      UpdateResignationRequestPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/employee/resignation-requests/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Separation"],
    }),

    approveResignationRequest: builder.mutation<
      unknown,
      SeparationApprovalPayload
    >({
      query: (body) => ({
        url: "/employee/separation/approval",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Separation"],
    }),

    rejectResignationRequest: builder.mutation<
      unknown,
      SeparationApprovalPayload
    >({
      query: (body) => ({
        url: "/employee/separation/approval",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Separation"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetResignationRequestsQuery,
  useGetResignationRequestByIdQuery,
  useCreateResignationRequestMutation,
  useUpdateResignationRequestMutation,
  useApproveResignationRequestMutation,
  useRejectResignationRequestMutation,
} = resignationRequestApi;

export default resignationRequestApi;