import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import produceRoutes from "./routes/produceRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("FarmBridge API is running 🚜");
});

app.get("/api/test-protected", protect, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

app.use("/api/produce", produceRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
