import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProduceCard({
    item,
    showFarmer = false,
    selectionMode = false,
    onSelect = () => {},
    onDelete = () => {},
}) {
    const [isSelected, setIsSelected] = useState(false);
    const { backendURL, user } = useContext(AuthContext);

    const handleSelect = () => {
        setIsSelected(!isSelected);
        onSelect(item.farmer._id, !isSelected);
    };

    const isExpired =
        item.availabilityWindow?.endDate &&
        new Date(item.availabilityWindow.endDate) < new Date();

    const isOwner = user?._id === item.farmer?._id;

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this produce?")) return;

        try {
            await axios.delete(`${backendURL}/produce/${item._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            toast.success("Produce deleted");
            onDelete(item._id); // trigger a refetch or UI update
        } catch (err) {
            toast.error("Failed to delete produce");
        }
    };

    return (
        <div
            className={`border rounded shadow p-4 space-y-2 bg-white transition ${
                isSelected ? "bg-green-100 border-green-400" : ""
            }`}
        >
            {selectionMode && (
                <div>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleSelect}
                        className="mb-2 accent-green-600"
                    />
                    <span className="text-sm text-gray-700">Select for bidding</span>
                </div>
            )}

            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p>{item.description || "No description provided."}</p>
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
                <div className="flex gap-2 overflow-x-auto">
                    {item.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Produce ${idx}`}
                            className="h-20 rounded"
                        />
                    ))}
                </div>
            )}

            {showFarmer && item.farmer && (
                <div className="mt-2 text-sm text-gray-700">
                    <p>👨‍🌾 <b>Farmer:</b> {item.farmer.name}</p>
                    <p>📍 {item.farmer.location || "N/A"}</p>
                    <p>📧 {item.farmer.email}</p>
                    <p>📞 {item.farmer.phone || "N/A"}</p>
                </div>
            )}

            {/* ✅ Delete button shown only if expired and owned by current user */}
            {isExpired && (
                <button
                    onClick={handleDelete}
                    className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Delete Expired Produce
                </button>
            )}
        </div>
    );
}
