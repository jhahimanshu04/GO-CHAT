import { useEffect } from "react";
import { useSocketContext } from "./SocketContext.jsx";
import useConversation from "../zustand/useConversation.js";
import sound from "../assets/notification.mp3";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation, selectedGroup, groupMessages, setGroupMessages } = useConversation();

  useEffect(() => {
    if (!socket) return;

    // Private message
    socket.on("newMessage", (newMessage) => {
      const authUser = JSON.parse(localStorage.getItem("ChatAppUser"));
      if (String(newMessage.senderId) !== String(authUser?._id)) {
        new Audio(sound).play();
      }
      const isRelevant =
        String(newMessage.senderId) === String(selectedConversation?._id) ||
        String(newMessage.receiverId) === String(selectedConversation?._id);
      if (isRelevant) setMessages([...messages, newMessage]);
    });

    // Group message
    socket.on("newGroupMessage", ({ groupId, message: newMsg }) => {
      const authUser = JSON.parse(localStorage.getItem("ChatAppUser"));
      if (String(newMsg.senderId?._id || newMsg.senderId) !== String(authUser?._id)) {
        new Audio(sound).play();
      }
      if (String(groupId) === String(selectedGroup?._id)) {
        setGroupMessages([...groupMessages, newMsg]);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("newGroupMessage");
    };
  }, [socket, messages, setMessages, selectedConversation, selectedGroup, groupMessages, setGroupMessages]);

  return null;
};

export default useGetSocketMessage;
