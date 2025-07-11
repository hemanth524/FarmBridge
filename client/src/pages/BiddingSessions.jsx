// src/pages/BiddingSessions.jsx

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function BiddingSessions() {
    const { user, backendURL, loading } = useContext(AuthContext); // ✅ add loading here
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || loading) return; // ✅ prevent fetch before user loads

        const fetchSessions = async () => {
            try {
                const res = await axios.get(`${backendURL}/bids`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setSessions(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch bidding sessions.");
            }
        };

        fetchSessions();
    }, [user, loading]);

    if (loading) {
        return (
            <div className="p-4 text-center">
                Loading your bidding sessions...
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">My Bidding Sessions</h2>
            {sessions.length === 0 ? (
                <p className="text-center">No bidding sessions found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                        <div key={session._id} className="border rounded shadow p-4 bg-white space-y-2">
                            <h3 className="text-lg font-semibold">{session.produce?.name || "Unnamed Produce"}</h3>
                            <p>Status: {session.status}</p>
                            <p>Base Price: ₹{session.basePrice}</p>
                            <p>Start: {new Date(session.startTime).toLocaleString()}</p>
                            {session.endTime && <p>End: {new Date(session.endTime).toLocaleString()}</p>}
                            <button
                                onClick={() => navigate(`/bidding/${session._id}`)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                {session.status === "active" ? "Join Bidding" : "View Details"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
