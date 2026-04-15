import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

const toIdString = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value._id) return String(value._id);
    if (value.$oid) return String(value.$oid);
  }
  return String(value);
};

export const useGroupChatStore = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  messages: [],

  isGroupsLoading: false,
  isMessagesLoading: false,
  isCreatingGroup: false,
  isSendingMessage: false,
  isMessageDeleting: false,

  getMyGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      console.log("Error in getMyGroups:", error);
      toast.error(error.response?.data?.message || "Failed to load groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async ({ name }) => {
    set({ isCreatingGroup: true });
    try {
      const res = await axiosInstance.post("/groups", { name });
      const createdGroup = res.data;
      set({ groups: [createdGroup, ...get().groups], selectedGroup: createdGroup, messages: [] });
      toast.success("Group created");
      return createdGroup;
    } catch (error) {
      console.log("Error in createGroup:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      set({ isCreatingGroup: false });
    }
  },

  setSelectedGroup: (group) => set({ selectedGroup: group, messages: [] }),

  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/group-message/${groupId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getGroupMessages:", error);
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendGroupMessage: async (messageData) => {
    const { selectedGroup, messages } = get();
    if (!selectedGroup) return;

    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post(`/group-message/send/${selectedGroup._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log("Error in sendGroupMessage:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  deleteGroupMessage: async (messageId) => {
    const { messages } = get();
    set({ isMessageDeleting: true });
    try {
      await axiosInstance.delete(`/group-message/delete/${messageId}`);
      set({ messages: messages.filter((message) => message._id !== messageId) });
    } catch (error) {
      console.log("Error in deleteGroupMessage:", error);
      toast.error(error.response?.data?.message || "Failed to delete message");
    } finally {
      set({ isMessageDeleting: false });
    }
  },

  removeGroupMessage: async (messageId) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.put(`/group-message/update/${messageId}`);
      set({
        messages: messages.map((message) =>
          message._id === messageId ? { ...message, visible: res.data.visible } : message
        ),
      });
    } catch (error) {
      console.log("Error in removeGroupMessage:", error);
      toast.error(error.response?.data?.message || "Failed to remove message");
    }
  },

  editGroupMessage: async (messageId, text) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.patch(`/group-message/edit/${messageId}`, { text });
      set({
        messages: messages.map((message) =>
          message._id === messageId ? { ...message, ...res.data } : message
        ),
      });
    } catch (error) {
      console.log("Error in editGroupMessage:", error);
      toast.error(error.response?.data?.message || "Failed to edit message");
    }
  },

  addMember: async (groupId, userId) => {
    try {
      await axiosInstance.post(`/groups/${groupId}/add-member/${userId}`);
      await get().getMyGroups();

      // If current group is open, refresh selectedGroup so the members list updates.
      const refreshed = get().groups.find((g) => g._id === groupId);
      if (refreshed) {
        set({ selectedGroup: refreshed });
      }

      toast.success("Member added");
    } catch (error) {
      console.log("Error in addMember:", error);
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  },

  removeMember: async (groupId, userId) => {
    try {
      await axiosInstance.delete(`/groups/${groupId}/remove-member/${userId}`);
      await get().getMyGroups();
      const refreshed = get().groups.find((g) => g._id === groupId);
      if (refreshed) set({ selectedGroup: refreshed });
      toast.success("Member removed");
    } catch (error) {
      console.log("Error in removeMember:", error);
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  },

  exitGroup: async (groupId) => {
    try {
      await axiosInstance.post(`/groups/${groupId}/exit`);
      await get().getMyGroups();
      if (get().selectedGroup?._id === groupId) {
        set({ selectedGroup: null, messages: [] });
      }
      toast.success("Left group");
    } catch (error) {
      console.log("Error in exitGroup:", error);
      toast.error(error.response?.data?.message || "Failed to exit group");
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const groupId = selectedGroup._id;

    // Prevent duplicate listeners when switching groups.
    socket.off("groupNewMessage");
    socket.off("groupMessageDeleted");
    socket.off("groupMessageEdited");

    socket.emit("joinGroup", { groupId });

    socket.on("groupNewMessage", (newMessage) => {
      if (toIdString(newMessage.groupId) !== toIdString(groupId)) return;
      set({
        messages: get().messages.some((msg) => msg._id === newMessage._id)
          ? get().messages
          : [...get().messages, newMessage],
      });
    });

    socket.on("groupMessageDeleted", ({ id }) => {
      set({ messages: get().messages.filter((message) => message._id !== id) });
    });

    socket.on("groupMessageEdited", (updatedMessage) => {
      set({
        messages: get().messages.map((message) =>
          message._id === updatedMessage._id ? { ...message, ...updatedMessage } : message
        ),
      });
    });
  },

  unsubscribeFromGroupMessages: (groupIdOverride) => {
    const socket = useAuthStore.getState().socket;
    const { selectedGroup } = get();
    if (!socket) return;

    const groupId = groupIdOverride ?? selectedGroup?._id;
    if (groupId) socket.emit("leaveGroup", { groupId });

    socket.off("groupNewMessage");
    socket.off("groupMessageDeleted");
    socket.off("groupMessageEdited");
  },
}));

