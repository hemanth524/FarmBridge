import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createBidSession, getBidSessionsForUser,getBidSessionById } from "../controllers/bidController.js";

const router = express.Router();

router.post("/create", protect, createBidSession);
router.get("/", protect, getBidSessionsForUser);
router.get("/:id", protect, getBidSessionById);


export default router;
