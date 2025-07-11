import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
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
            const fetchUser = async () => {
                try {
                    const res = await axios.get(`${backendURL}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser({
                        ...res.data,
                        token,
                    });
                } catch (error) {
                    console.error("Error fetching user:", error);
                    localStorage.removeItem("token");
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } catch (error) {
            console.error("Invalid token, clearing.");
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
        }
    } else {
        setLoading(false);
    }
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
