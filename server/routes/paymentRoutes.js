import express from "express";
import {
  getBuyerPayments,
  getFarmerPayments,
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js"; // or .ts if you're compiling with ts-node
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/buyer", protect, getBuyerPayments);
router.get("/farmer", protect, getFarmerPayments);
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;