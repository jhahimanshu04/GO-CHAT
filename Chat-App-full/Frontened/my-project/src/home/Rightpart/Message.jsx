import React, { useState } from "react";
import "../../index.css";

function Message({ message }) {
  if (!message) return null;
  const [imgOpen, setImgOpen] = useState(false);

  const authUser = JSON.parse(localStorage.getItem("ChatAppUser"));
  const itsMe = authUser && String(message.senderId) === String(authUser._id);

  const chatName = itsMe ? "chat-end" : "chat-start";
  const bubbleColor = itsMe ? "bg-green-500 text-white" : "bg-yellow-300 text-black";

  const createdAt = new Date(message.createdAt);
  const formattedTime = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderMedia = () => {
    if (!message.mediaUrl) return null;

    if (message.mediaType === "image") {
      return (
        <>
          <img
            src={message.mediaUrl}
            alt="shared media"
            className="max-w-[220px] max-h-[220px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setImgOpen(true)}
          />
          {/* Lightbox */}
          {imgOpen && (
            <div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setImgOpen(false)}
            >
              <img
                src={message.mediaUrl}
                alt="full size"
                className="max-w-full max-h-full rounded-xl shadow-2xl"
              />
            </div>
          )}
        </>
      );
    }

    if (message.mediaType === "video") {
      return (
        <video
          src={message.mediaUrl}
          controls
          className="max-w-[280px] rounded-xl"
        />
      );
    }

    if (message.mediaType === "file") {
      const fileName = message.mediaUrl.split("/").pop().split("?")[0];
      return (
        <a
          href={message.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 underline text-blue-200 hover:text-blue-100"
        >
          <span>📎</span>
          <span className="text-sm truncate max-w-[180px]">{decodeURIComponent(fileName)}</span>
        </a>
      );
    }

    return null;
  };

  return (
    <div className="p-2 px-4">
      <div className={`chat ${chatName}`}>
        <div className={`chat-bubble ${bubbleColor} max-w-[320px] flex flex-col gap-1`}>
          {renderMedia()}
          {message.message && (
            <p className={message.mediaUrl ? "mt-1 text-sm" : ""}>{message.message}</p>
          )}
        </div>
        <div className="chat-footer text-xs opacity-60">{formattedTime}</div>
      </div>
    </div>
  );
}

export default Message;
