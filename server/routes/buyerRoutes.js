import express from "express";
import { getInterestedBuyers,updateInterestedCrops ,getProduceForBuyer  } from "../controllers/buyerController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/interested/:crop", protect, authorizeRoles("farmer"), getInterestedBuyers);
router.put("/interests", protect, authorizeRoles("buyer"), updateInterestedCrops);
router.get("/my-produce", protect, authorizeRoles("buyer"), getProduceForBuyer);

export default router;
