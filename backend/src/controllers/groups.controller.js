import mongoose from "mongoose";
import Group from "../models/group.model.js";

const isFriend = (user, otherId) => {
  return user.friends?.some((f) => f.toString() === otherId) ?? false;
};

const getGroupAuthView = async (groupId) => {
  return Group.findById(groupId).populate("adminId", "fullName profilePicture");
};

export const getMyGroups = async (req, res) => {
  try {
    const myId = req.user._id;

    const groups = await Group.find({ "members.userId": myId })
      .populate("adminId", "fullName profilePicture")
      .populate("members.userId", "fullName profilePicture");

    res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getMyGroups controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const adminId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = await Group.create({
      name: name.trim(),
      adminId,
      members: [{ userId: adminId, role: "admin" }],
    });

    const populated = await Group.findById(group._id)
      .populate("adminId", "fullName profilePicture")
      .populate("members.userId", "fullName profilePicture");

    res.status(201).json(populated);
  } catch (error) {
    console.log("Error in createGroup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const myId = req.user._id;

    if (myId.toString() === userId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.adminId.toString() !== myId.toString()) {
      return res.status(403).json({ message: "Only the group admin can add members" });
    }

    if (!isFriend(req.user, userId)) {
      return res.status(403).json({ message: "You can only add your friends into the group" });
    }

    const alreadyMember = group.members.some((m) => m.userId.toString() === userId);
    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member of this group" });
    }

    group.members.push({ userId: new mongoose.Types.ObjectId(userId), role: "member" });
    await group.save();

    const populated = await getGroupAuthView(groupId);
    const withMembers = await Group.findById(groupId)
      .populate("adminId", "fullName profilePicture")
      .populate("members.userId", "fullName profilePicture");

    res.status(200).json(withMembers ?? populated);
  } catch (error) {
    console.log("Error in addMember controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const exitGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const myId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = group.members.some((m) => m.userId.toString() === myId.toString());
    if (!isMember) return res.status(403).json({ message: "You are not a member of this group" });

    const leavingWasAdmin = group.adminId.toString() === myId.toString();

    // Remove the user from members.
    group.members = group.members.filter((m) => m.userId.toString() !== myId.toString());

    // If the admin left, appoint a new admin (or delete the group if empty).
    if (leavingWasAdmin) {
      if (group.members.length === 0) {
        await Group.findByIdAndDelete(groupId);
        return res.status(200).json({ message: "Group deleted" });
      }

      group.members.sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());
      const newAdmin = group.members[0];

      group.adminId = newAdmin.userId;
      group.members.forEach((m) => {
        m.role = m.userId.toString() === newAdmin.userId.toString() ? "admin" : "member";
      });
    }

    await group.save();

    const withMembers = await Group.findById(groupId)
      .populate("adminId", "fullName profilePicture")
      .populate("members.userId", "fullName profilePicture");

    res.status(200).json(withMembers);
  } catch (error) {
    console.log("Error in exitGroup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const myId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.adminId.toString() !== myId.toString()) {
      return res.status(403).json({ message: "Only the group admin can remove members" });
    }

    if (userId === myId.toString()) {
      return res.status(400).json({ message: "Admin cannot remove themselves" });
    }

    const isMember = group.members.some((m) => m.userId.toString() === userId);
    if (!isMember) {
      return res.status(404).json({ message: "User is not a member of this group" });
    }

    group.members = group.members.filter((m) => m.userId.toString() !== userId);
    await group.save();

    const withMembers = await Group.findById(groupId)
      .populate("adminId", "fullName profilePicture")
      .populate("members.userId", "fullName profilePicture");

    res.status(200).json(withMembers);
  } catch (error) {
    console.log("Error in removeMember controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

