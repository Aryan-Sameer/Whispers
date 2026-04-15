import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { deleteGroupMessage, editGroupMessage, getGroupMessages, removeGroupMessage, sendGroupMessage } from "../controllers/groupMessage.controller.js";

const router = express.Router();

router.use(protectRoute);
router.use(arcjetProtection);

router.get("/:groupId", getGroupMessages);
router.post("/send/:groupId", sendGroupMessage);
router.delete("/delete/:id", deleteGroupMessage);
router.put("/update/:id", removeGroupMessage);
router.patch("/edit/:id", editGroupMessage);

export default router;

