import User from "../models/user.model.js";
import FriendRequest from "../models/request.model.js";

export const getRecommendedUsers = async (req, res) => {
    try {
        const users = await User.find({
            $and: [
                { _id: { $ne: req.user._id } },
                { _id: { $nin: req.user.friends } },
            ],
        }
        ).select("-password -friends");

        res.json(users);
    } catch (error) {
        console.log('Error in getRecommendedUsers:', error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("friends").populate("friends", "fullName profilePicture bio");

        res.json(user.friends);
    } catch (error) {
        console.log('Error in getMyFriends:', error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: recipientId } = req.params;

        if (myId.toString() === recipientId) {
            return res.status(400).json({ message: "You can't send friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "User not found" });
        }

        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: "This user has already sent you a friend request" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        await friendRequest.save();

        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const acceptRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePicture");

        res.status(200).json({ incomingReqs });
    } catch (error) {
        console.log("Error in getPendingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const requestsSent = async (req, res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending",
        }).populate("recipient", "fullName profilePicture");

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log("Error in getOutgoingFriendReqs controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const rejectRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.sender.toString() === req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to reject this request" });
        }

        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        console.log("Error in rejectFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const cancelRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to cancel this request" });
        }

        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: "Friend request canceled" });
    } catch (error) {
        console.log("Error in cancelFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const removeFriend = async (req, res) => {
    try {
        const { id: friendId } = req.params;
        const myId = req.user._id;

        if (myId.toString() === friendId) {
            return res.status(400).json({ message: "You cannot remove yourself as a friend" });
        }

        await User.findByIdAndUpdate(myId, {
            $pull: { friends: friendId }
        });

        await User.findByIdAndUpdate(friendId, {
            $pull: { friends: myId }
        });

        res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        console.log("Error in remove Friend controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
