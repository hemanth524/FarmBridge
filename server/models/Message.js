import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    produce: { type: mongoose.Schema.Types.ObjectId, ref: "Produce" },
    read: { type: Boolean, default: false },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
