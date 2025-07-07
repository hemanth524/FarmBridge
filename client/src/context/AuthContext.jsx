import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Backend URL managed here
    const backendURL = "http://localhost:5247/api";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded);
                setUser({ _id: decoded.id,...decoded, token });
            } catch (error) {
                console.error("Invalid token, clearing.");
                localStorage.removeItem("token");
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, backendURL, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
