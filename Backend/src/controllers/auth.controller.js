import User from "../models/User.js";
import jwt from "jsonwebtoken";

const genJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

const register = async (req, res) => {
  try {
    const { email, userName, password } = req.body;

    if (!email || !userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be more than 6 characters" });
    }

    if (userName.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be more than 3 characters" });
    }

    const existUserWithEmail = await User.findOne({ email });
    if (existUserWithEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existUserWithUserName = await User.findOne({ userName });
    if (existUserWithUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const profileImage = `http://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

    const user = new User({
      email,
      userName,
      password,
      profileImage,
    });

    await user.save();

    const token = genJWT(user._id);

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Error in registration:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = genJWT(user._id);

    console.log("Login success:", { email: user.email, token });

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { register, login };
