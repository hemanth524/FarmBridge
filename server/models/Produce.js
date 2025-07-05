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
  },
  { timestamps: true }
);

const Produce = mongoose.model("Produce", produceSchema);
export default Produce;
