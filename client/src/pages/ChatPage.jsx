import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function ChatPage() {
    const { socket } = useContext(SocketContext);
    const { user, backendURL } = useContext(AuthContext);

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Fetch contacts
    useEffect(() => {
        const fetchContacts = async () => {
            if (!user?.token) return;
            try {
                const res = await axios.get(`${backendURL}/auth/users`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setContacts(res.data);
                console.log("✅ Contacts loaded:", res.data);
            } catch (error) {
                console.error("❌ Error loading contacts:", error);
            }
        };

        fetchContacts();
    }, [user]);

    // Handle receiving real-time messages
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg) => {
            console.log("📨 New real-time message received:", msg);
            if (msg.senderId === selectedContact?._id) {
                setMessages((prev) => [
                    ...prev,
                    { fromSelf: false, content: msg.content },
                ]);
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => socket.off("new_message", handleNewMessage);
    }, [socket, selectedContact]);

    // Load message history
    const loadMessages = async () => {
        if (!selectedContact || !user?.token) return;
        try {
            const res = await axios.get(`${backendURL}/messages/conversation/${selectedContact._id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
});

            setMessages(
                res.data.map((msg) => ({
                    fromSelf: msg.sender === user._id,
                    content: msg.content,
                }))
            );
            console.log("✅ Loaded message history:", res.data);
        } catch (error) {
            console.error("❌ Error loading messages:", error);
        }
    };

    useEffect(() => {
        if (selectedContact && user) {
            loadMessages();
        }
    }, [selectedContact, user]);

    // Send message
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedContact || !user?.token) return;

        try {
            // Emit via socket for real-time
            socket.emit("send_message", {
                senderId: user._id,
                receiverId: selectedContact._id,
                content: newMessage,
            });
            console.log(`📤 Sent message to ${selectedContact._id}: ${newMessage}`);

            // Persist in DB
            await axios.post(
                `${backendURL}/messages/send`,
                { receiverId: selectedContact._id, content: newMessage },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            setMessages((prev) => [...prev, { fromSelf: true, content: newMessage }]);
            setNewMessage("");
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Loading user information...
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            {/* Contacts Sidebar */}
            <div className="w-1/4 bg-green-100 p-4 overflow-y-auto">
                <h2 className="text-lg font-bold mb-2">Contacts</h2>
                {contacts.length === 0 && (
                    <p className="text-gray-500">No contacts available.</p>
                )}
                {contacts.map((contact) => (
                    <button
                        key={contact._id}
                        onClick={() => setSelectedContact(contact)}
                        className={`block w-full text-left p-2 rounded ${
                            selectedContact?._id === contact._id
                                ? "bg-green-500 text-white"
                                : "hover:bg-green-200"
                        }`}
                    >
                        {contact.name} ({contact.role})
                    </button>
                ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col p-4">
                {selectedContact ? (
                    <>
                        <h2 className="text-xl font-bold mb-2">
                            Chat with {selectedContact.name}
                        </h2>
                        <div className="flex-1 bg-gray-100 rounded p-2 overflow-y-auto">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`my-1 p-2 rounded w-fit max-w-xs break-words ${
                                        msg.fromSelf
                                            ? "bg-green-400 text-white ml-auto"
                                            : "bg-white text-black"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                        </div>
                        <div className="flex mt-2">
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 border rounded p-2"
                                placeholder="Type a message..."
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-green-500 text-white px-4 rounded ml-2"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center m-auto text-gray-500">
                        Select a contact to start chatting.
                    </p>
                )}
            </div>
        </div>
    );
}
