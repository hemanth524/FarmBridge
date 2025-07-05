// src/components/CropSelector.jsx

export default function CropSelector({ crops, selectedCrop, onSelectCrop }) {
    const constantCrops = ["Wheat", "Rice", "Corn", "Barley", "Soybean", "Potato", "Tomato", "other"];

    // Filter out constants from user crops to avoid duplicates
    const extraCrops = crops.filter(crop => !constantCrops.includes(crop));

    return (
        <div className="w-1/4 bg-green-100 p-4 space-y-2">
            <h2 className="text-lg font-semibold">Select Crop</h2>

            {/* Clear Selection Button */}
            <button
                onClick={() => onSelectCrop("")}
                className={`w-full p-2 rounded ${selectedCrop === "" ? "bg-green-600 text-white" : "bg-white hover:bg-green-200"}`}
            >
                Clear Selection
            </button>

            {/* Divider */}
            <hr className="my-2 border-gray-400" />

            {/* Constant crops */}
            {constantCrops.map(crop => (
                <button
                    key={crop}
                    onClick={() => onSelectCrop(crop)}
                    className={`w-full p-2 rounded ${selectedCrop === crop ? "bg-green-600 text-white" : "bg-white hover:bg-green-200"}`}
                >
                    {crop}
                </button>
            ))}

            {/* Divider */}
            {extraCrops.length > 0 && <hr className="my-2 border-gray-400" />}

            {/* Extra user crops */}
            {extraCrops.map(crop => (
                <button
                    key={crop}
                    onClick={() => onSelectCrop(crop)}
                    className={`w-full p-2 rounded ${selectedCrop === crop ? "bg-green-600 text-white" : "bg-white hover:bg-green-200"}`}
                >
                    {crop}
                </button>
            ))}
        </div>
    );
}
