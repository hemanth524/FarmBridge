import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function BuyerSelector({ selectedCrop, onBuyersSelected }) {
    const { backendURL, user } = useContext(AuthContext);
    const [buyers, setBuyers] = useState([]);
    const [selectedBuyers, setSelectedBuyers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showAll, setShowAll] = useState(false);

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
            setSelectedBuyers([]);
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
        <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                    Select Buyers interested in <span className="text-green-600">{selectedCrop}</span>
                </h2>
                {selectedBuyers.length > 0 && (
                    <button
                        onClick={() => setShowAll(prev => !prev)}
                        className="text-sm text-green-600 underline hover:text-green-800"
                    >
                        {showAll ? "Hide" : `View All (${selectedBuyers.length})`}
                    </button>
                )}
            </div>

            {loading && <p>Loading buyers...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && buyers.length === 0 && (
                <p className="text-gray-600 italic">No buyers found for this crop.</p>
            )}

            {/* Selected buyers row */}
            {selectedBuyers.length > 0 && (
                <div className={`flex flex-wrap gap-2 p-2 bg-gray-100 rounded-md`}>
                    {selectedBuyers.slice(0, 3).map(id => {
                        const buyer = buyers.find(b => b._id === id);
                        return buyer ? (
                            <span
                                key={buyer._id}
                                className="text-sm bg-green-200 text-green-800 px-3 py-1 rounded-full"
                            >
                                {buyer.name}
                            </span>
                        ) : null;
                    })}
                    {selectedBuyers.length > 3 && !showAll && (
                        <span className="text-sm text-gray-500">+{selectedBuyers.length - 3} more</span>
                    )}
                </div>
            )}

            {/* Buyer cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {buyers.map(buyer => (
                    <div
                        key={buyer._id}
                        className={`border p-4 rounded-lg cursor-pointer transition ${
                            selectedBuyers.includes(buyer._id)
                                ? "bg-green-100 border-green-300"
                                : "bg-white hover:shadow"
                        }`}
                        onClick={() => toggleBuyer(buyer._id)}
                    >
                        <h3 className="font-semibold text-gray-800">{buyer.name}</h3>
                        <p className="text-sm text-gray-600">📍 {buyer.location || "N/A"}</p>
                        <p className="text-sm text-gray-600">📧 {buyer.email}</p>
                        <p className="text-sm text-gray-600">📞 {buyer.phone || "N/A"}</p>
                    </div>
                ))}
            </div>

            {/* Expanded buyer list */}
            {showAll && (
                <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium text-gray-700 mb-2">All Selected Buyers</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                        {selectedBuyers.map(id => {
                            const buyer = buyers.find(b => b._id === id);
                            return buyer ? <li key={id}>{buyer.name}</li> : null;
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
