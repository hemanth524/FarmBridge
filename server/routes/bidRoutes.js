import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createBidSession, getBidSessionsForUser,getBidSessionById ,completeBiddingSession} from "../controllers/bidController.js";

const router = express.Router();

router.post("/create", protect, createBidSession);
router.get("/", protect, getBidSessionsForUser);
router.get("/:id", protect, getBidSessionById);
router.put("/complete/:sessionId", protect, completeBiddingSession);


export default router;
