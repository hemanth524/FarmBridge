import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

export default function Login() {
    const { backendURL, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post(`${backendURL}/auth/login`, formData);
            const { token } = response.data;
            localStorage.setItem("token", token);
            try {
                const userRes = await axios.get(`${backendURL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser({ ...userRes.data, token });
                toast.success("Login successful!");
                navigate("/");
            } catch (fetchErr) {
                console.error(fetchErr);
                toast.error("Failed to fetch user data.");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed.";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
                <div className="flex justify-center">
                    <img src={logo} alt="FarmBridge Logo" className="w-24 h-24 object-contain" />
                </div>
                <h2 className="text-2xl font-semibold text-center text-green-700">Login to FarmBridge</h2>
                {error && <p className="text-red-600 text-center text-sm">{error}</p>}
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Email</label>
                    <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Password</label>
                    <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 w-full font-medium transition">
                    Login
                </button>
            </form>
        </div>
    );
}
