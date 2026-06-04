import api from "./axios";

export const sendChatMessage = async (message, chatHistory = []) => {
  const { data } = await api.post("/chat", { message, chatHistory });
  return data;
};
