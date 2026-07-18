import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:4002", "https://final-frontened.onrender.com"];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const users = {};

export const getReceiverSocketId = (receiverId) => users[receiverId];

io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const token = cookieHeader.split(";").find(c => c.trim().startsWith("jwt="))?.split("=")[1];
    const queryUserId = socket.handshake.query.userId;

    if (!token && !queryUserId) return next(new Error("No token or userId"));

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
    } else {
      socket.userId = queryUserId;
    }
    next();
  } catch (err) {
    next(new Error("Auth failed: " + err.message));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;
  if (!userId || userId === "undefined") return;

  users[userId] = socket.id;
  // Join personal room so group messages can target by userId
  socket.join(`user:${userId}`);
  console.log("User connected:", userId);

  socket.emit("getOnlineUsers", Object.keys(users));
  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, server, io };
