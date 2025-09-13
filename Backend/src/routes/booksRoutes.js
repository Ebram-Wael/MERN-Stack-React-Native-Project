import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import { addBook, getBooks, getBookByUserId, deleteBookById} from "../controllers/book.controller.js";

const router = express.Router();


router.post("/", protectRoute, addBook);
router.get("/", protectRoute, getBooks);
router.get("/:user", protectRoute, getBookByUserId);
router.delete("/:id", protectRoute, deleteBookById);





export default router;
