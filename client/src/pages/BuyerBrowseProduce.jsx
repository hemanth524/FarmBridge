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
    
    useEffect(() => {
        const fetchProduce = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const url = selectedCrop
                    ? `${backendURL}/buyers/my-produce?crop=${selectedCrop}`
                    : `${backendURL}/buyers/my-produce`;

                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${user.token}` }
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

    return (
        <div className="flex">
            {/* Left: Crop Selector */}
            <CropSelector
                crops={crops}
                selectedCrop={selectedCrop}
                onSelectCrop={setSelectedCrop}
            />

            {/* Right: Produce Display */}
            <div className="w-3/4 p-4">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {selectedCrop ? `Produce for ${selectedCrop}` : "All Produce Matching Your Interests"}
                </h2>

                {loading ? (
                    <p className="text-center">Loading produce...</p>
                ) : produceList.length === 0 ? (
                    <p className="text-center">No produce found for your interests.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {produceList.map(item => (
                            <ProduceCard key={item._id} item={item} showFarmer={true} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
