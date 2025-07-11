import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserProfile,
  getMe

} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";



const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, getAllUsers);
router.put('/update', protect, upload.single('avatar'), updateUserProfile);
router.get("/me", protect, getMe);


export default router;