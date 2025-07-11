import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import User from "../models/User.js"; // Import the User model

const protectRoute = async (req,res,next) =>{
    try {
        const token = req.header("Authorizaton").replase("Bearer","");
        if(!token){
            return res.status(401).json({ massage: "No authentiction token provided"});
        }  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");// Exclude password from the user object
        if(!user){
            return res.status(401).json({ massage: "User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Invalid token or user not found" });
    }
}
export default protectRoute;