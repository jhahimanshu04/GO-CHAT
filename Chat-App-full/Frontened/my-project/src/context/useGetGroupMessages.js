import { useEffect, useState } from "react";
import axios from "axios";
import useConversation from "../zustand/useConversation.js";

function useGetGroupMessages() {
  const [loading, setLoading] = useState(false);
  const { selectedGroup, groupMessages, setGroupMessages } = useConversation();

  useEffect(() => {
    if (!selectedGroup?._id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3001/api/group/messages/${selectedGroup._id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setGroupMessages(res.data);
      } catch (error) {
        console.error("Error fetching group messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedGroup, setGroupMessages]);

  return { loading, groupMessages };
}

export default useGetGroupMessages;
