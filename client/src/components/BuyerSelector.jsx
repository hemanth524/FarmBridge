import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function BuyerSelector({ selectedCrop, onBuyersSelected }) {
    const { backendURL, user } = useContext(AuthContext);
    const [buyers, setBuyers] = useState([]);
    const [selectedBuyers, setSelectedBuyers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBuyers = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(`${backendURL}/buyers/interested/${selectedCrop}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setBuyers(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch buyers.");
            }
            setLoading(false);
        };
        if (selectedCrop) {
            fetchBuyers();
        }
    }, [selectedCrop]);

    const toggleBuyer = (buyerId) => {
        setSelectedBuyers(prev =>
            prev.includes(buyerId)
                ? prev.filter(id => id !== buyerId)
                : [...prev, buyerId]
        );
    };

    useEffect(() => {
        onBuyersSelected(selectedBuyers);
    }, [selectedBuyers]);

    if (!selectedCrop) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Buyers interested in {selectedCrop}</h2>
            {loading && <p>Loading buyers...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && buyers.length === 0 && <p>No buyers found for this crop.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {buyers.map(buyer => (
                    <div
                        key={buyer._id}
                        className={`border p-3 rounded cursor-pointer ${selectedBuyers.includes(buyer._id) ? "bg-green-200" : "bg-white"}`}
                        onClick={() => toggleBuyer(buyer._id)}
                    >
                        <h3 className="font-semibold">{buyer.name}</h3>
                        <p>📍 {buyer.location || "N/A"}</p>
                        <p>📧 {buyer.email}</p>
                        <p>📞 {buyer.phone || "N/A"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
