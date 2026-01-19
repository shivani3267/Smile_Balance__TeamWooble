import express from "express";
import { addSmile } from "../controllers/smileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addSmile);

export default router;
