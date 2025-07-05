import Message from "../models/Message.js";
import User from "../models/User.js";

// Send message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, produceId } = req.body;
        if (!receiverId || !content) {
            return res.status(400).json({ message: "receiverId and content are required." });
        }

        const message = new Message({
            sender: req.user._id,
            receiver: receiverId,
            content,
            produce: produceId || null
        });

        await message.save();

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all messages for the logged-in user
export const getMessagesForUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
            .populate("sender", "name email role")
            .populate("receiver", "name email role")
            .populate("produce", "name")
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark a message as read
export const markMessageRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: "Message not found" });

        if (message.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        message.read = true;
        await message.save();

        res.status(200).json({ message: "Message marked as read." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getConversationWithContact = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const contactId = req.params.contactId;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: contactId },
                { sender: contactId, receiver: userId },
            ],
        })
        .populate("sender", "name email role")
        .populate("receiver", "name email role")
        .populate("produce", "name")
        .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};