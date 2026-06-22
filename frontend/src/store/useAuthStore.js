import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useChatStore } from './useChatStore';
import { useGroupChatStore } from './useGroupChatStore';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5001/"
    : (import.meta.env.VITE_API_URL || "/");

export const useAuthStore = create((set, get) => (
    {
        authUser: null,

        isCheckingAuth: true,
        isSigningUp: false,
        isLoggingIn: false,
        isUpdatingProfile: false,
        socket: null,

        onlineUsers: [],

        checkAuth: async () => {
            try {
                const res = await axiosInstance.get('/auth/check');
                set({ authUser: res.data });
                get().connectSocket();
            } catch (error) {
                set({ authUser: null });
                console.log("Error in CheckAuth", error);
            } finally {
                set({ isCheckingAuth: false });
            }
        },

        signup: async (data) => {
            set({ isSigningUp: true });
            try {
                const res = await axiosInstance.post("/auth/signup", data);
                set({ authUser: res.data });
                toast.success("Account created successfully");
                get().connectSocket();
            } catch (error) {
                toast.error(error.response.data.message);
                console.log("Error in Signup", error);
            } finally {
                set({ isSigningUp: false });
            }
        },

        login: async (data) => {
            set({ isLoggingIn: true });
            try {
                const res = await axiosInstance.post("/auth/login", data);
                set({ authUser: res.data });
                toast.success("Logged in successfully");
                get().connectSocket();
            } catch (error) {
                toast.error(error.response.data.message);
                console.log("Error in login", error);
            } finally {
                set({ isLoggingIn: false });
            }
        },

        logout: async () => {
            try {
                await axiosInstance.post("/auth/logout");
                set({ authUser: null });
                toast.success("Logged out successfully");
                useChatStore.getState().setSelectedUser(null)
                get().disConnectSocket();
            } catch (error) {
                toast.error(error.response.data.message);
                console.log("Error in logout", error);
            }
        },

        updateProfile: async (data) => {
            set({ isUpdatingProfile: true })
            try {
                const res = await axiosInstance.put('/auth/update-profile', data);
                set({ authUser: res.data });
                toast.success("Profile Updated")
            } catch (error) {
                toast.error(error.response.data.message);
                console.log("Error in profile update", error);
            } finally {
                set({ isUpdatingProfile: false })
            }
        },

        updateBio: async (data) => {
            try {
                const res = await axiosInstance.post('/auth/update-bio', data);
                set({ authUser: res.data });
                toast.success("Bio updated");
            } catch (error) {
                toast.error(error.response.data.message);
                console.log("Error in bio update", error);
            }
        },

        updateName: async (data) => {
            try {
                const res = await axiosInstance.put('/auth/update-name', data);
                set({ authUser: normalizeAuthUser(res.data) });
                toast.success("Name updated");
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to update name");
                console.log("Error in name update", error);
            }
        },

        deleteAccount: async () => {
            try {
                await axiosInstance.delete('/auth/delete-account');
                set({ authUser: null });
                useChatStore.getState().setSelectedUser(null);
                useGroupChatStore.getState().setSelectedGroup(null);
                get().disConnectSocket();
                toast.success("Account deleted successfully");
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete account");
                console.log("Error in delete account", error);
            }
        },

        connectSocket: () => {
            const { authUser } = get();
            const authUserId = authUser?._id ?? authUser?.userId;
            if (!authUserId || get().socket?.connected) return;

            const socket = io(BASE_URL, {
                query: {
                    userId: authUserId,
                },
            });
            socket.connect();

            set({ socket: socket })

            socket.on("getOnlineUsers", (userIds) => {
                const friendIds = authUser.friends ?? [];
                set({ onlineUsers: userIds.filter(id => friendIds.includes(id)) })
            })
        },

        disConnectSocket: () => {
            if (get().socket?.connected) get().socket.disconnect()
        }
    }
));
