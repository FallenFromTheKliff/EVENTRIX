import { createContext, useContext, useState, useEffect } from "react";

import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(user?.role === "USER");
  const [bookingsError, setBookingsError] = useState(null);
  const [transactionsLoading, setTransactionsLoading] = useState(user?.role === "ADMIN");
  const [transactionsError, setTransactionsError] = useState(null);

  const refreshBookings = async () => {
    setBookingsLoading(true);
    setBookingsError(null);

    try {
      setBookings((await axiosClient.get("/user/bookings")).data);
    } catch {
      setBookingsError("Sorry, we couldn't retrieve your bookings! Try refreshing the page.");
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    if (user?.role === "USER") {
      axiosClient.get("/user/bookings")
        .then((response) => {
          if (active) setBookings(response.data);
        })
        .catch(() => {
          if (active) setBookingsError("Sorry, we couldn't retrieve your bookings! Try refreshing the page.");
        })
        .finally(() => {
          if (active) setBookingsLoading(false);
        });
    }

    if (user?.role === "ADMIN") {
      axiosClient.get("/admin/transactions")
        .then((response) => {
          if (active) setTransactions(response.data);
        })
        .catch(() => {
          if (active) setTransactionsError("Oops, we couldn't load the transactions... Try refreshing the page!");
        })
        .finally(() => {
          if (active) setTransactionsLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [user?.email, user?.role]);

  const updateTransactionStatus = async (bookingId, status, adminNotes = "") => {
    const response = await axiosClient.put(`/admin/bookings/${bookingId}/status`, null, {
      params: { status, adminNotes: adminNotes || undefined }
    });

    setTransactions((current) => current.map((item) => item.bookingId === bookingId ? response.data : item));
  };

  const cancelBooking = async (bookingId) => {
    await axiosClient.delete(`/user/bookings/${bookingId}`);
    setBookings((current) => current.map((booking) => booking.bookingId === bookingId ? { ...booking, status: "PROCESSING" } : booking));
  };

  return (
    <TransactionContext.Provider value={{
      bookings,
      bookingsLoading,
      bookingsError,
      refreshBookings,
      transactions,
      transactionsLoading,
      transactionsError,
      updateTransactionStatus,
      cancelBooking
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);