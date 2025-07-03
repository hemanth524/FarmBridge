import Produce from "../models/Produce.js";
import cloudinary from "../config/cloudinary.js";

// Add Produce
export const addProduce = async (req, res) => {
  const { name, description, quantity, price, availabilityWindow, images: imageBase64Array } = req.body;
  try {
    const images = [];

    if (imageBase64Array && Array.isArray(imageBase64Array)) {
      for (const base64String of imageBase64Array) {
        const result = await cloudinary.v2.uploader.upload(base64String, {
          folder: "farmbridge/produce",
        });
        images.push(result.secure_url);
      }
    }

    const produce = await Produce.create({
      farmer: req.user._id,
      name,
      description,
      quantity,
      price,
      availabilityWindow,
      images,
    });

    res.status(201).json(produce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Produce
export const getAllProduce = async (req, res) => {
  try {
    const produce = await Produce.find().populate("farmer", "name location");
    res.status(200).json(produce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Produce by Farmer
export const getMyProduce = async (req, res) => {
  try {
    const produce = await Produce.find({ farmer: req.user._id });
    res.status(200).json(produce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Produce
export const updateProduce = async (req, res) => {
  const { id } = req.params;
  try {
    const produce = await Produce.findById(id);
    if (!produce) return res.status(404).json({ message: "Produce not found" });
    if (produce.farmer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    const updated = await Produce.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Produce
export const deleteProduce = async (req, res) => {
  const { id } = req.params;
  try {
    const produce = await Produce.findById(id);
    if (!produce) return res.status(404).json({ message: "Produce not found" });
    if (produce.farmer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await produce.deleteOne();
    res.status(200).json({ message: "Produce deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
