import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser, backendURL, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first.");
      return;
    }

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
      const res = await axios.put(`${backendURL}/auth/update`, data, config);
      const updatedUser = res.data.user;
      toast.success("Profile updated successfully.");

      // Update user in AuthContext while preserving token
      setUser((prev) => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
      }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        )}
        <div>
          <label className="block mb-1">Change Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={updating}
          className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 w-full"
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
