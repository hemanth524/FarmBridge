// src/components/CropSelector.jsx

export default function CropSelector({ crops, selectedCrop, onSelectCrop }) {
    const constantCrops = ["Wheat", "Rice", "Corn", "Barley", "Soybean", "Potato", "Tomato", "other"];
    const extraCrops = crops.filter(crop => !constantCrops.includes(crop));

    return (
        <aside className="w-full sm:w-1/3 lg:w-1/4 p-6 bg-white shadow-md rounded-2xl border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Select Crop</h2>

            {/* Clear Selection Button */}
            <button
                onClick={() => onSelectCrop("")}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 
                ${selectedCrop === "" ? "bg-green-600 text-white" : "bg-gray-100 hover:bg-green-200 text-gray-700"}`}
            >
                Clear Selection
            </button>

            {/* Constant Crops */}
            <div>
                <p className="text-sm text-gray-500 mb-2">Common Crops</p>
                <div className="grid grid-cols-2 gap-2">
                    {constantCrops.map(crop => (
                        <button
                            key={crop}
                            onClick={() => onSelectCrop(crop)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition 
                            ${selectedCrop === crop
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 hover:bg-green-100 text-gray-800"}`}
                        >
                            {crop}
                        </button>
                    ))}
                </div>
            </div>

            {/* Extra Crops */}
            {extraCrops.length > 0 && (
                <div>
                    <p className="text-sm text-gray-500 mt-4 mb-2">Custom Crops</p>
                    <div className="grid grid-cols-2 gap-2">
                        {extraCrops.map(crop => (
                            <button
                                key={crop}
                                onClick={() => onSelectCrop(crop)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition 
                                ${selectedCrop === crop
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 hover:bg-green-100 text-gray-800"}`}
                            >
                                {crop}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}
