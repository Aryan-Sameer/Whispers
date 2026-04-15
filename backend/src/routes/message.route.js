import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { deleteMessage, editMessage, getMessages, removeMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.use(protectRoute);
router.use(arcjetProtection);

router.get("/:id", getMessages);
router.post("/send/:id", sendMessage);
router.delete("/delete/:id", deleteMessage);
router.put("/update/:id", removeMessage);
router.patch("/edit/:id", editMessage);

export default router;
