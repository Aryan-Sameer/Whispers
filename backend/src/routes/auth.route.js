import express, { response } from "express";
import { checkAuth, login, logout, signup,updateProfilePicture, updateBio, updateName, deleteAccount } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.put("/update-profile", protectRoute, updateProfilePicture)
router.get("/check", protectRoute, checkAuth)
router.post("/update-bio", protectRoute, updateBio);
router.put("/update-name", protectRoute, updateName);
router.delete("/delete-account", protectRoute, deleteAccount);

export default router;
