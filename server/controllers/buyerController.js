import User from "../models/User.js";
import Produce from "../models/Produce.js";

export const getInterestedBuyers = async (req, res) => {
  const { crop } = req.params;
  try {
    const buyers = await User.find({
      role: "buyer",
      interestedCrops: crop
    }).select("_id name location email phone");

    res.status(200).json(buyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateInterestedCrops = async (req, res) => {
    try {
        const { crops } = req.body; // ["Wheat", "Corn", ...]
        if (!Array.isArray(crops)) {
            return res.status(400).json({ message: "Crops must be an array." });
        }
        req.user.interestedCrops = crops;
        await req.user.save();
        res.status(200).json({ message: "Interested crops updated.", interestedCrops: crops });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProduceForBuyer = async (req, res) => {
  const { crop } = req.query;
  try {
    const buyerId = req.user._id;

    const filter = {
      buyers: buyerId,
      biddingStatus: "not_started", // only available for bidding
      $or: [
        { paymentStatus: { $ne: "done" } },
        { paidBy: { $exists: false } }
      ]
    };

    if (crop) {
      filter.name = crop;
    }

    const produce = await Produce.find(filter)
      .populate("farmer", "name location email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(produce);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};


