import mongoose from "mongoose";
import User from "./User.js";
import Book from "./Book.js";
const CommentSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Book,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    require: true,
  },
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);