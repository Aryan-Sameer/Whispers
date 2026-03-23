import Group from "../models/group.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const myId = req.user._id;

    const group = await Group.findOne({ _id: groupId, "members.userId": myId });
    if (!group) return res.status(403).json({ message: "You are not a member of this group" });

    const messages = await GroupMessage.find({ groupId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getGroupMessages controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    const group = await Group.findOne({ _id: groupId, "members.userId": senderId });
    if (!group) return res.status(403).json({ message: "You are not a member of this group" });

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await GroupMessage.create({
      senderId,
      groupId,
      text,
      image: imageUrl,
    });

    io.to(`group:${groupId}`).emit("groupNewMessage", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendGroupMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteGroupMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const myId = req.user._id;

    const message = await GroupMessage.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const group = await Group.findOne({ _id: message.groupId, "members.userId": myId });
    if (!group) return res.status(403).json({ message: "You are not a member of this group" });

    if (message.senderId.toString() !== myId.toString()) {
      return res.status(403).json({ message: "Only the sender can delete this message" });
    }

    if (message.image) {
      const publicId = message.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await GroupMessage.findByIdAndDelete(id);
    io.to(`group:${message.groupId}`).emit("groupMessageDeleted", { id });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteGroupMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeGroupMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const myId = req.user._id;

    const message = await GroupMessage.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const group = await Group.findOne({ _id: message.groupId, "members.userId": myId });
    if (!group) return res.status(403).json({ message: "You are not a member of this group" });

    const removedMessage = await GroupMessage.findByIdAndUpdate(id, { visible: false }, { new: true });
    res.status(200).json(removedMessage);
  } catch (error) {
    console.log("Error in removeGroupMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

