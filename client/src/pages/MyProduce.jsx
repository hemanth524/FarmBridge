import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function MyProduce() {
    const { backendURL, user } = useContext(AuthContext);
    const [produceList, setProduceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewAll, setViewAll] = useState(false);

    useEffect(() => {
        let ignore = false;

        const fetchMyProduce = async () => {
            try {
                const res = await axios.get(`${backendURL}/produce/my`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (!ignore) setProduceList(res.data.reverse());
            } catch (err) {
                if (!ignore) setError(err.response?.data?.message || "Failed to fetch your produce.");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        if (user) fetchMyProduce();
        return () => { ignore = true; };
    }, [user]);

    const handleDelete = async (produceId) => {
        if (!window.confirm("Are you sure you want to delete this produce?")) return;

        try {
            await axios.delete(`${backendURL}/produce/${produceId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            setProduceList(prev => prev.filter(p => p._id !== produceId));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete produce.");
        }
    };

    if (loading) return <p className="text-center mt-6">Loading your produce...</p>;
    if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
    if (produceList.length === 0) return <p className="text-center mt-6">You have not added any produce yet.</p>;

    const itemsToShow = viewAll ? produceList : produceList.slice(0, 10);

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            <h2 className="text-3xl font-bold text-center">📦 Your Produce</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itemsToShow.map(item => {
                    const isExpired =
                        item.availabilityWindow?.endDate &&
                        new Date(item.availabilityWindow.endDate) < new Date();

                    return (
                        <div key={item._id} className="border rounded shadow p-4 space-y-2 bg-white">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-gray-700">{item.description || "No description provided."}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ₹{item.price}</p>
                            {item.availabilityWindow?.startDate && (
                                <p>
                                    Available:{" "}
                                    {new Date(item.availabilityWindow.startDate).toLocaleDateString()} -{" "}
                                    {new Date(item.availabilityWindow.endDate).toLocaleDateString()}
                                </p>
                            )}
                            {item.images?.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto mt-2">
                                    {item.images.map((img, idx) => (
                                        <img key={idx} src={img} alt={`Produce ${idx}`} className="h-20 w-20 object-cover rounded" />
                                    ))}
                                </div>
                            )}
                            {isExpired && (
                                <p className="text-sm text-red-500 font-medium">⚠️ This produce is expired</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {produceList.length > 10 && (
                <div className="text-center">
                    <button
                        onClick={() => setViewAll(prev => !prev)}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {viewAll ? "Show Less" : "View All"}
                    </button>
                </div>
            )}
        </div>
    );
}
