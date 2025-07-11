// src/context/BiddingNotificationContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const BiddingNotificationContext = createContext();

export const BiddingNotificationProvider = ({ children }) => {
    const { socket } = useContext(SocketContext);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;

        const handleBiddingScheduled = (data) => {
            setNotifications((prev) => [data, ...prev]);

            toast(
                (t) => (
                    <div>
                        <p>{data.message}</p>
                        <button
                            onClick={() => {
                                navigate(`/bidding/${data.bidSessionId}`);
                                toast.dismiss(t.id);
                            }}
                            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                        >
                            Join Bidding
                        </button>
                    </div>
                ),
                { duration: 8000 }
            );
        };

        socket.on("bidding_scheduled", handleBiddingScheduled);

        return () => {
            socket.off("bidding_scheduled", handleBiddingScheduled);
        };
    }, [socket]);

    return (
        <BiddingNotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </BiddingNotificationContext.Provider>
    );
};
