import dotenv from "dotenv";
dotenv.config();

import Group from "../models/group.model.js";
import Message from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
import { io } from "../SocketIO/server.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create group
export const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    const adminId = req.user._id;

    if (!name) return res.status(400).json({ error: "Group name is required" });

    const members = memberIds ? [...new Set([adminId.toString(), ...memberIds])] : [adminId];

    const group = await Group.create({
      name,
      description: description || "",
      admin: adminId,
      members,
    });

    const populated = await Group.findById(group._id).populate("members", "fullname email");

    res.status(201).json(populated);
  } catch (error) {
    console.log("Error in createGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all groups for current user
export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId }).populate("members", "fullname email");
    res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getMyGroups", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get group messages
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const isMember = group.members.map(String).includes(String(userId));
    if (!isMember) return res.status(403).json({ error: "Not a member" });

    const messages = await Message.find({ groupId }).populate("senderId", "fullname");
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getGroupMessages", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send group message
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const isMember = group.members.map(String).includes(String(senderId));
    if (!isMember) return res.status(403).json({ error: "Not a member" });

    let mediaUrl = null;
    let mediaType = null;

    if (req.file) {
      const mimeType = req.file.mimetype;
      let resourceType = "raw";
      if (mimeType.startsWith("image/")) { resourceType = "image"; mediaType = "image"; }
      else if (mimeType.startsWith("video/")) { resourceType = "video"; mediaType = "video"; }
      else { mediaType = "file"; }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType, folder: "chat-app-media" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(req.file.buffer);
      });
      mediaUrl = uploadResult.secure_url;
    }

    if (!message?.trim() && !mediaUrl) {
      return res.status(400).json({ error: "Message or media required" });
    }

    const newMessage = await Message.create({
      senderId,
      groupId,
      message: message?.trim() || "",
      mediaUrl,
      mediaType,
    });

    group.messages.push(newMessage._id);
    await group.save();

    const populated = await Message.findById(newMessage._id).populate("senderId", "fullname");

    // Emit to all group members
    group.members.forEach((memberId) => {
      io.to(`user:${memberId}`).emit("newGroupMessage", { groupId, message: populated });
    });

    res.status(201).json({ message: "Message sent", newMessage: populated });
  } catch (error) {
    console.log("Error in sendGroupMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add member
export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const requesterId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (String(group.admin) !== String(requesterId))
      return res.status(403).json({ error: "Only admin can add members" });

    if (group.members.map(String).includes(String(userId)))
      return res.status(400).json({ error: "User already in group" });

    group.members.push(userId);
    await group.save();

    const updated = await Group.findById(groupId).populate("members", "fullname email");
    res.status(200).json(updated);
  } catch (error) {
    console.log("Error in addMember", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.members = group.members.filter((m) => String(m) !== String(userId));
    await group.save();

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.log("Error in leaveGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
