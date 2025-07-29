import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProduceForm({ selectedCrop, selectedBuyers }) {
    const { backendURL, user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        description: "",
        quantity: "",
        price: "",
        startDate: "",
        endDate: "",
        images: []
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, images: files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            toast.loading("Uploading produce...", { id: "upload" });

            const imageBase64Array = await Promise.all(
                formData.images.map(file =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                    })
                )
            );

            const payload = {
                name: selectedCrop,
                buyers: selectedBuyers,
                description: formData.description,
                quantity: formData.quantity,
                price: formData.price,
                availabilityWindow: {
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                },
                images: imageBase64Array,
            };

            await axios.post(`${backendURL}/produce`, payload, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            toast.success("Produce added successfully!", { id: "upload" });

            setFormData({
                description: "",
                quantity: "",
                price: "",
                startDate: "",
                endDate: "",
                images: []
            });

            document.getElementById("produce-images").value = "";

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add produce.", { id: "upload" });
        }
    };

    if (!selectedCrop || selectedBuyers.length === 0) return null;

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 max-w-2xl mx-auto mt-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Add Produce Details for <span className="text-green-700">{selectedCrop}</span>
            </h2>

            <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter details about the produce"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="e.g. 100 kg"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="e.g. 50 per kg"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Upload Images</label>
                <input
                    type="file"
                    id="produce-images"
                    multiple
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition duration-300"
            >
                Submit Produce
            </button>
        </form>
    );
}
