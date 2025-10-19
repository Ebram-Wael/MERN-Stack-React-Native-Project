import express from "express";
import { addComment, getCommentsByBookId } from "../controllers/comments.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/", protectRoute, addComment);
router.get("/:bookId", getCommentsByBookId);


export default router;