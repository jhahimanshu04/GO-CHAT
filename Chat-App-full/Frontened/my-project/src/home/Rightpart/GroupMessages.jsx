import React, { useRef, useEffect } from "react";
import useGetGroupMessages from "../../context/useGetGroupMessages.js";
import useGetSocketMessage from "../../context/useGetSocketMessage.jsx";
import Loading from "../../components/Loading.jsx";

function GroupMessages() {
  const { loading, groupMessages } = useGetGroupMessages();
  useGetSocketMessage();

  const lastMsgRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      if (lastMsgRef.current) lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [groupMessages]);

  const authUser = JSON.parse(localStorage.getItem("ChatAppUser"));
  const safeMessages = Array.isArray(groupMessages) ? groupMessages : [];

  const renderMedia = (msg) => {
    if (!msg.mediaUrl) return null;
    if (msg.mediaType === "image") {
      return (
        <img
          src={msg.mediaUrl}
          alt="media"
          className="max-w-[220px] max-h-[220px] rounded-xl object-cover cursor-pointer"
          onClick={() => window.open(msg.mediaUrl, "_blank")}
        />
      );
    }
    if (msg.mediaType === "video") {
      return <video src={msg.mediaUrl} controls className="max-w-[280px] rounded-xl" />;
    }
    if (msg.mediaType === "file") {
      return (
        <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-200 text-sm">
          📎 {decodeURIComponent(msg.mediaUrl.split("/").pop())}
        </a>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-2">
      {loading ? (
        <Loading />
      ) : safeMessages.length === 0 ? (
        <p className="text-center text-gray-400 mt-[20%]">Say Hi to Start the Conversation</p>
      ) : (
        safeMessages.map((msg) => {
          const senderId = msg.senderId?._id || msg.senderId;
          const itsMe = String(senderId) === String(authUser?._id);
          const senderName = msg.senderId?.fullname || "Unknown";

          return (
            <div key={msg._id} className={`flex flex-col mb-2 ${itsMe ? "items-end" : "items-start"}`}>
              {/* Sender name for group chat */}
              {!itsMe && (
                <span className="text-xs text-blue-400 px-2 mb-1">{senderName}</span>
              )}
              <div
                className={`max-w-[320px] px-4 py-2 rounded-2xl flex flex-col gap-1 ${
                  itsMe ? "bg-green-500 text-white" : "bg-yellow-300 text-black"
                }`}
              >
                {renderMedia(msg)}
                {msg.message && <p className="text-sm">{msg.message}</p>}
              </div>
              <span className="text-xs text-gray-400 px-2 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })
      )}
      <div ref={lastMsgRef} />
    </div>
  );
}

export default GroupMessages;
