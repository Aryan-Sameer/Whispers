import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import redisClient from "../lib/redisClient.js";

export const checkAuth = async (req, res) => {
    const cacheKey = `check_auth:${req.user._id}`;

    try {
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        await redisClient.setEx(cacheKey, 60, JSON.stringify(req.user));

        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller : ", error.message);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken({ userId: newUser._id, res });
            await newUser.save();

            res.status(201).json({ userId: newUser._id, email: newUser.email });

        } else {
            return res.status(400).json({ "message": "Innvalied User Data" });
        }

    } catch (error) {
        console.log("Error in signup controller : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalied credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalied credentials" });
        }

        generateToken({ userId: user._id, res });

        res.status(200).json({
            userId: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
        });

    } catch (error) {
        console.log("Error in login controller : ", error.message);
        return res.status(500).json({ message: "Internal server error" });

    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0, })
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfilePicture = async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const userId = req.user._id;

        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture is required" }, { new: true });
        }

        const uploadedResponse = await cloudinary.uploader.upload(profilePicture)
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePicture: uploadedResponse.secure_url
        }, { new: true })

        await redisClient.del(`check_auth:${req.user._id}`);

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in updateProfile controller : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateBio = async (req, res) => {
    try {
        const { bio } = req.body;
        const userId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(userId, { bio }, { new: true });

        await redisClient.del(`check_auth:${req.user._id}`);

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateBio controller : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
