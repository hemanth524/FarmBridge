// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user) {
            const newSocket = io("http://localhost:5247", { transports: ["websocket"] });
            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log("Connected to socket:", newSocket.id);
                if (user?._id) {
                    newSocket.emit("join", user._id);
                }
            });

            return () => newSocket.disconnect();
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
