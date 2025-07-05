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
        const buyer = await User.findById(req.user._id);
        if (!buyer) return res.status(404).json({ message: "Buyer not found" });

        let filter = {};
        let query = null;

        if (crop) {
            // If a specific crop is selected
            filter.name = crop;
            query = Produce.find(filter);
        } else if (buyer.interestedCrops && buyer.interestedCrops.length > 0) {
            // If buyer has interested crops, show matching
            filter.name = { $in: buyer.interestedCrops };
            query = Produce.find(filter);
        } else {
            // If no interests and no crop selected, show latest 6 produce
            query = Produce.find({});
        }

        // Common population
        query = query
            .populate("farmer", "name location email phone")
            .sort({ createdAt: -1 });

        if (!crop && (!buyer.interestedCrops || buyer.interestedCrops.length === 0)) {
            // Apply limit if showing latest
            query = query.limit(6);
        }

        const produce = await query.exec();

        res.status(200).json(produce);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};