import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getChatSession, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/session", protect, getChatSession);
router.post("/message", protect, sendMessage);

export default router;
