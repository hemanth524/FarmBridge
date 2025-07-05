import { useState } from "react";
import CropSelector from "../components/CropSelector";
import BuyerSelector from "../components/BuyerSelector";
import ProduceForm from "../components/ProduceForm";

export default function AddProduce() {
    const crops = ["Wheat", "Rice", "Corn", "Tomato", "Potato"];
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [selectedBuyers, setSelectedBuyers] = useState([]);

    return (
        <div className="flex min-h-screen">
            <CropSelector crops={crops} selectedCrop={selectedCrop} onSelectCrop={setSelectedCrop} />
            <div className="w-3/4 p-4 space-y-4">
                <BuyerSelector selectedCrop={selectedCrop} onBuyersSelected={setSelectedBuyers} />
                <ProduceForm selectedCrop={selectedCrop} selectedBuyers={selectedBuyers} />
            </div>
        </div>
    );
}
