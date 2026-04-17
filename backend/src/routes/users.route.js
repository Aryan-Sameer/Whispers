import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { 
    getRecommendedUsers,
    getMyFriends, 
    sendFriendRequest, 
    acceptRequest, 
    getFriendRequests, 
    requestsSent,
    rejectRequest,
    cancelRequest,
    removeFriend
} from "../controllers/users.controller.js";

const router = express.Router();

router.use(protectRoute);
router.use(arcjetProtection);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accepted", acceptRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/requests-sent", requestsSent);
router.delete("/reject-request/:id", rejectRequest);
router.delete("/cancel-request/:id", cancelRequest);
router.put("/remove-friend/:id", removeFriend);

export default router;
