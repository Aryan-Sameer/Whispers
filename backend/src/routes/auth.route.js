import express, { response } from "express";
import { checkAuth, login, logout, signup, updateProfile, updateBio } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup)
router.post("/login", arcjetProtection, login)
router.post("/logout", logout)
router.put("/update-profile", protectRoute, updateProfile)
router.get("/check", protectRoute, checkAuth)
router.post("/update-bio", protectRoute, updateBio);

export default router;
