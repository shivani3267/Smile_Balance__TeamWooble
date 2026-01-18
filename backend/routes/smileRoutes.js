import express from "express";
import { addSmile } from "../controllers/smileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addSmile);

export default router;
