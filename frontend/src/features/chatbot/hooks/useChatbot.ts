import { useCallback } from "react";
import { useSendMessageMutation } from "../api/chatbotApi";

export const useChatbot = () => {
  const [sendMessage, { isLoading }] =
    useSendMessageMutation();

  const sendChat = useCallback(
    (message: string) => sendMessage({ message }).unwrap(),
    [sendMessage],
  );

  return {
    sendChat,
    isLoading,
  };
};
