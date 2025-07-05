import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddProduce from "./pages/AddProduce";
import MyProduce from "./pages/MyProduce";
import { Toaster } from 'react-hot-toast';
import BuyerBrowseProduce from "./pages/BuyerBrowseProduce";
import ChatPage from "./pages/ChatPage";
function App() {
    return (
            <div>
            <Toaster position="top-right"  />
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <div className="text-red-300 text-5xl text-center mt-10">
                        Hello FarmBridge 🚜
                    </div>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-produce" element={<AddProduce />} />
                <Route path="/my-produce" element={<MyProduce />} />
                <Route path="/browse-produce" element={<BuyerBrowseProduce/>}/>
                <Route path="/chat" element={<ChatPage />} />

            </Routes>
            </div>
       
    );
}

export default App;
