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
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.params.user }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.error("Get user books error:",error.massage);
    res.status(500).json({ massage:"server error" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ massage: "Book not found" });
    }
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this book" });
    }
    //delete the image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      const publicId = book.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//router.put("/:id", protectRoute, async (req, res) => {

export default router;
