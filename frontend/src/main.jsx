import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import { CartProvider } from "./context/CartContext";
import { TransactionProvider } from "./context/TransactionContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <EventProvider>
        <TransactionProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </TransactionProvider>
      </EventProvider>
    </AuthProvider>
  </StrictMode>
)