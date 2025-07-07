import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from "./context/SocketContext";
import { BiddingNotificationProvider } from './context/BiddingNotificationContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
    <SocketProvider>
      <BiddingNotificationProvider>
        <App />
        </BiddingNotificationProvider>
      </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
