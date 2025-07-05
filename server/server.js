import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import produceRoutes from "./routes/produceRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
    res.send("FarmBridge API is running 🚜");
});

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`✅ User ${userId} joined their personal room for messaging.`);
    });

    socket.on("send_message", ({ senderId, receiverId, content }) => {
        console.log(`📨 Message from ${senderId} to ${receiverId}: ${content}`);
        io.to(receiverId).emit("new_message", { senderId, content });
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
    });
});

server.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
