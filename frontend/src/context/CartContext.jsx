import { createContext, useContext, useEffect, useState } from "react";

import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user?.role !== "USER") return;
    axiosClient.get("/user/cart").then((response) => setCartItems(response.data));
    return () => setCartItems([]);
  }, [user]);

  const addToCart = async (ticketTypeId, quantity) => {
    await axiosClient.post("/user/cart", { ticketTypeId, quantity });
    const response = await axiosClient.get("/user/cart");
    setCartItems(response.data);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext);