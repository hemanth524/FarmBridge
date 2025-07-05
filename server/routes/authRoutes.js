import express from "express";
import { registerUser, loginUser ,getAllUsers } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, getAllUsers);
export default router;
