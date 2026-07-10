import { baseApi } from "@/app/baseApi";

import type {
  ChatRequest,
  ChatResponse,
} from "../types/chatbot.types";



export const chatbotApi = baseApi.injectEndpoints({
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
  }),
});

export const {
  useSendMessageMutation,
} = chatbotApi;