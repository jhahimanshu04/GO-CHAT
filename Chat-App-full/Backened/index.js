import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import { app, server } from "./SocketIO/server.js";
import userRoutes from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import groupRoute from "./routes/group.route.js";

dotenv.config();

const allowedOrigins = ["https://final-frontened.onrender.com", "http://localhost:4002"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
}));

app.use(cookieParser());
app.use(express.json());

app.get("/test", async (req, res) => {
  res.json({ message: "Server working!", dbState: mongoose.connection.readyState });
});

app.use("/api/users", userRoutes);
app.use("/api/message", messageRoute);
app.use("/api/group", groupRoute);

const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

try {
  await mongoose.connect(URI);
  console.log("connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}

server.listen(PORT, () => {
  console.log(`Server is started at ${PORT}`);
});
