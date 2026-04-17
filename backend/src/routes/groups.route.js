import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { addMember, createGroup, exitGroup, getMyGroups, removeMember } from "../controllers/groups.controller.js";

const router = express.Router();

router.use(protectRoute);
router.use(arcjetProtection);

router.get("/", getMyGroups);
router.post("/", createGroup);
router.post("/:groupId/add-member/:userId", addMember);
router.delete("/:groupId/remove-member/:userId", removeMember);
router.post("/:groupId/exit", exitGroup);

export default router;

