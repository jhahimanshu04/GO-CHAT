import { useState } from "react";
import axios from "axios";
import useConversation from "../zustand/useConversation.js";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessages = async (message, mediaFile = null) => {
    if (!selectedConversation?._id) {
      console.log("No conversation selected");
      return;
    }

    try {
      setLoading(true);

      let res;

      if (mediaFile) {
        const formData = new FormData();
        if (message?.trim()) formData.append("message", message.trim());
        formData.append("media", mediaFile);

        res = await axios.post(
          `http://localhost:3001/api/message/send/${selectedConversation._id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        res = await axios.post(
          `http://localhost:3001/api/message/send/${selectedConversation._id}`,
          { message },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      // Don't add to messages here — socket will deliver it via useGetSocketMessage
      // This prevents the duplicate/disappear bug
      _ = res; // request succeeded
    } catch (error) {
      console.log("Error in send messages", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;
