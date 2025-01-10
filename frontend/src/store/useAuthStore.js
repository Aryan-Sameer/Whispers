import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/" : "/";

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
                console.log("Error in profile update", error)
            } finally {
                set({ isUpdatingProfile: false })
            }
        },

        connectSocket: () => {
            const { authUser } = get();
            if (!authUser || get().socket?.connect) return;

            const socket = io(BASE_URL, {
                query: {
                    userId: authUser._id,
                },
            });
            socket.connect();

            set({ socket: socket })

            socket.on("getOnlineUsers", (userIds) => {
                set({ onlineUsers: userIds })
            })
        },

        disConnectSocket: () => {
            if (get().socket?.connected) get().socket.disconnect()
        }
    }
));
