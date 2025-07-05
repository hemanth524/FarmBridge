import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { sendMessage, getConversationWithContact, markMessageRead } from "../controllers/messageController.js";

const router = express.Router();

router.post("/send", protect, sendMessage);

// ✅ corrected endpoint:
router.get("/conversation/:contactId", protect, getConversationWithContact);

router.patch("/:messageId/read", protect, markMessageRead);

export default router;
