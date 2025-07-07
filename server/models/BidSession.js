import mongoose from "mongoose";

const bidSessionSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    produce: { type: mongoose.Schema.Types.ObjectId, ref: "Produce", required: true },
    basePrice: { type: Number, required: true },
    status: { type: String, enum: ["scheduled", "active", "completed"], default: "scheduled" },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    highestBid: {
        amount: { type: Number },
        farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    bids: [{
        farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: Number,
        time: Date,
    }],
    joinedFarmers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const BidSession = mongoose.model("BidSession", bidSessionSchema);
export default BidSession;
