import { createContext, useContext, useState, useEffect } from "react";

import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

const toTransaction = (booking) => ({
  bookingId: booking.bookingId,
  bookingReference: booking.bookingReference,
  quantity: booking.quantity,
  totalAmount: booking.totalAmount,
  bookingDate: booking.bookingDate,
  status: booking.status,
  eventTitle: booking.event?.title,
  eventId: booking.event?.eventId,
  eventImageUrl: booking.event?.imageUrl,
  eventDateTime: booking.event?.dateTime,
  eventLocation: booking.event?.location,
  eventCategory: booking.event?.category?.name,
  ticketName: booking.ticketType?.name,
  userName: booking.user?.name,
  userEmail: booking.user?.email
});

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);

  const refreshBookings = async () => {
    setBookingsLoading(true);
    setBookingsError(null);

    try {
      setBookings((await axiosClient.get("/user/bookings")).data);
    } catch {
      setBookingsError("Unable to load your bookings.");
    } finally {
      setBookingsLoading(false);
    }
  };

  const refreshTransactions = async () => {
    setTransactionsLoading(true);
    setTransactionsError(null);

    try {
      setTransactions((await axiosClient.get("/admin/transactions")).data.map(toTransaction));
    } catch {
      setTransactionsError("Unable to load transaction history.");
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    if (user?.role === "USER") {
      setBookingsLoading(true);
      setBookingsError(null);

      axiosClient.get("/user/bookings")
        .then((response) => {
          if (active) setBookings(response.data);
        })
        .catch(() => {
          if (active) setBookingsError("Unable to load your bookings.");
        })
        .finally(() => {
          if (active) setBookingsLoading(false);
        });
    } else {
      setBookings([]);
      setBookingsLoading(false);
      setBookingsError(null);
    }

    if (user?.role === "ADMIN") {
      setTransactionsLoading(true);
      setTransactionsError(null);

      axiosClient.get("/admin/transactions")
        .then((response) => {
          if (active) setTransactions(response.data.map(toTransaction));
        })
        .catch(() => {
          if (active) setTransactionsError("Unable to load transaction history.");
        })
        .finally(() => {
          if (active) setTransactionsLoading(false);
        });
    } else {
      setTransactions([]);
      setTransactionsLoading(false);
      setTransactionsError(null);
    }

    return () => {
      active = false;
    };
  }, [user?.email, user?.role]);

  const updateTransactionStatus = async (bookingId, status, adminNotes = "") => {
    await axiosClient.put(`/admin/bookings/${bookingId}/status`, null, {
      params: { status, adminNotes: adminNotes || undefined }
    });

    await refreshTransactions();
  };

  const cancelBooking = async (bookingId) => {
    await axiosClient.delete(`/user/bookings/${bookingId}`);
    await refreshBookings();
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
      refreshTransactions,
      updateTransactionStatus,
      cancelBooking
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);