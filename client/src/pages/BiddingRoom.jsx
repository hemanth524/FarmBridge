// src/pages/BiddingRoom.jsx

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function BiddingRoom() {
    const { bidSessionId } = useParams();
    const { user, backendURL, loading: userLoading } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);

    const [bidSession, setBidSession] = useState(null);
    const [highestBid, setHighestBid] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [joinedUsers, setJoinedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch bid session details
    useEffect(() => {
        if (!user || userLoading) return;

        const fetchBidSession = async () => {
            try {
                const res = await axios.get(`${backendURL}/bids/${bidSessionId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const session = res.data;
                if (session) {
                    setBidSession(session);
                    setHighestBid(session.highestBid);
                    setJoinedUsers(session.joinedUsers || []);
                } else {
                    toast.error("Bidding session not found.");
                }
            } catch (error) {
                toast.error("Failed to fetch bidding session.");
            } finally {
                setLoading(false);
            }
        };

        fetchBidSession();
    }, [bidSessionId, user, userLoading]);

    // Join bidding room
    useEffect(() => {
        if (!socket || !user || !user._id || userLoading) return;
        socket.emit("join_bidding", bidSessionId, user._id);
    }, [socket, user, userLoading, bidSessionId]);

    // Handle socket events
    useEffect(() => {
        if (!socket) return;

        const handleBidUpdate = (data) => {
            setHighestBid(data.highestBid);
            toast.success(data.message);
        };

        const handleBiddingStarted = (data) => {
            toast.success(data.message);
            setBidSession((prev) => ({ ...prev, status: "active" }));
        };

        const handleBiddingEnded = (data) => {
            toast.success(data.message);
            setBidSession((prev) => ({ ...prev, status: "completed" }));
        };

        const handleUserJoined = (data) => {
            setJoinedUsers(data.joinedUsers);
            toast.success(`${data.user.name} joined the bidding.`);
        };

        socket.on("bid_update", handleBidUpdate);
        socket.on("bidding_started", handleBiddingStarted);
        socket.on("bidding_ended", handleBiddingEnded);
        socket.on("user_joined", handleUserJoined);

        return () => {
            socket.off("bid_update", handleBidUpdate);
            socket.off("bidding_started", handleBiddingStarted);
            socket.off("bidding_ended", handleBiddingEnded);
            socket.off("user_joined", handleUserJoined);
        };
    }, [socket]);

    const handleStartBidding = () => {
        if (socket && bidSessionId) {
            socket.emit("start_bidding", bidSessionId);
        }
    };

    const handleEndBidding = () => {
        if (socket && bidSessionId) {
            socket.emit("end_bidding", bidSessionId);
        }
    };

    const handlePlaceBid = () => {
        const amount = parseFloat(bidAmount);
        if (!amount || amount <= 0) {
            toast.error("Enter a valid bid amount.");
            return;
        }
        if (socket && bidSessionId && user && user._id) {
            socket.emit("place_bid", {
                bidSessionId,
                farmerId: user._id,
                amount,
            });
            setBidAmount("");
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading bidding session...</div>;
    }

    if (!bidSession) {
        return <div className="p-4 text-center">Bidding session not found.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold text-center">
                Bidding Room for {bidSession.produce?.name}
            </h2>
            <p className="text-center">
                Status: {" "}
                <span
                    className={
                        bidSession.status === "active"
                            ? "text-green-600"
                            : bidSession.status === "scheduled"
                                ? "text-yellow-600"
                                : "text-gray-600"
                    }
                >
                    {bidSession.status.toUpperCase()}
                </span>
            </p>
            <p className="text-center">
                Base Price: ₹{bidSession.basePrice} | Current Highest Bid: ₹
                {highestBid?.amount || "None"}
            </p>

            {user.role === "buyer" && bidSession.status === "scheduled" && (
                <div className="flex justify-center">
                    <button
                        onClick={handleStartBidding}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Start Bidding
                    </button>
                </div>
            )}

            {user.role === "buyer" && bidSession.status === "active" && (
                <div className="flex justify-center">
                    <button
                        onClick={handleEndBidding}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        End Bidding
                    </button>
                </div>
            )}

            {/* User Grid */}
            <div>
                <h3 className="text-lg font-semibold mt-4 text-center">Users in Bidding Room</h3>
                {joinedUsers.length === 0 ? (
                    <p className="text-center">No users joined yet.</p>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4 justify-items-center">
                        {/* First row: Buyer */}
                        {joinedUsers
                            .filter((u) => u.role === "buyer")
                            .map((user) => (
                                <div
                                    key={user._id}
                                    className="flex flex-col items-center p-2 border rounded-xl shadow hover:shadow-lg transition"
                                >
                                    <img
                                        src={user.avatar || "/default-avatar.png"}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover border"
                                    />
                                    <p className="mt-2 text-center font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500">(Buyer)</p>
                                </div>
                            ))}

                        {/* Below: All Farmers */}
                        {joinedUsers
                            .filter((u) => u.role === "farmer")
                            .map((user) => (
                                <div
                                    key={user._id}
                                    className="flex flex-col items-center p-2 border rounded-xl shadow hover:shadow-lg transition"
                                >
                                    <img
                                        src={user.avatar || "/default-avatar.png"}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover border"
                                    />
                                    <p className="mt-2 text-center font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500">(Farmer)</p>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {user.role === "farmer" && bidSession.status === "active" && (
                <div className="space-y-2">
                    <input
                        type="number"
                        placeholder="Enter your bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="border p-2 w-full rounded"
                    />
                    <button
                        onClick={handlePlaceBid}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                    >
                        Place Bid
                    </button>
                </div>
            )}

            {bidSession.status === "completed" && (
                <div className="text-center font-semibold text-green-700">
                    Bidding completed.
                    {highestBid?.farmer && (
                        <p>
                            Winner: {highestBid.farmer.name} with bid ₹{highestBid.amount}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}