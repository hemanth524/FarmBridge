import express from "express";
import {
  addProduce,
  getAllProduce,
  getMyProduce,
  updateProduce,
  deleteProduce,
} from "../controllers/produceController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import multer from "multer";

// Multer setup for image upload
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", getAllProduce); // Public
router.get("/my", protect, authorizeRoles("farmer"), getMyProduce);
router.post("/", protect, authorizeRoles("farmer"), upload.array("images"), addProduce);
router.put("/:id", protect, authorizeRoles("farmer"), updateProduce);
router.delete("/:id", protect, authorizeRoles("farmer"), deleteProduce);

export default router;
