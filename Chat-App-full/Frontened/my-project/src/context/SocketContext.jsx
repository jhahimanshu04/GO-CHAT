import { createContext, useEffect, useState, useContext } from "react";
import { useAuth } from "./AuthProvider";
import io from "socket.io-client";

export const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

const SOCKET_URL = process.env.NODE_ENV === "production"
  ? "http://localhost:3001"
  : "http://localhost:3001";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [OnlineUsers, setOnlineUsers] = useState([]);
  const [authUser, , loading] = useAuth();

  useEffect(() => {
    if (loading) return;

    if (authUser?._id) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        query: { userId: authUser._id },
      });

      // ✅ Pehle listeners register karo
      newSocket.on("connect", () => {
        console.log("Socket connected!", newSocket.id);
      });

      newSocket.on("getOnlineUsers", (users) => {
        console.log("✅ Online users:", users);
        setOnlineUsers(users);
      });

      setSocket(newSocket); // ✅ baad mein set karo

      return () => {
        newSocket.off("getOnlineUsers");
        newSocket.close();
        setSocket(null);
        setOnlineUsers([]);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setOnlineUsers([]);
      }
    }
  }, [authUser, loading]);

  return (
    <SocketContext.Provider value={{ socket, OnlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};