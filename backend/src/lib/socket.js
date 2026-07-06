import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Group from "../models/group.model.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:80",
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : ""
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
    }
})

const userSocketMap = {};

export const getRecieverSocketId = (userId) => {
    return userSocketMap[userId]
}

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("joinGroup", async ({ groupId }, cb) => {
        try {
            if (!userId || !groupId) {
                cb?.({ ok: false, message: "Invalid join payload" });
                return;
            }

            const group = await Group.findOne({ _id: groupId, "members.userId": userId }).select("_id");
            if (!group) {
                cb?.({ ok: false, message: "Not a member of this group" });
                return;
            }

            socket.join(`group:${groupId}`);
            cb?.({ ok: true });
        } catch (error) {
            console.log("Error in joinGroup socket handler:", error.message);
            cb?.({ ok: false, message: "Failed to join group" });
        }
    });

    socket.on("leaveGroup", ({ groupId }, cb) => {
        try {
            if (!groupId) {
                cb?.({ ok: false, message: "Invalid leave payload" });
                return;
            }
            socket.leave(`group:${groupId}`);
            cb?.({ ok: true });
        } catch (error) {
            console.log("Error in leaveGroup socket handler:", error.message);
            cb?.({ ok: false, message: "Failed to leave group" });
        }
    });

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { io, app, server }
