import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteMessage, getMessages, getUsersForSidebar, removeMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/users", getUsersForSidebar);
router.get("/:id", getMessages);
router.post("/send/:id", sendMessage);
router.delete("/delete/:id", deleteMessage);
router.put("/update/:id", removeMessage);

export default router;
