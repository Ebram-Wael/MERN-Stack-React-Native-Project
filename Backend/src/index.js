import express from "express";
import "dotenv/config"; // Load environment variables from .env file
import cors from "cors";

import { connectDB } from "./lib/db.js"; // Import the database connection function

import authRoutes from "./routes/authRoutes.js";
import booksReoutes from "./routes/booksRoutes.js"

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());//
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/auth", authRoutes);

app.use("/books",booksReoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
