import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const { backendURL, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "farmer",
        location: "",
        phone: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post(`${backendURL}/auth/register`, formData);
            const { token } = response.data;
            localStorage.setItem("token", token);
            const decoded = JSON.parse(atob(token.split(".")[1]));
            setUser({ ...decoded, token });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-center">Register</h2>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border p-2 w-full rounded" required />
                <select name="role" value={formData.role} onChange={handleChange} className="border p-2 w-full rounded">
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                    <option value="admin">Admin</option>
                </select>
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border p-2 w-full rounded" />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                    Register
                </button>
            </form>
        </div>
    );
}
