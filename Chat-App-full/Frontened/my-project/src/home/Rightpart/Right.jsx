import React, { useEffect } from "react";
import Chatuser from "./Chatuser";
import Messages from "./Messages";
import TypeSend from "./TypeSend";
import GroupChatHeader from "./GroupChatHeader";
import GroupMessages from "./GroupMessages";
import GroupTypeSend from "./GroupTypeSend";
import useConversation from "../../zustand/useConversation.js";
import { useAuth } from "../../context/AuthProvider";
import { CiMenuFries } from "react-icons/ci";
import "../../index.css";

function Right() {
  const {
    selectedConversation, setSelectedConversation,
    selectedGroup, setSelectedGroup,
  } = useConversation();

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
      setSelectedGroup(null);
    };
  }, [setSelectedConversation, setSelectedGroup]);

  return (
    <div className="w-full h-screen bg-slate-900 text-gray-300 flex flex-col overflow-hidden">
      {selectedConversation ? (
        // Private chat
        <div className="flex flex-col h-full">
          <Chatuser />
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <Messages />
          </div>
          <div className="flex-shrink-0">
            <TypeSend />
          </div>
        </div>
      ) : selectedGroup ? (
        // Group chat
        <div className="flex flex-col h-full">
          <GroupChatHeader />
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <GroupMessages />
          </div>
          <div className="flex-shrink-0">
            <GroupTypeSend />
          </div>
        </div>
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
}

export default Right;

const NoChatSelected = () => {
  const [authUser] = useAuth();
  return (
    <div className="relative">
      <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden absolute left-5">
        <CiMenuFries className="text-white text-3xl" />
      </label>
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-center">
          Welcome <span className="text-green-400 font-bold">{authUser?.fullname}</span>
          <br />
          Select a chat or group to start conversation
        </h1>
      </div>
    </div>
  );
};
