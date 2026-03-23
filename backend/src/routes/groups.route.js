import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addMember, createGroup, exitGroup, getMyGroups } from "../controllers/groups.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getMyGroups);
router.post("/", createGroup);
router.post("/:groupId/add-member/:userId", addMember);
router.post("/:groupId/exit", exitGroup);

export default router;

