import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <EventProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </EventProvider>
    </AuthProvider>
  </StrictMode>,
)