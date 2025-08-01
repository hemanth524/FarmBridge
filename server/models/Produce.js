import mongoose from "mongoose";

const produceSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    availabilityWindow: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
    images: [{ type: String }],
    buyers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    paymentStatus: {
  type: String,
  enum: ["pending", "done"],
  default: "pending",
},
paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
paidTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
paymentDetails: {
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paymentDate: Date,
},
biddingStatus: {
  type: String,
  enum: ["not_started", "ongoing", "completed"],
  default: "not_started",
},


  },
  { timestamps: true }
);

const Produce = mongoose.model("Produce", produceSchema);
export default Produce;
