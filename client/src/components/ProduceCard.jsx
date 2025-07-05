// src/components/ProduceCard.jsx

export default function ProduceCard({ item, showFarmer = false }) {
    return (
        <div className="border rounded shadow p-4 space-y-2 bg-white">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p>{item.description || "No description provided."}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ₹{item.price}</p>
            {item.availabilityWindow?.startDate && (
                <p>
                    Available: {new Date(item.availabilityWindow.startDate).toLocaleDateString()} -{" "}
                    {new Date(item.availabilityWindow.endDate).toLocaleDateString()}
                </p>
            )}
            {item.images && item.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                    {item.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Produce ${idx}`} className="h-20 rounded" />
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
        </div>
    );
}
