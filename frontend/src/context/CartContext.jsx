import { createContext, useCallback, useContext, useEffect, useState } from "react";

import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const getCart = async () => (await axiosClient.get("/user/cart")).data;
const getBookings = async () => (await axiosClient.get("/user/bookings")).data;

const toBooking = ({ id, bookingReference, quantity, ticketType, eventId, eventTitle, eventImageUrl, eventDateTime, eventLocation }) => ({
  cartItemId: id,
  bookingReference,
  eventId,
  eventTitle,
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
  const [cartItems, setCartItems] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let active = true;

    if (user?.role !== "USER") {
      setCartItems([]);
      setBookings([]);

      return () => {
        active = false;
      };
    }

    getCart()
      .then((items) => {
        if (active) setCartItems(items);
      })
      .catch(() => {
        if (active) setCartItems([]);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const refreshBookings = useCallback(async () => {
    const userBookings = await getBookings();
    setBookings(userBookings);
  }, []);

  const addCartItem = async (ticketTypeId, quantity, separateItem) => {
    await axiosClient.post("/user/cart", { ticketTypeId, quantity, separateItem });
    setCartItems(await getCart());
  };

  const addToCart = async (ticketTypeId, quantity) => {
    await addCartItem(ticketTypeId, quantity, false);
  };

  const quickBuy = async (ticketTypeId, quantity = 1) => {
    await addCartItem(ticketTypeId, quantity, true);
  };

  const removeFromCart = async (itemId) => {
    await axiosClient.delete(`/user/cart/items/${itemId}`);
    setCartItems(await getCart());
  };

  const checkout = async (payment) => {
    await axiosClient.post("/user/cart/checkout", payment);
    setCartItems(await getCart());
    await refreshBookings();
  };

  const cancelBooking = async (id) => {
    await axiosClient.delete(`/user/bookings/${id}`);
    await refreshBookings();
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartBookings: cartItems.map(toBooking),
      bookings,
      addToCart,
      quickBuy,
      removeFromCart,
      checkout,
      cancelBooking,
      refreshBookings
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);