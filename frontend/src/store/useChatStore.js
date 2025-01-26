import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => (
    {
        messages: [],
        users: [],
        selectedUser: null,

        isUsersLoading: false,
        isMessagesLoading: false,
        isSendingMessage: false,

        getUsers: async () => {
            set({ isUsersLoading: true });
            try {
                const res = await axiosInstance.get("/message/users");
                set({ users: res.data })
            } catch (error) {
                console.log("Error in Get Users", error);
                toast.error(error.response.data.message);
            } finally {
                set({ isUsersLoading: false })
            }
        },

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
            try {
                await axiosInstance.delete(`/message/delete/${messageId}`);
                const updatedMessages = messages.filter((message) => message._id !== messageId)
                set({ messages: updatedMessages });
            } catch (error) {
                console.log("Error in Delete Message", error);
                toast.error(error.response.data.message);
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
        },

        unsubscribeFromMessages: () => {
            const socket = useAuthStore.getState().socket;
            socket.off("newMessage");
            socket.off("messagedelete");
        },

        setSelectedUser: (selectedUser) => set({ selectedUser }),
    }
))
