import express from "express";
import "dotenv/config"; // Load environment variables from .env file
import cors from "cors";

import { connectDB } from "./lib/db.js"; // Import the database connection function

import authRoutes from "./routes/authRoutes.js";
import booksRoutes from "./routes/booksRoutes.js"

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());// Enable CORS for all routes
app.use(express.urlencoded({ extended: true }));
app.get("/test", (req, res) => {
  res.send("Hello, World!");
});



app.use("/api/auth", authRoutes);

app.use("/api/books",booksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
