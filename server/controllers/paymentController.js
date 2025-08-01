// --- backend/controllers/paymentController.ts ---

import Razorpay from "razorpay";
import crypto from "crypto";
import BidSession from "../models/BidSession.js";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🧾 GET completed bids for a buyer
export const getBuyerPayments = async (req, res) => {
  try {
    const sessions = await BidSession.find({
      buyer: req.user._id,
      status: "completed",
    })
      .populate("highestBid.farmer")
      .populate("produce");

    const result = sessions.map((session) => ({
      _id: session._id,
      name: session.produce?.name || "Unknown",
      farmer: session.highestBid?.farmer,
      price: session.highestBid?.amount,
      paymentStatus: session.paymentStatus || "pending",
      paymentDetails: session.paymentDetails || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Buyer payment fetch error:", err.message);
    res.status(500).json({ message: "Error fetching buyer payments." });
  }
};

// 💰 GET completed bids won by a farmer
export const getFarmerPayments = async (req, res) => {
  try {
    const sessions = await BidSession.find({
      "highestBid.farmer": req.user._id,
      status: "completed",
    })
      .populate("produce")
      .populate("buyer");

    const result = sessions.map((session) => ({
      _id: session._id,
      name: session.produce?.name || "Unknown",
      paidBy: session.buyer,
      price: session.highestBid?.amount,
      paymentStatus: session.paymentStatus || "pending",
      paymentDetails: session.paymentDetails || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Farmer payment fetch error:", err.message);
    res.status(500).json({ message: "Error fetching farmer payments." });
  }
};

// 📦 CREATE Razorpay order
export const createOrder = async (req, res) => {
  const { produceId, amount } = req.body;
  const options = {
    amount: amount * 100, 
    currency: "INR",
    receipt: produceId,
  };
  const order = await instance.orders.create(options);
  res.json(order);
};

// ✅ VERIFY Razorpay payment
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, produceId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await BidSession.findByIdAndUpdate(produceId, {
      paymentStatus: "done",
      paymentDetails: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentDate: new Date(),
      },
    });
    return res.json({ message: "Payment verified and status updated." });
  }

  res.status(400).json({ message: "Invalid signature." });
};
