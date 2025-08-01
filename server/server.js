import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import produceRoutes from "./routes/produceRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import bidRoutes from "./routes/bidRoutes.js"; // ✅ Ensure bidRoutes is imported

import BidSession from "./models/BidSession.js"; 
import paymentRoutes from "./routes/paymentRoutes.js";


dotenv.config();

const app = express();

// Enable CORS
app.use(cors());


// Parse JSON and URL-encoded data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// REST API Routes

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/bids", bidRoutes); // ✅ Mount bidRoutes
app.use("/api/payments", paymentRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("🌿 FarmBridge API is running 🚜");
});

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust to frontend URL in production
        methods: ["GET", "POST", "PUT"],
    },
});

// Live messaging and bidding socket handlers
io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Join personal room for messaging
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`✅ User ${userId} joined personal room.`);
    });

    // Basic messaging
    socket.on("send_message", ({ senderId, receiverId, content }) => {
        console.log(`📨 Message from ${senderId} to ${receiverId}: ${content}`);
        io.to(receiverId).emit("new_message", { senderId, content });
    });

    // ==================== BIDDING SOCKET HANDLERS ====================

 socket.on("join_bidding", async (bidSessionId, userId) => {
    socket.join(bidSessionId);
    console.log(`✅ User ${userId} joined bidding room ${bidSessionId}`);

    try {
        const farmer = await User.findById(userId).select("name _id role avatar");
        if (farmer && farmer.role === "farmer") {
            await BidSession.findByIdAndUpdate(
                bidSessionId,
                { $addToSet: { joinedFarmers: farmer._id } },
                { new: true }
            );
            console.log(`✅ Farmer ${farmer.name} ensured in joinedFarmers (deduplicated).`);

            io.to(bidSessionId).emit("farmer_joined", { farmer });
        } else {
            console.log(`ℹ️ User ${userId} is not a farmer or does not exist.`);
        }
    } catch (error) {
        console.error("❌ Error notifying farmer joined:", error.message);
    }
});


    socket.on("start_bidding", async (bidSessionId) => {
        try {
            const bidSession = await BidSession.findById(bidSessionId).populate("produce buyer farmers");
            if (!bidSession) {
                console.error("❌ Bid session not found:", bidSessionId);
                return;
            }
            bidSession.status = "active";
            await bidSession.save();

            io.to(bidSessionId).emit("bidding_started", {
                message: `Bidding for ${bidSession.produce.name} has started!`,
                bidSessionId,
                basePrice: bidSession.basePrice,
                produce: bidSession.produce,
            });

            console.log(`🚀 Bidding started for session ${bidSessionId}`);
        } catch (error) {
            console.error("❌ Error starting bidding:", error.message);
        }
    });

    socket.on("place_bid", async ({ bidSessionId, farmerId, amount }) => {
        try {
            const bidSession = await BidSession.findById(bidSessionId);
            if (!bidSession || bidSession.status !== "active") {
                socket.emit("error", { message: "Bidding session not active or not found." });
                return;
            }

            if (!bidSession.highestBid.amount || amount > bidSession.highestBid.amount) {
                bidSession.highestBid = { amount, farmer: farmerId };
                bidSession.bids.push({
                    farmer: farmerId,
                    amount,
                    time: new Date(),
                });
                await bidSession.save();

                io.to(bidSessionId).emit("bid_update", {
                    message: `New highest bid: ₹${amount}`,
                    bidSessionId,
                    highestBid: bidSession.highestBid,
                });

                console.log(`💰 New bid in session ${bidSessionId}: ₹${amount} by ${farmerId}`);
            } else {
                socket.emit("bid_rejected", { message: "Bid must be higher than current highest bid." });
            }
        } catch (error) {
            console.error("❌ Error placing bid:", error.message);
        }
    });

    socket.on("end_bidding", async (bidSessionId) => {
        try {
            const bidSession = await BidSession.findById(bidSessionId);
            if (!bidSession) {
                console.error("❌ Bid session not found for ending:", bidSessionId);
                return;
            }
            bidSession.status = "completed";
            bidSession.endTime = new Date();
            await bidSession.save();

            io.to(bidSessionId).emit("bidding_ended", {
                message: `Bidding has ended.`,
                bidSessionId,
                highestBid: bidSession.highestBid,
            });

            console.log(`✅ Bidding ended for session ${bidSessionId}`);
        } catch (error) {
            console.error("❌ Error ending bidding:", error.message);
        }
    });

    // ==================== END BIDDING SOCKET HANDLERS ====================

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
    });
});

// Attach io to req.io if needed for controllers


// Start server
server.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
