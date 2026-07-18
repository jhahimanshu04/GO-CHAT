import dotenv from "dotenv";
dotenv.config();

import { getReceiverSocketId, io } from "../SocketIO/server.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let mediaUrl = null;
    let mediaType = null;

    if (req.file) {
      const fileBuffer = req.file.buffer;
      const mimeType = req.file.mimetype;

      let resourceType = "raw";
      if (mimeType.startsWith("image/")) {
        resourceType = "image";
        mediaType = "image";
      } else if (mimeType.startsWith("video/")) {
        resourceType = "video";
        mediaType = "video";
      } else {
        resourceType = "raw";
        mediaType = "file";
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType, folder: "chat-app-media" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });

      mediaUrl = uploadResult.secure_url;
    }

    if (!message?.trim() && !mediaUrl) {
      return res.status(400).json({ error: "Message or media is required" });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message: message?.trim() || "",
      mediaUrl,
      mediaType,
    });

    conversation.messages.push(newMessage._id);

    await newMessage.save();
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("error in getMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
