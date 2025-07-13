import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

export default function Login({ onLoginClose, onSwitchToRegister }) {
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
            const userRes = await axios.get(`${backendURL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser({ ...userRes.data, token });
            toast.success("Login successful!");
            if (onLoginClose) onLoginClose();
            navigate("/");
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed.";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="backdrop-blur-lg bg-white/70 shadow-2xl border border-white/40 rounded-2xl p-8 w-full max-w-md space-y-6 transition-transform transform hover:scale-[1.02]"
            >
                <div className="flex justify-center">
                    <img src={logo} alt="FarmBridge Logo" className="w-20 h-20 object-contain rounded-full shadow-md" />
                </div>
                <h2 className="text-2xl font-bold text-center text-green-800">Welcome to FarmBridge</h2>
                {error && <p className="text-red-600 text-center text-sm">{error}</p>}
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 placeholder-gray-500"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 placeholder-gray-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-lg px-4 py-2 w-full font-semibold transition shadow-md hover:shadow-lg"
                >
                    Login
                </button>
                <p className="text-center text-sm text-gray-700">
                    Don&apos;t have an account?{" "}
                    <span
                        onClick={onSwitchToRegister}
                        className="text-green-700 font-semibold underline cursor-pointer hover:text-green-900"
                    >
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
}
