import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteMessage, getMessages, getUsersForSidebar, removeMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/delete/:id", protectRoute, deleteMessage);
router.put("/update/:id", protectRoute, removeMessage)

export default router;
