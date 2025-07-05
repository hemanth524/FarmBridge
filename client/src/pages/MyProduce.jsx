import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function MyProduce() {
    const { backendURL, user } = useContext(AuthContext);
    const [produceList, setProduceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    let ignore = false;
    const fetchMyProduce = async () => {
        console.log("Fetching produce...");
        try {
            const res = await axios.get(`${backendURL}/produce/my`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!ignore) setProduceList(res.data);
        } catch (err) {
            if (!ignore) setError(err.response?.data?.message || "Failed to fetch your produce.");
        } finally {
            if (!ignore) setLoading(false);
        }
    };
    if (user) fetchMyProduce();
    return () => { ignore = true; };
}, [user]);

    if (loading) return <p className="text-center mt-6">Loading your produce...</p>;
    if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
    if (produceList.length === 0) return <p className="text-center mt-6">You have not added any produce yet.</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold text-center">📦 Your Produce</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {produceList.map(item => (
                    <div key={item._id} className="border rounded shadow p-4 space-y-2">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p>{item.description || "No description provided."}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price}</p>
                        {item.availabilityWindow?.startDate && (
                            <p>Available: {new Date(item.availabilityWindow.startDate).toLocaleDateString()} - {new Date(item.availabilityWindow.endDate).toLocaleDateString()}</p>
                        )}
                        {item.images && item.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {item.images.map((img, idx) => (
                                    <img key={idx} src={img} alt={`Produce ${idx}`} className="h-20 rounded" />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
