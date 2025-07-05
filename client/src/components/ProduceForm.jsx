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

            // ✅ Clear form on success
            setFormData({
                description: "",
                quantity: "",
                price: "",
                startDate: "",
                endDate: "",
                images: []
            });

            // Optional: clear file input manually if needed
            document.getElementById("produce-images").value = "";

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add produce.", { id: "upload" });
        }
    };

    if (!selectedCrop || selectedBuyers.length === 0) return null;

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Add Produce Details for {selectedCrop}</h3>
            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            />
            <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            />
            <label className="block">Start Date:</label>
            <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <label className="block">End Date:</label>
            <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border p-2 w-full rounded"
            />
            <input
                type="file"
                id="produce-images"
                multiple
                onChange={handleImageChange}
                className="border p-2 w-full rounded"
            />
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
                Submit Produce
            </button>
        </form>
    );
}
