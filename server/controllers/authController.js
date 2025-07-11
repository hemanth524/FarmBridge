import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export const registerUser = async (req, res) => {
  const { name, email, password, role, location, phone } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role,
      location,
      phone,
    });

    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      image: user.image,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      image: user.image,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let roleToFetch = req.user.role === "buyer" ? "farmer" : "buyer";
    const users = await User.find({ role: roleToFetch }).select("_id name role email phone location image");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 import cloudinary from 'cloudinary';
  import fs from 'fs';

  export const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user._id;

      const updates = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      };

      if (req.file) {
        // ✅ Upload to Cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "FarmBridgeusers",
          transformation: [{ width: 300, height: 300, crop: "fill" }],
        });

        updates.avatar = result.secure_url;

        // ✅ Only delete local file after Cloudinary upload
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }

      const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      }).select("-password");

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({ user });
    } catch (err) {
      console.error("❌ Profile update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };


  export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};