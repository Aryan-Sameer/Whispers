import Message from "../models/message.model.js";
import mongoose from "mongoose";
import { messageQueue } from "../lib/queue.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const addMessageToQueue = async (data) => {
    return await messageQueue.add('deliver-message', data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000
        }
    });
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const mesages = await Message.find({
            $or: [
                { senderId: myId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: myId }
            ]
        })

        res.status(200).json(mesages);
    } catch (error) {
        console.log("Error in getMessages controller : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        // Generate messageId upfront for immediate client feedback and queue consistency
        const messageId = new mongoose.Types.ObjectId();

        // Queue the message delivery job (Cloudinary upload, DB save, and Socket emissions)
        await addMessageToQueue({
            messageId,
            senderId,
            recieverId,
            text,
            image
        });

        // Return a tentative message object immediately to the sender
        const newMessage = {
            _id: messageId,
            senderId,
            recieverId,
            text,
            image, // Includes base64 preview for immediate rendering
            visible: true,
            isEdited: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMessage = await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (deletedMessage.image) {
            const publicId = deletedMessage.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        const recieverId = deletedMessage.recieverId;
        const recieverSocketId = getRecieverSocketId(recieverId);
        io.to(recieverSocketId).emit("messagedelete", { id });

        return res.status(200).json({ message: "Message deleted successfully" });

    } catch (error) {
        console.log("Error in deleteMessage controller: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const removeMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const removedMessage = await Message.findByIdAndUpdate(id, { visible: false }, { new: true });
        if (!removeMessage) {
            return res.status(404).json({ message: "Message not found" });
        }
        return res.status(200).json(removedMessage);

    } catch (error) {
        console.log("Error in updateMessage controller: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const editMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const myId = req.user._id;

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({ message: "Message text is required" });
        }

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== myId.toString()) {
            return res.status(403).json({ message: "Only sender can edit this message" });
        }

        message.text = text.trim();
        message.isEdited = true;
        const updatedMessage = await message.save();

        const recieverSocketId = getRecieverSocketId(message.recieverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("messageEdited", updatedMessage);
        }

        return res.status(200).json(updatedMessage);
    } catch (error) {
        console.log("Error in editMessage controller: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
