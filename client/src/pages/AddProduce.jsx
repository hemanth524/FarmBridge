import { useState } from "react";
import CropSelector from "../components/CropSelector";
import BuyerSelector from "../components/BuyerSelector";
import ProduceForm from "../components/ProduceForm";

export default function AddProduce() {
    const crops = ["Wheat", "Rice", "Corn", "Tomato", "Potato"];
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [selectedBuyers, setSelectedBuyers] = useState([]);

    return (
        <div className="flex min-h-screen   bg-gray-200">
            <CropSelector
                crops={crops}
                selectedCrop={selectedCrop}
                onSelectCrop={setSelectedCrop}
            />
            <div className="w-full md:w-3/4 p-6">
                {!selectedCrop ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-lg italic border-2 border-dashed rounded p-8">
                        Select a crop from the left to begin.
                    </div>
                ) : (
                    <>
                        <BuyerSelector
                            selectedCrop={selectedCrop}
                            onBuyersSelected={setSelectedBuyers}
                        />
                        <ProduceForm
                            selectedCrop={selectedCrop}
                            selectedBuyers={selectedBuyers}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
