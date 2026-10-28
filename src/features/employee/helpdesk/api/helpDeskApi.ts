import { baseApi } from "@/app/baseApi";

import type {
  Department,
  Category,
  SubCategory,
  RaiseTicketRequest,
  RaiseTicketResponse,
  MyTicketsResponse,
  ReplyTicketRequest,
  ReopenTicketRequest,
  TicketActionResponse,
  KnowledgeBaseResponse,
} from "../types/helpDesk.types";

export const helpDeskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ==================================================
    // GET DEPARTMENTS
    // ==================================================

    getDepartments: builder.query<
      Department[],
      void
    >({
      query: () => ({
        url: "/employee/helpdesk/departments",
        method: "GET",
      }),

      providesTags: ["HelpDesk"],
    }),


    // ==================================================
    // GET CATEGORIES
    // ==================================================

    getCategories: builder.query<
      Category[],
      number
    >({
      query: (departmentId) => ({
        url: `/employee/helpdesk/categories/${departmentId}`,
        method: "GET",
      }),

      providesTags: ["HelpDesk"],
    }),


    // ==================================================
    // GET SUB CATEGORIES
    // ==================================================

    getSubCategories: builder.query<
      SubCategory[],
      number
    >({
      query: (categoryId) => ({
        url: `/employee/helpdesk/subcategories/${categoryId}`,
        method: "GET",
      }),

      providesTags: ["HelpDesk"],
    }),


    // ==================================================
    // CREATE TICKET
    // ==================================================

    createTicket: builder.mutation<
      RaiseTicketResponse,
      RaiseTicketRequest
    >({
      query: (body) => ({
        url: "/employee/helpdesk/ticket",
        method: "POST",
        body,
      }),

      invalidatesTags: ["HelpDesk"],
    }),


    // ==================================================
    // GET MY TICKETS
    // ==================================================

    getMyTickets: builder.query<
      MyTicketsResponse,
      void
    >({
      query: () => ({
        url: "/employee/helpdesk/mytickets",
        method: "GET",
      }),

      providesTags: ["HelpDesk"],
    }),


    // ==================================================
    // REPLY TO TICKET
    // ==================================================

    replyTicket: builder.mutation<
      TicketActionResponse,
      ReplyTicketRequest
    >({
      query: ({
        ticketId,
        remarks,
        document,
      }) => {

        const formData = new FormData();

        formData.append(
          "ticketId",
          String(ticketId)
        );

        formData.append(
          "remarks",
          remarks
        );

        if (document) {
          formData.append(
            "document",
            document
          );
        }

        return {
          url: "/employee/helpdesk/reply",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["HelpDesk"],
    }),


    // ==================================================
    // REOPEN TICKET
    // ==================================================

    reopenTicket: builder.mutation<
      TicketActionResponse,
      ReopenTicketRequest
    >({
      query: ({
        ticketId,
        remarks,
        document,
      }) => {

        const formData = new FormData();

        formData.append(
          "ticketId",
          String(ticketId)
        );

        formData.append(
          "remarks",
          remarks
        );

        if (document) {
          formData.append(
            "document",
            document
          );
        }

        return {
          url: "/employee/helpdesk/reopen",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["HelpDesk"],
    }),

    // ==================================================
    // GET KNOWLEDGE BASE
    // ==================================================

    getKnowledgeBase: builder.query<
      KnowledgeBaseResponse,
      void
    >({
      query: () => ({
        url: "/employee/helpdesk/knowledgebase",
        method: "GET",
      }),

      providesTags: ["HelpDesk"],
    }),

  }),
});


export const {
  useGetDepartmentsQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useCreateTicketMutation,
  useGetMyTicketsQuery,
  useReplyTicketMutation,
  useReopenTicketMutation,
  useGetKnowledgeBaseQuery,
} = helpDeskApi;