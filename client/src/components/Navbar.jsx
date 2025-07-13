
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center px-4 py-3 bg-gray-700 text-white relative">
            <Link to="/" className="text-xl font-bold">FarmBridge 🚜</Link>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <div className={`${menuOpen ? "flex" : "hidden"} flex-col absolute top-14 left-0 w-full bg-gray-700 text-center space-y-4 py-4 md:flex md:static md:flex-row md:space-y-0 md:space-x-6 md:w-auto md:py-0`}>
                {user?.role === "farmer" && (
                    <Link to="/add-produce" className="hover:underline">Add Produce</Link>
                )}

                {user?.role === "farmer" && (
                    <Link to="/my-produce" className="hover:underline">My Produce</Link>
                )}

                {user && (
                    <Link to="/chat" className="hover:underline">Chat</Link>
                )}

                {user?.role === "buyer" && (
                    <Link to="/browse-produce" className="hover:underline">Browse Produce</Link>
                )}

                {user && (
                    <Link to="/bidding-sessions" className="hover:underline">My Bids</Link>
                )}

                {user && (
                    <Link to="/profile" className="hover:underline flex justify-center items-center space-x-2">
                        <img
                            src={user.avatar || user.image || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover border"
                        />
                        <span>{user.name}</span>
                    </Link>
                )}

                <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                    {user ? (
                        <button onClick={logout} className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200 transition">Logout</button>
                    ) : (
                        <>
                            <Link to="/register" className="hover:underline">Register</Link>
                            <Link to="/login" className="hover:underline">Login</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

