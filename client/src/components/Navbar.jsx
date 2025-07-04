import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="flex justify-between items-center px-6 py-3 bg-green-700 text-white">
            <Link to="/" className="text-xl font-bold">
                FarmBridge 🚜
            </Link>
            <div className="flex gap-4 items-center">
                {user ? (
                    <>
                        <span className="text-sm">Hello, {user.role}</span>
                        <button
                            onClick={logout}
                            className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/register" className="hover:underline">Register</Link>
                        <Link to="/login" className="hover:underline">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
