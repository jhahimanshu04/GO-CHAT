import React from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { CiMenuFries } from "react-icons/ci";


function Chatuser () {
  const { selectedConversation } = useConversation();
  const {  OnlineUsers } = useSocketContext();
  // console.log(selectedConversation);
 const isOnline =
    selectedConversation && OnlineUsers.includes(selectedConversation._id); 




  const getOnlineUsersStatus=(userId)=>{
     if (!userId) return "Offline"; 
    return OnlineUsers.includes(userId )? "Online" : "Offline"
  };
  return (
    <div className="relative flex-1 items-center h-[8%] justify-center gap-4 bg-slate-800 hover:bg-slate-700 duration-300 rounded-md">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost drawer-button lg:hidden absolute left-5"
      >
        <CiMenuFries className="text-white text-3xl" />
      </label>
  
      <div className="flex  space-x-3 items-center justify-center p-1  bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out cursor-pointer mt-1 ml-1 mr-1 h-[8vh] ">
        <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
          </div>
        </div>
        <div>
          <h1 className="text-xl">
            {/* {selectedConversation?.fullname || null} */}
            {selectedConversation?.fullname || "Select a conversation"} 
          </h1>
          <span className="text-sm">{getOnlineUsersStatus(selectedConversation?._id)}</span>
        </div>
      </div>
       </div>
    
  );
};

export default Chatuser;
