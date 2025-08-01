    import BidSession from "../models/BidSession.js";
    import User from "../models/User.js";
    import Produce from "../models/Produce.js";


    // Create a bidding session
    export const createBidSession = async (req, res) => {
        try {
            const { farmers, produceId, basePrice, startTime } = req.body;
            if (!farmers || !produceId || !basePrice || !startTime) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const produce = await Produce.findById(produceId);
            if (!produce) return res.status(404).json({ message: "Produce not found" });

            const bidSession = new BidSession({
                buyer: req.user._id,
                farmers,
                produce: produceId,
                basePrice,
                startTime: new Date(startTime),
            });
            await bidSession.save();

            // Send notification via Socket.IO
            farmers.forEach(farmerId => {
                req.io.to(farmerId.toString()).emit("bidding_scheduled", {
                    message: `Bidding scheduled for produce ${produce.name} at ${new Date(startTime).toLocaleString()}`,
                    bidSessionId: bidSession._id
                });
            });

            res.status(201).json(bidSession);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    };

    // Get bidding sessions for buyer or farmer
    export const getBidSessionsForUser = async (req, res) => {
        try {
            let sessions;
            if (req.user.role === "buyer") {
                sessions = await BidSession.find({ buyer: req.user._id })
                    .populate("produce", "name")
                    .populate("highestBid.farmer", "name")
                    .sort({ createdAt: -1 });
            } else {
                sessions = await BidSession.find({ farmers: req.user._id })
                    .populate("produce", "name")
                    .populate("highestBid.farmer", "name")
                    .sort({ createdAt: -1 });
            }
            res.status(200).json(sessions);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };


    export const getBidSessionById = async (req, res) => {
        try {
            const session = await BidSession.findById(req.params.id)
                .populate("produce", "name")
                .populate("buyer", "name avatar role _id")
                .populate("farmers", "name avatar role _id")
                .populate("bids.farmer", "name")
                .populate("highestBid.farmer", "name avatar role _id")
                .populate("joinedFarmers", "name avatar role _id");

            if (!session) {
                return res.status(404).json({ message: "Bidding session not found." });
            }

            // Authorization check
            if (
                req.user.role === "farmer" &&
                !session.farmers.some((f) => f._id.toString() === req.user._id.toString())
            ) {
                return res.status(403).json({ message: "You are not authorized to view this session." });
            }

            if (
                req.user.role === "buyer" &&
                session.buyer._id.toString() !== req.user._id.toString()
            ) {
                return res.status(403).json({ message: "You are not authorized to view this session." });
            }

            // ✅ Construct joinedUsers for frontend
            const joinedUsers = [
                {
                    _id: session.buyer._id,
                    name: session.buyer.name,
                    avatar: session.buyer.avatar || "",
                    role: session.buyer.role,
                },
                ...session.joinedFarmers.map(farmer => ({
                    _id: farmer._id,
                    name: farmer.name,
                    avatar: farmer.avatar || "",
                    role: farmer.role,
                }))
            ];

            res.status(200).json({
                _id: session._id,
                buyer: session.buyer,
                farmers: session.farmers,
                produce: session.produce,
                basePrice: session.basePrice,
                status: session.status,
                startTime: session.startTime,
                endTime: session.endTime,
                bids: session.bids,
                highestBid: session.highestBid,
                joinedUsers,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    };



export const completeBiddingSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await BidSession.findById(sessionId)
      .populate("produce")
      .populate("highestBid.farmer")
      .populate("buyer");

    if (!session || session.status !== "active") {
      return res.status(400).json({ message: "Session not found or already completed." });
    }

    if (!session.highestBid || !session.highestBid.farmer) {
      return res.status(400).json({ message: "No winning bid to complete." });
    }

    session.status = "completed";
    session.endTime = new Date();
    await session.save();

    // ✅ Update the produce with complete info
    await Produce.findByIdAndUpdate(session.produce._id, {
      price: session.highestBid.amount,
      paidBy: session.buyer._id,
      paidTo: session.highestBid.farmer._id,
      paymentStatus: "pending",
      farmer: session.highestBid.farmer._id,
      name: session.produce.name,
    });

    return res.status(200).json({ message: "Bidding session completed and produce marked for payment." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while completing bidding session." });
  }
};
