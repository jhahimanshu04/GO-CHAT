import React from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
// import {SocketProvider} from "../../context/SocketContext.jsx";

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { socket , OnlineUsers}=useSocketContext();


 
 const isOnline=OnlineUsers.includes(user._id);
 console.log("User:", user._id, "OnlineUsers:", OnlineUsers, "isOnline:", isOnline);





  return (
    <div
      className={`hover:bg-slate-600 duration-300 ${
        isSelected ? "bg-slate-700" : ""
      }`}
      
      onClick={() =>{
      console.log("User clicked:", user);
      
       setSelectedConversation(user);
      }
       }
    >
      <div className="flex space-x-4 px-6 py-3 hover:bg-slate-700 duration-300 cursor-pointer">
        <div className={`avatar avatar-${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
          </div>
        </div>
        <div>
        <h1 className="text-2xl font-bold text-blue-600">
  {user.fullname}
</h1>
          {/* <span>{user.email}</span> */}
        </div>
      </div>
    </div>
  );
}

export default User;
