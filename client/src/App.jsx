import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";


function App() {
    return (
            <div>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <div className="text-red-300 text-5xl text-center mt-10">
                        Hello FarmBridge 🚜
                    </div>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
            </Routes>
            </div>
       
    );
}

export default App;
