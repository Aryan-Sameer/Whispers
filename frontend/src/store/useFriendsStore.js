import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useFriendsStore = create((set, get) => (
    {
        recommendedUsers: [],
        isFetchingUsers: false,

        users: [],
        isUsersLoading: false,
        isSendingRequest: false,

        requestsSent: [],
        requestsReceived: [],

        getRecommendedUsers: async () => {
            set({ isFetchingUsers: true });
            try {
                const users = await axiosInstance.get("/users")
                set({ recommendedUsers: users.data });
            } catch (error) {
                console.log("Error in Get Recommended Users", error);
                toast.error(error.response.data.message);
            } finally {
                set({ isFetchingUsers: false });
            }
        },

        getUsers: async () => {
            set({ isUsersLoading: true });
            try {
                const res = await axiosInstance.get("/users/friends");
                set({ users: [...res.data, useAuthStore.getState().authUser] });
            } catch (error) {
                console.log("Error in Get Users", error);
                toast.error(error.response.data.message);
            } finally {
                set({ isUsersLoading: false })
            }
        },

        sendRequest: async (recipientId) => {
            set({ isSendingRequest: true });
            try {
                const response = await axiosInstance.post(`/users/friend-request/${recipientId}`);
                get().outgoingRequests();
                toast.success("Request sent!");
            } catch (error) {
                console.log("Error in Send friend request", error);
                toast.error(error.response.data.message);
            } finally {
                set({ isSendingRequest: false })
            }
        },

        outgoingRequests: async () => {
            try {
                const response = await axiosInstance.get("/users/requests-sent");
                set({ requestsSent: response.data });
            } catch (error) {
                console.log("Error in outgoing requests", error);
                toast.error(error.response.data.message);
            }
        },

        incomingRequests: async () => {
            try {
                const response = await axiosInstance.get("users/friend-requests");
                set({ requestsReceived: response.data.incomingReqs });
            } catch (error) {
                console.log("Error in incoming requests", error);
                toast.error(error.response.data.message);
            }
        },

        rejectRequest: async (requestId) => {
            try {
                await axiosInstance.delete(`users/reject-request/${requestId}`);
                const updatedRequests = get().requestsReceived.filter((request) => request._id !== requestId);
                set({ requestsReceived: updatedRequests });
                toast.success("Request rejected!");
            } catch (error) {
                console.log("Error in reject requests", error);
                toast.error(error.response.data.message);
            }
        },

        acceptRequest: async (requestId) => {
            try {
                await axiosInstance.put(`users/friend-request/${requestId}/accepted`);
                const updatedRequests = get().requestsReceived.filter((request) => request._id !== requestId);
                set({ requestsReceived: updatedRequests });
                toast.success("Request accepted!");
            } catch (error) {
                console.log("Error in accept requests", error);
                toast.error(error.response.data.message);
            }
        },

        cancelRequest: async (userId) => {
            try {
                const requestId = get().requestsSent.find(request => request.recipient._id === userId)._id;
                await axiosInstance.delete(`users/cancel-request/${requestId}`);
                const updatedRequests = get().requestsSent.filter((request) => request._id !== requestId);
                set({ requestsSent: updatedRequests });
                toast.success("Request canceled!");
            } catch (error) {
                console.log("Error in cancel requests", error);
                toast.error(error.response.data.message);
            }
        },

        removeFriend: async (friendId) => {
            try {
                await axiosInstance.put(`users/remove-friend/${friendId}`);
                const updatedUsers = get().users.filter((user) => user._id !== friendId);
                set({ users: updatedUsers });
                toast.success("Friend removed successfully!");
            } catch (error) {
                console.log("Error in remove friend", error);
                toast.error(error.response.data.message);
            }
        }
    }
))
