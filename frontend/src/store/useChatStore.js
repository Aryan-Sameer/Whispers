import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => (
    {
        messages: [],        
        selectedUser: null,

        isMessagesLoading: false,
        isSendingMessage: false,
        isMessageDeleting: false,

        getMessages: async (userId) => {
            set({ isMessagesLoading: true });
            try {
                const res = await axiosInstance.get(`/message/${userId}`);
                set({ messages: res.data })
            } catch (error) {
                console.log("Error in Get Messages", error);
                toast.error(error.response.data.message);
            } finally {
                set({ isMessagesLoading: false })
            }
        },

        sendMessage: async (messageData) => {
            const { selectedUser, messages } = get();
            set({ isSendingMessage: true });
            try {
                const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
                set({ messages: [...messages, res.data] });
            } catch (error) {
                console.log("Error in Send Message", error);
                toast.error(error.response.data.message);
            } finally {
                set({ isSendingMessage: false });
            }
        },

        deleteMessage: async (messageId) => {
            const { messages } = get();
            set({ isMessageDeleting: true });
            try {
                await axiosInstance.delete(`/message/delete/${messageId}`);
                const updatedMessages = messages.filter((message) => message._id !== messageId)
                set({ messages: updatedMessages });
            } catch (error) {
                console.log("Error in Delete Message", error);
                toast.error(error.response.data.message);
            } finally {
                set({ isMessageDeleting: false });
            }
        },

        removeMessage: async (messageId) => {
            const { messages } = get();
            try {
                await axiosInstance.put(`/message/update/${messageId}`);
                set({ messages: messages.map((message) => message._id === messageId ? { ...message, visible: false } : message) })
            } catch (error) {
                console.log("Error in Remove Message", error);
                toast.error(error.response.data.message);
            }
        },

        editMessage: async (messageId, text) => {
            const { messages } = get();
            try {
                const res = await axiosInstance.patch(`/message/edit/${messageId}`, { text });
                set({
                    messages: messages.map((message) =>
                        message._id === messageId ? { ...message, ...res.data } : message
                    )
                });
            } catch (error) {
                console.log("Error in Edit Message", error);
                toast.error(error.response?.data?.message || "Failed to edit message");
            }
        },

        subscribeToMessages: () => {
            const { selectedUser } = get()
            if (!selectedUser) return;

            const socket = useAuthStore.getState().socket;

            socket.on("newMessage", (newMessage) => {
                if (newMessage.senderId !== selectedUser._id) return;
                set({ messages: [...get().messages, newMessage] });
            })

            socket.on("messagedelete", ({ id }) => {
                set({ messages: get().messages.filter((message) => message._id !== id) })
            })

            socket.on("messageEdited", (updatedMessage) => {
                set({
                    messages: get().messages.map((message) =>
                        message._id === updatedMessage._id ? { ...message, ...updatedMessage } : message
                    )
                });
            })
        },

        unsubscribeFromMessages: () => {
            const socket = useAuthStore.getState().socket;
            socket.off("newMessage");
            socket.off("messagedelete");
            socket.off("messageEdited");
        },

        setSelectedUser: (selectedUser) => set({ selectedUser }),
    }
))
