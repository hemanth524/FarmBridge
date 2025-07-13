import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddProduce from "./pages/AddProduce";
import MyProduce from "./pages/MyProduce";
import { Toaster } from 'react-hot-toast';
import BuyerBrowseProduce from "./pages/BuyerBrowseProduce";
import ChatPage from "./pages/ChatPage";
import BiddingRoom from "./pages/BiddingRoom";
import BiddingSessions from "./pages/BiddingSessions";
import Profile from "./pages/Profile";
import HomePage from "./pages/Homepage";
function App() {
    return (
            <div>
            <Navbar />
            <Routes>
                
                <Route path="/" element={<HomePage/>}/>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-produce" element={<AddProduce />} />
                <Route path="/my-produce" element={<MyProduce />} />
                <Route path="/browse-produce" element={<BuyerBrowseProduce/>}/>
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/bidding/:bidSessionId" element={<BiddingRoom />} />
                <Route path="/bidding-sessions" element={<BiddingSessions />} />
                <Route path="/profile" element={<Profile/>}/>
            </Routes>
            
            <Toaster position="top-right"  />
            </div>
       
    );
}

export default App;
