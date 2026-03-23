import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteGroupMessage, getGroupMessages, removeGroupMessage, sendGroupMessage } from "../controllers/groupMessage.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/:groupId", getGroupMessages);
router.post("/send/:groupId", sendGroupMessage);
router.delete("/delete/:id", deleteGroupMessage);
router.put("/update/:id", removeGroupMessage);

export default router;

