import express from "express";
import "dotenv/config"; // Load environment variables from .env file
import cors from "cors";

import { connectDB } from "./lib/db.js"; // Import the database connection function

import authRoutes from "./routes/authRoutes.js";
import booksRoutes from "./routes/booksRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import bodyParser from "body-parser";
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "100mb" }));
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);

app.use("/api/books", booksRoutes);

app.use("/api/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
