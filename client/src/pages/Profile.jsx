import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser, backendURL, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", avatar: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first.");
    setUpdating(true);
    const config = {
      headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${user.token}` },
    };
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (formData.avatar instanceof File) data.append("avatar", formData.avatar);
    try {
      const res = await axios.put(`${backendURL}/auth/update`, data, config);
      const updatedUser = res.data.user;
      toast.success("Profile updated successfully.");
      setUser((prev) => ({ ...prev, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, avatar: updatedUser.avatar }));
      setAvatarFileName("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-lg  mx-auto p-4 bg-white shadow-xl rounded-xl mt-8 mb-8 hover:shadow-black/90 shadow-2xl">
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
        <button type="submit" disabled={updating} className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 w-full font-medium transition">
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;