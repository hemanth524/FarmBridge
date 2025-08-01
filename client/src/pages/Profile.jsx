import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const availableCrops = [
  "Wheat", "Rice", "Corn", "Barley", "Soybean", "Potato", "Tomato", "other"
];

const Profile = () => {
  const { user, setUser, backendURL, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", avatar: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [interestedCrops, setInterestedCrops] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || null);
      if (user.role === "buyer") {
        // fetch existing interested crops
        axios
          .get(`${backendURL}/auth/me`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .then((res) => {
            setInterestedCrops(res.data.interestedCrops || []);
          })
          .catch(() => setInterestedCrops([]));
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFileName(file.name);
    }
  };

  const handleCropToggle = (crop) => {
    setInterestedCrops((prev) =>
      prev.includes(crop)
        ? prev.filter((c) => c !== crop)
        : [...prev, crop]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first.");
    setUpdating(true);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (formData.avatar instanceof File) {
      data.append("avatar", formData.avatar);
    }

    try {
      // Update general profile
      const res = await axios.put(`${backendURL}/auth/update`, data, config);
      const updatedUser = res.data.user;
      toast.success("Profile updated");

      setUser((prev) => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
      }));

      // 🔒 Only for buyers: update interested crops
      if (user.role === "buyer") {
        await axios.put(
          `${backendURL}/buyers/interests`,
          { crops: interestedCrops },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        toast.success("Interested crops updated");
      }

      setAvatarFileName("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
  <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex justify-center items-start pt-10">
    <div className="max-w-lg w-full p-4 bg-white shadow-xl rounded-xl hover:shadow-black/90 shadow-2xl">
      <h2 className="text-3xl font-semibold text-center text-green-700 mb-6">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
        {avatarPreview && (
          <div className="flex justify-center">
            <img src={avatarPreview} alt="Avatar Preview" className="w-32 h-32 rounded-full object-cover border-4 border-green-600 shadow" />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Change Avatar</label>
          <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-block">
            {avatarFileName ? "Selected" : "Choose File"}
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500" required />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500" required />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        {user.role === "buyer" && (
  <div className="relative">
    <label className="block mb-2 font-medium text-gray-700">Interested Crops</label>

    {/* Selected Crops as Tags */}
    <div className="flex flex-wrap gap-2 mb-2">
      {interestedCrops.map((crop) => (
        <span
          key={crop}
          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
        >
          {crop}
          <button
            type="button"
            onClick={() => handleCropToggle(crop)}
            className="ml-1 text-red-500 hover:text-red-700 text-sm"
          >
            ×
          </button>
        </span>
      ))}
    </div>

    {/* Dropdown Button */}
    <div className="relative">
      <details className="bg-white border border-gray-300 rounded-lg shadow-sm">
        <summary className="cursor-pointer px-4 py-2 text-sm text-gray-700 select-none">
          {interestedCrops.length > 0 ? "Edit Crops" : "Select Crops"}
        </summary>
        <div className="max-h-48 overflow-y-auto px-4 py-2">
          {availableCrops.map((crop) => (
            <label key={crop} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={interestedCrops.includes(crop)}
                onChange={() => handleCropToggle(crop)}
                className="accent-green-600"
              />
              {crop}
            </label>
          ))}
        </div>
      </details>
    </div>
  </div>
)}


        <button type="submit" disabled={updating} className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 w-full font-medium transition">
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  </div>
);

};

export default Profile;
