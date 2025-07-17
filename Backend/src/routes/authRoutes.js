import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const genJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });
};
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, userName, password } = req.body;
        if (!email && !userName && !password) {
            res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            res.status(400).json({ massage: "password must be more then 6 digit" });
        }
        if (userName.length < 3) {
            res.status(400).json({ massage: "userName must be more then 3 digit" });
        }
        const existUserWithEmail = await User.findOne({ email });
        if (existUserWithEmail) {
            res.status(400).json({ massage: "email already exist" });
        }
        const existUserWithUserName = await User.findOne({ userName });
        if (existUserWithUserName) {
            f;
            res.status(400).json({ massage: "username already exist" });
        }
        const profileImage = `http://api.dicebear.com/7.x/avataaars/svg?=${userName}`;
        const user = new User({
            email,
            userName,
            password,
            profileImage,
        });

        await user.save();
        const token = genJWT(user._id);
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                userName: user.userName,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error("Error in registration:", error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) res.status(400).json({ message: "all fields are required" });
        
        const user = await User.findOne({ email });
        if (!user) res.status(400).json({ message: "invalid credentials" });
        
        const isPasswordCorrect = await user.comparePassword(user._id);
        if (!isPasswordCorrect) res.status(400).json({ message: "password is incorrect" });

        const token = genJWT(user._id);
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                userName: user.userName,
                profileImage: user.profileImage,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
        console.error("Error in registration:", error);
    }
});

export default router;
