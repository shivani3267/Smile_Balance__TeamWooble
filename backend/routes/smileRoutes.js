import express from "express";
import multer from "multer";
import { addSmile, getStats } from "../controllers/smileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", protect, upload.single("image"), addSmile);
router.get("/stats", protect, getStats);

export default router;

