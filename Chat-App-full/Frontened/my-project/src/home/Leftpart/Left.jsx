import React, { useState } from "react";
import Search from "./Search";
import Users from "./Users";
import Groups from "./Groups";
import Logout from "./Logout";
import "../../index.css";

function Left() {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="w-full bg-black text-gray-300 flex flex-col overflow-auto no-scrollbar h-screen">
      {/* Search */}
      <div className="sticky top-0 bg-black z-10">
        <Search />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 sticky top-[10vh] bg-black z-10">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            activeTab === "chats"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            activeTab === "groups"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Groups
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === "chats" ? <Users /> : <Groups />}
      </div>

      {/* Logout */}
      <div className="sticky bottom-0 bg-black z-10">
        <Logout />
      </div>
    </div>
  );
}

export default Left;
