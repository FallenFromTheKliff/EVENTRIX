import { createContext, useContext, useState, useEffect } from "react";

import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";
import { useTransactions } from "./TransactionContext";

const CartContext = createContext();

const getCart = async () => (await axiosClient.get("/user/cart")).data;
const toBooking = ({ id, bookingReference, quantity, ticketType, eventId, eventTitle, eventCategory, eventImageUrl, eventDateTime, eventLocation }) => ({
  cartItemId: id,
  bookingReference,
  eventId,
  eventTitle,
  eventCategory,
  eventImageUrl,
  eventDateTime,
  eventLocation,
  quantity,
  ticketName: ticketType.name,
  totalAmount: Number(ticketType.price) * Number(quantity),
  status: "PENDING"
});

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { refreshBookings } = useTransactions();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    let active = true;

    if (user?.role !== "USER") {
      setCartItems([]);
      setCartLoading(false);
      setCartError(null);

      return () => {
        active = false;
      };
    }

    setCartLoading(true);
    setCartError(null);

    getCart()
      .then((items) => {
        if (active) setCartItems(items);
      })
      .catch(() => {
        if (active) setCartError("Unable to load your cart.");
      })
      .finally(() => {
        if (active) setCartLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.email, user?.role]);

  const refreshCart = async () => {
    setCartLoading(true);
    setCartError(null);

    try {
      setCartItems(await getCart());
    } catch {
      setCartError("Unable to load your cart.");
    } finally {
      setCartLoading(false);
    }
  };

  const addCartItem = async (ticketTypeId, quantity, separateItem) => {
    await axiosClient.post("/user/cart", { ticketTypeId, quantity, separateItem });
    await refreshCart();
  };

  const addToCart = async (ticketTypeId, quantity) => {
    await addCartItem(ticketTypeId, quantity, false);
  };

  const quickBuy = async (ticketTypeId, quantity = 1) => {
    await addCartItem(ticketTypeId, quantity, true);
  };

  const updateCartItem = async (itemId, quantity) => {
    const response = await axiosClient.put(`/user/cart/items/${itemId}`, { quantity });
    setCartItems((current) => current.map((item) => item.id === itemId ? response.data : item));
  };

  const removeFromCart = async (itemId) => {
    await axiosClient.delete(`/user/cart/items/${itemId}`);
    await refreshCart();
  };

  const checkout = async (payment) => {
    await axiosClient.post("/user/cart/checkout", payment);
    await Promise.allSettled([refreshCart(), refreshBookings()]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartBookings: cartItems.map(toBooking),
      cartLoading,
      cartError,
      addToCart,
      quickBuy,
      updateCartItem,
      removeFromCart,
      checkout,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);