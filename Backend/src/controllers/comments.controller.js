import Comment from "../models/Comment.js";

const getCommentsByBookId = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const comments = await Comment.find({ book: bookId })
      .populate("user", "userName profileImage -_id")
      .sort({ createdAt: -1 });

    // حتى لو مفيش كومنتات، رجّع Array فاضية
    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const addComment = async (req, res) => {
    try {
        const { text, book, user } = req.body;
        const comment = new Comment({ text, user: user, book });
        const savedComment = await comment.save();
        if (!savedComment) {
            return res.status(500).json({ message: "Failed to add comment" });
        }
        res.status(201).json(comment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { getCommentsByBookId, addComment };