import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const users = await User.find({}).select("-password")

        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
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

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message(
            {
                senderId,
                recieverId,
                text,
                image: imageUrl
            }
        )

        await newMessage.save();

        const recieverSocketId = getRecieverSocketId(recieverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }

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
            const result = await cloudinary.uploader.destroy(publicId);
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
