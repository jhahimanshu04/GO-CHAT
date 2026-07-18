import { useState } from "react";
import axios from "axios";
import useConversation from "../zustand/useConversation.js";

function useSendGroupMessage() {
  const [loading, setLoading] = useState(false);
  const { selectedGroup } = useConversation();

  const sendGroupMessage = async (message, mediaFile = null) => {
    if (!selectedGroup?._id) return;

    try {
      setLoading(true);

      if (mediaFile) {
        const formData = new FormData();
        if (message?.trim()) formData.append("message", message.trim());
        formData.append("media", mediaFile);

        await axios.post(
          `http://localhost:3001/api/group/send/${selectedGroup._id}`,
          formData,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
      } else {
        await axios.post(
          `http://localhost:3001/api/group/send/${selectedGroup._id}`,
          { message },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
      }
    } catch (error) {
      console.error("Error sending group message:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendGroupMessage };
}

export default useSendGroupMessage;
