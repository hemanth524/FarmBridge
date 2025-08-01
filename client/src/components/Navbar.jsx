import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
        setMenuOpen(false);
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-green-400">FarmBridge 🚜</Link>

                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {user?.role === "farmer" && (
                        <>
                            <Link to="/add-produce" className="hover:text-green-400">Add Produce</Link>
                            <Link to="/my-produce" className="hover:text-green-400">My Produce</Link>
                            <Link to="/farmer-payments" className="hover:text-green-400">Payments</Link>
                        </>
                    )}

                    {user?.role === "buyer" && (
                        <>
                            <Link to="/browse-produce" className="hover:text-green-400">Browse Produce</Link>
                            <Link to="/buyer-payments" className="hover:text-green-400">Payments</Link>
                        </>
                    )}

                    {user && (
                        <>
                            <Link to="/chat" className="hover:text-green-400">Chat</Link>
                            <Link to="/bidding-sessions" className="hover:text-green-400">My Bids</Link>
                            <Link to="/profile" className="hover:text-green-400 flex items-center space-x-2">
                                <img
                                    src={user.avatar || user.image || "https://via.placeholder.com/150"}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover border"
                                />
                                <span>{user.name}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="ml-4 bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200 transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="flex flex-col space-y-4 px-4 py-4 bg-gray-700 md:hidden text-sm font-medium">
                    {user?.role === "farmer" && (
                        <>
                            <Link to="/add-produce" onClick={() => setMenuOpen(false)} className="hover:text-green-400">Add Produce</Link>
                            <Link to="/my-produce" onClick={() => setMenuOpen(false)} className="hover:text-green-400">My Produce</Link>
                            <Link to="/farmer-payments" onClick={() => setMenuOpen(false)} className="hover:text-green-400">Payments</Link>
                        </>
                    )}

                    {user?.role === "buyer" && (
                        <>
                            <Link to="/browse-produce" onClick={() => setMenuOpen(false)} className="hover:text-green-400">Browse Produce</Link>
                            <Link to="/buyer-payments" onClick={() => setMenuOpen(false)} className="hover:text-green-400">Payments</Link>
                        </>
                    )}

                    {user && (
                        <>
                            <Link to="/chat" onClick={() => setMenuOpen(false)} className="hover:text-green-400">Chat</Link>
                            <Link to="/bidding-sessions" onClick={() => setMenuOpen(false)} className="hover:text-green-400">My Bids</Link>
                            <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-green-400 flex items-center space-x-2">
                                <img
                                    src={user.avatar || user.image || "https://via.placeholder.com/150"}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover border"
                                />
                                <span>{user.name}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200 transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
