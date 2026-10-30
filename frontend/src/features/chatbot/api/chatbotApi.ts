import { baseApi } from "@/app/baseApi";

import type {
  ChatRequest,
  ChatResponse,
} from "../types/chatbot.types";

export const chatbotApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    sendMessage: builder.mutation<
      ChatResponse,
      ChatRequest
    >({
      query: (body) => ({
        url: "/chatbot/chat",
        method: "POST",
        body,
      }),

      // A leave applied or cancelled in the chat must show up on the Leave
      // pages straight away, so their cached data is marked out of date.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.refresh?.includes("leave")) {
            dispatch(baseApi.util.invalidateTags(["Leave"]));
          }
        } catch {
          // the chat error is shown by the caller
        }
      },
    }),

    resetConversation: builder.mutation<
      { success: boolean },
      void
    >({
      query: () => ({
        url: "/chatbot/reset",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSendMessageMutation,
  useResetConversationMutation,
} = chatbotApi;