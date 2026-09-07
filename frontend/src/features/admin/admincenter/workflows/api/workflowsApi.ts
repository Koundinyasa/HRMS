import { baseApi } from "@/app/baseApi";
import type { WorkflowItem, WorkflowModule, WorkflowLevel } from "../types/workflowTypes";

export const workflowsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkflowsByModule: builder.query<WorkflowItem[], WorkflowModule>({
      query: (module) => `workflows/${module}`,
    }),

    createWorkflow: builder.mutation<WorkflowItem, Partial<WorkflowItem>>({
      query: (body) => ({
        url: "workflows",
        method: "POST",
        body,
      }),
    }),

    deleteWorkflow: builder.mutation<void, string>({
      query: (id) => ({
        url: `workflows/${id}`,
        method: "DELETE",
      }),
    }),

    addWorkflowLevel: builder.mutation<
      void,
      { workflowId: string; body: Partial<WorkflowLevel> }
    >({
      query: ({ workflowId, body }) => ({
        url: `workflows/${workflowId}/levels`,
        method: "POST",
        body,
      }),
    }),

    deleteWorkflowLevel: builder.mutation<
      void,
      { workflowId: string; levelId: string }
    >({
      query: ({ workflowId, levelId }) => ({
        url: `workflows/${workflowId}/levels/${levelId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetWorkflowsByModuleQuery,
  useCreateWorkflowMutation,
  useDeleteWorkflowMutation,
  useAddWorkflowLevelMutation,
  useDeleteWorkflowLevelMutation,
} = workflowsApi;