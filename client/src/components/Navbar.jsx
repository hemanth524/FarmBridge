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
        <nav className="bg-gray-700 text-white relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">FarmBridge 🚜</Link>

                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    {user?.role === "farmer" && (
                        <>
                            <Link to="/add-produce" className="hover:underline">Add Produce</Link>
                            <Link to="/my-produce" className="hover:underline">My Produce</Link>
                        </>
                    )}
                                        {user?.role === "buyer" && (
  <Link to="/buyer-payments" className="hover:underline">Payments</Link>
)}
{user?.role === "farmer" && (
  <Link to="/farmer-payments" className="hover:underline">Payments</Link>
)}

                    {user?.role === "buyer" && (
                        <Link to="/browse-produce" className="hover:underline">Browse Produce</Link>
                    )}

                    {user && (
                        <>
                            <Link to="/chat" className="hover:underline">Chat</Link>
                            <Link to="/bidding-sessions" className="hover:underline">My Bids</Link>
                            <Link to="/profile" className="hover:underline flex items-center space-x-2">
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
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="flex flex-col space-y-4 px-4 py-4 bg-gray-700 md:hidden">
                    {user?.role === "farmer" && (
                        <>
                            <Link to="/add-produce" className="hover:underline" onClick={() => setMenuOpen(false)}>Add Produce</Link>
                            <Link to="/my-produce" className="hover:underline" onClick={() => setMenuOpen(false)}>My Produce</Link>
                        </>
                    )}

                    {user?.role === "buyer" && (
                        <Link to="/browse-produce" className="hover:underline" onClick={() => setMenuOpen(false)}>Browse Produce</Link>
                    )}

                    {user && (
                        <>
                            <Link to="/chat" className="hover:underline" onClick={() => setMenuOpen(false)}>Chat</Link>
                            <Link to="/bidding-sessions" className="hover:underline" onClick={() => setMenuOpen(false)}>My Bids</Link>
                            <Link to="/profile" className="hover:underline flex items-center space-x-2" onClick={() => setMenuOpen(false)}>
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
