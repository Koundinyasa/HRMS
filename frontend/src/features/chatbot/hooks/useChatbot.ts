import { useSendMessageMutation } from "../api/chatbotApi";



export const useChatbot = () => {
  const [sendMessage, { isLoading }] =
    useSendMessageMutation();

  const sendChat = async (
    message: string
  ) => {
    return sendMessage({
  message,
}).unwrap();
  };

  return {
    sendChat,
    isLoading,
  };
};


