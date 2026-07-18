
import React, {useRef,useEffect} from "react";
import Message from "./Message";
// import {useEffect,useRef} from "react";

import useGetMessage from "../../context/useGetMessage.js";
import Loading from "../../components/Loading.jsx";
import useGetSocketMessage from "../../context/useGetSocketMessage.jsx";


function Messages() {
  const { loading, messages = [] } = useGetMessage();
  useGetSocketMessage() //listen incoming message
console.log("messages:", messages);



const lastMsgRef=useRef()
useEffect(()=>{
  setTimeout(()=>{
    if(lastMsgRef.current){
      lastMsgRef.current.scrollIntoView({behavior:"smooth"});
    }
  },100)
},[messages]);



  const safeMessages = Array.isArray(messages) ? messages : []; // ✅ array check

  return (
    <div
      className=" flex-1 no-scrollbar overflow-y-auto"
      style={{ minHeight: "calc(92vh - 8vh)" }}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          {safeMessages.map((message) => (
            <Message key={message._id} message={message} />
          ))}
          <div ref={lastMsgRef}></div>
          {safeMessages.length === 0 && (
            <p className="text-center mt-[20%]">
              Say Hi to Start the Conversation
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Messages;
