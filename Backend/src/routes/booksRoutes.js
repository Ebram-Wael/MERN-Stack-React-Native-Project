import express from "express";
import Book from "../models/Book.js"; // Import the Book model
import cloudinary from "../lib/cloudinary.js"; // Import cloudinary configuration
import protectRoute from "../middleware/auth.middleware.js"; // Import the authentication middleware
const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, reting, image } = req.body;
    if (!title && !caption && !reting && !image) {
      return res.status(400).json({ massage: "please provide all fields" });
    }
    const result = await cloudinary.uploader.upload(image);
    if (!result) {
      return res.status(500).json({ message: "Image upload failed" });
    }
    const imageUrl = result.secure_url;
    const newBook = new Book({
      title,
      caption,
      reting,
      image: imageUrl,
      user: req.user._id,
    });
    await book.save();
    res.status(201).json({ newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "usreName profileImage");
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);    

    res.status(200).json({
      books,
      currentPage: page,
      totalBooks,
      totalPages
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
