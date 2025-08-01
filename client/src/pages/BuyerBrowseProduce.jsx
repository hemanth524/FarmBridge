import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import CropSelector from "../components/CropSelector";
import ProduceCard from "../components/ProduceCard";

export default function BuyerBrowseProduce() {
    const { backendURL, user } = useContext(AuthContext);
    const [crops, setCrops] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(() => localStorage.getItem("selectedCrop") || "");
    const [produceList, setProduceList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFarmers, setSelectedFarmers] = useState(new Set());
    const [selectedProduceId, setSelectedProduceId] = useState(null);

    useEffect(() => {
        const fetchProduce = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const url = selectedCrop
                    ? `${backendURL}/buyers/my-produce?crop=${selectedCrop}`
                    : `${backendURL}/buyers/my-produce`;

                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setProduceList(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch produce.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduce();
    }, [selectedCrop, user]);

    useEffect(() => {
        localStorage.setItem("selectedCrop", selectedCrop);
    }, [selectedCrop]);

    useEffect(() => {
        if (user?.interestedCrops) {
            setCrops(user.interestedCrops);
        }
    }, [user]);

    const handleSelectFarmer = (farmerId, isSelected) => {
        const produce = produceList.find((p) => p.farmer._id === farmerId);
        if (produce) setSelectedProduceId(produce._id);

        setSelectedFarmers((prev) => {
            const updated = new Set(prev);
            isSelected ? updated.add(farmerId) : updated.delete(farmerId);
            return updated;
        });
    };

    const handleStartBidding = async () => {
        const basePrice = parseFloat(prompt("Enter base price for bidding:"));
        const startTime = prompt("Enter bidding start time in ISO (YYYY-MM-DDTHH:MM:SSZ):");

        if (!basePrice || !startTime) {
            toast.error("Base price and start time are required.");
            return;
        }

        try {
            const res = await axios.post(
                `${backendURL}/bids/create`,
                {
                    farmers: Array.from(selectedFarmers),
                    produceId: selectedProduceId,
                    basePrice,
                    startTime,
                },
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );
            toast.success("Bidding scheduled successfully. Farmers notified.");
            setSelectedFarmers(new Set());
            setSelectedProduceId(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to schedule bidding.");
        }
    };

    return (
        <div className="bg-gradient-to-br from-green-100 via-white to-green-200 min-h-screen p-4">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Crop Selector */}

                    <CropSelector
                        crops={crops}
                        selectedCrop={selectedCrop}
                        onSelectCrop={setSelectedCrop}
                    />
                {/* Right: Produce Display */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
                        {selectedCrop ? `Produce for ${selectedCrop}` : "All Produce Matching Your Interests"}
                    </h2>

                    {loading ? (
                        <p className="text-center text-gray-600 text-lg">Loading produce...</p>
                    ) : produceList.length === 0 ? (
                        <p className="text-center text-gray-600 text-lg">No produce found for your interests.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {produceList.map((item) => (
                                <ProduceCard
                                    key={item._id}
                                    item={item}
                                    showFarmer={true}
                                    selectionMode={true}
                                    onSelect={handleSelectFarmer}
                                />
                            ))}
                        </div>
                    )}

                    {selectedFarmers.size > 0 && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleStartBidding}
                                className="bg-green-600 hover:bg-green-700 text-white text-lg font-medium px-8 py-3 rounded-lg shadow-md transition-all duration-200"
                            >
                                Start Bidding
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
