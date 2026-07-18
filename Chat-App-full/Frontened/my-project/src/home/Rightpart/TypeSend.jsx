import React, { useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { MdAttachFile, MdClose } from "react-icons/md";
import useSendMessage from "../../context/useSendMessage.js";

function TypeSend() {
  const [message, setMessages] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { loading, sendMessages } = useSendMessage();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    await sendMessages(message, selectedFile);
    setMessages("");
    clearFile();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Media preview bar */}
      {selectedFile && (
        <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 border-t border-gray-600">
          {previewUrl && selectedFile.type.startsWith("image/") && (
            <img
              src={previewUrl}
              alt="preview"
              className="h-14 w-14 object-cover rounded-lg border border-gray-500"
            />
          )}
          {previewUrl && selectedFile.type.startsWith("video/") && (
            <video
              src={previewUrl}
              className="h-14 w-20 object-cover rounded-lg border border-gray-500"
            />
          )}
          {!previewUrl && (
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <MdAttachFile className="text-gray-300 text-xl" />
              <span className="text-gray-300 text-sm truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={clearFile}
            className="ml-auto text-gray-400 hover:text-white"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2 h-[8vh] bg-gray-700 px-4">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Attach button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-300 hover:text-white transition-colors flex-shrink-0"
          title="Attach image, video, or PDF"
        >
          <MdAttachFile className="text-3xl" />
        </button>

        {/* Text input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder={selectedFile ? "Add a caption..." : "Type here"}
            value={message}
            onChange={(e) => setMessages(e.target.value)}
            className="w-full input bg-black border-gray-500 outline-none px-4 py-3 text-white rounded-xl"
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={loading || (!message.trim() && !selectedFile)}
          className="flex-shrink-0 disabled:opacity-40"
        >
          {loading ? (
            <span className="loading loading-spinner text-white text-xl" />
          ) : (
            <IoMdSend className="text-4xl text-white hover:text-green-400 transition-colors" />
          )}
        </button>
      </div>
    </form>
  );
}

export default TypeSend;
