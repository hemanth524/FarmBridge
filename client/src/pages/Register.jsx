import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register({ onRegisterClose, onSwitchToLogin }) {
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
            toast.success("Registration successful!");
            if (onRegisterClose) onRegisterClose();
            navigate("/");
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed.";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="backdrop-blur-lg bg-white/70 shadow-2xl border border-white/40 rounded-2xl p-8 w-full max-w-md space-y-4 transition-transform transform hover:scale-[1.02]"
            >
                <h2 className="text-2xl font-bold text-center text-orange-800">Create Your Account</h2>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full bg-white/80 placeholder-gray-500" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full bg-white/80 placeholder-gray-500" required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full bg-white/80 placeholder-gray-500" required />
                <select name="role" value={formData.role} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full bg-white/80">
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                    <option value="admin">Admin</option>
                </select>
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full bg-white/80 placeholder-gray-500" />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full bg-white/80 placeholder-gray-500" />
                <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-lg px-4 py-2 w-full font-semibold transition shadow-md hover:shadow-lg"
                >
                    Register
                </button>
                <p className="text-center text-sm text-gray-700">
                    Already have an account?{" "}
                    <span
                        onClick={onSwitchToLogin}
                        className="text-orange-700 font-semibold underline cursor-pointer hover:text-orange-900"
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}
