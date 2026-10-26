import { baseApi } from "@/app/baseApi";

/* =========================================================
 * Types
 * ========================================================= */

export interface Policy {
  id: string | number;
  policyName?: string;
  name?: string;
  description?: string;
  filter?: string;
  date?: string;
  acknowledgementType?: string;
  file?: string;
  status?: string;
}

export interface Circular {
  id: string | number;
  title?: string;
  description?: string;
  date?: string;
  filter?: string;
  acknowledgementType?: string;
  file?: string;
  status?: string;
}

export interface Notification {
  id: string | number;
  title?: string;
  description?: string;
  date?: string;
  filter?: string;
  status?: string;
}

export interface HelpDesk {
  id: string | number;
  categoryType?: string;
  title?: string;
  description?: string;
  filter?: string;
  status?: string;
}

export interface Poll {
  id: string | number;
  startDate?: string;
  endDate?: string;
  targetAudienceFilter?: string;
  questionType?: string;
  question?: string;
  status?: string;
}

/* =========================================================
 * ESS API
 * ========================================================= */

export const essApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =====================================================
     * Policy
     * ===================================================== */

    getPolicies: builder.query<Policy[], void>({
      query: () => "policies",
    }),

    getPolicyById: builder.query<Policy, string | number>({
      query: (id) => `policies/${id}`,
    }),

    createPolicy: builder.mutation<Policy, Partial<Policy>>({
      query: (body) => ({
        url: "policies",
        method: "POST",
        body,
      }),
    }),

    updatePolicy: builder.mutation<
      Policy,
      { id: string | number; body: Partial<Policy> }
    >({
      query: ({ id, body }) => ({
        url: `policies/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deletePolicy: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `policies/${id}`,
        method: "DELETE",
      }),
    }),

    /* =====================================================
     * Circular
     * ===================================================== */

    getCirculars: builder.query<Circular[], void>({
      query: () => "circulars",
    }),

    getCircularById: builder.query<Circular, string | number>({
      query: (id) => `circulars/${id}`,
    }),

    createCircular: builder.mutation<Circular, Partial<Circular>>({
      query: (body) => ({
        url: "circulars",
        method: "POST",
        body,
      }),
    }),

    updateCircular: builder.mutation<
      Circular,
      { id: string | number; body: Partial<Circular> }
    >({
      query: ({ id, body }) => ({
        url: `circulars/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteCircular: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `circulars/${id}`,
        method: "DELETE",
      }),
    }),

    /* =====================================================
     * Notification
     * ===================================================== */

    getNotifications: builder.query<Notification[], void>({
      query: () => "notifications",
    }),

    getNotificationById: builder.query<Notification, string | number>({
      query: (id) => `notifications/${id}`,
    }),

    createNotification: builder.mutation<
      Notification,
      Partial<Notification>
    >({
      query: (body) => ({
        url: "notifications",
        method: "POST",
        body,
      }),
    }),

    updateNotification: builder.mutation<
      Notification,
      { id: string | number; body: Partial<Notification> }
    >({
      query: ({ id, body }) => ({
        url: `notifications/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteNotification: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: "DELETE",
      }),
    }),

    /* =====================================================
     * HelpDesk
     * ===================================================== */

    getHelpDeskItems: builder.query<HelpDesk[], void>({
      query: () => "helpdesk",
    }),

    getHelpDeskById: builder.query<HelpDesk, string | number>({
      query: (id) => `helpdesk/${id}`,
    }),

    createHelpDesk: builder.mutation<
      HelpDesk,
      Partial<HelpDesk>
    >({
      query: (body) => ({
        url: "helpdesk",
        method: "POST",
        body,
      }),
    }),

    updateHelpDesk: builder.mutation<
      HelpDesk,
      { id: string | number; body: Partial<HelpDesk> }
    >({
      query: ({ id, body }) => ({
        url: `helpdesk/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteHelpDesk: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `helpdesk/${id}`,
        method: "DELETE",
      }),
    }),

    /* =====================================================
     * Poll
     * ===================================================== */

    getPolls: builder.query<Poll[], void>({
      query: () => "polls",
    }),

    getPollById: builder.query<Poll, string | number>({
      query: (id) => `polls/${id}`,
    }),

    createPoll: builder.mutation<Poll, Partial<Poll>>({
      query: (body) => ({
        url: "polls",
        method: "POST",
        body,
      }),
    }),

    updatePoll: builder.mutation<
      Poll,
      { id: string | number; body: Partial<Poll> }
    >({
      query: ({ id, body }) => ({
        url: `polls/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deletePoll: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `polls/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

/* =========================================================
 * Hooks
 * ========================================================= */

export const {
  // Policy
  useGetPoliciesQuery,
  useGetPolicyByIdQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,

  // Circular
  useGetCircularsQuery,
  useGetCircularByIdQuery,
  useCreateCircularMutation,
  useUpdateCircularMutation,
  useDeleteCircularMutation,

  // Notification
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,

  // HelpDesk
  useGetHelpDeskItemsQuery,
  useGetHelpDeskByIdQuery,
  useCreateHelpDeskMutation,
  useUpdateHelpDeskMutation,
  useDeleteHelpDeskMutation,

  // Poll
  useGetPollsQuery,
  useGetPollByIdQuery,
  useCreatePollMutation,
  useUpdatePollMutation,
  useDeletePollMutation,
} = essApi;