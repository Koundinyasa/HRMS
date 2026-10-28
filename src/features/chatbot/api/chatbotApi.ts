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