import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
            const decoded = JSON.parse(atob(token.split(".")[1]));
            setUser({ ...decoded, token });
            toast.success("Login successful!");
            navigate("/");
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed.";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border p-2 w-full rounded" required />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                    Login
                </button>
            </form>
        </div>
    );
}
