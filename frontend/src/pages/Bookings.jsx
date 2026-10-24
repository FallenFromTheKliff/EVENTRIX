import { useState } from "react";

import { useTransactions } from "../context/TransactionContext";
import { useEvents } from "../context/EventContext";

import { bookingButton } from "../utils/events";
import { emptyFilters, bookingFilters, bookingStatusOptions, months } from "../utils/filters";

import BookingCard from "../components/transactions/BookingCard";
import BookingHeader from "../components/transactions/BookingHeader";
import FilterRow from "../components/ui/FilterRow";
import Reveal from "../components/ui/Reveal";
import useLoadingText from "../components/ui/useLoadingText";
import ConfirmModal from "../components/ui/ConfirmModal";
import Retry from "../components/ui/Retry";

export default function Bookings() {
  const { bookings, bookingsLoading, bookingsError, refreshBookings, cancelBooking } = useTransactions();
  const { categories } = useEvents();
  const { loading, runner, texter } = useLoadingText();
  const [filters, setFilters] = useState(emptyFilters);
  const [cancelling, setCancelling] = useState(null);
  const [failed, setFailed] = useState("");

  const handleFilter = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });

  const options = {
    category: categories.map(({ name }) => ({ value: name, label: name })),
    ticketType: [...new Set(bookings.map((booking) => booking.ticketName).filter(Boolean))].map((name) => ({ value: name, label: name })),
    date: months,
    status: bookingStatusOptions
  };

  const filteredBookings = bookings.filter((booking) =>
    (booking.eventTitle || "").toLowerCase().includes(filters.name.trim().toLowerCase()) &&
    (!filters.category || booking.eventCategory === filters.category) &&
    (!filters.ticketType || booking.ticketName === filters.ticketType) &&
    (!filters.date || booking.eventDateTime?.startsWith(filters.date)) &&
    (!filters.status || booking.status === filters.status)
  );

  const handleCancel = () => runner(async () => {
    try {
      await cancelBooking(cancelling);
    } catch {
      setFailed("Failed to cancel booking!");
    } finally {
      setCancelling(null);
    }
  });

  return (
    <div className="flex flex-1 flex-col">
      <title>Bookings - EVENTRIX</title>
      <section className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-end gap-x-4">
          <h2 className="relative -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            <Reveal variant="type">My Bookings</Reveal>
          </h2>
          <Reveal variant="slide" className="ml-auto">
            <FilterRow fields={bookingFilters.filter(({ type }) => type === "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
          <div className="bg-zinc-900 order-1 2xl:order-2 h-1 w-full" />
          <Reveal variant="slide" className="order-2 2xl:order-1 mt-3 2xl:mt-0">
            <FilterRow fields={bookingFilters.filter(({ type }) => type !== "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
        </div>
        <div className="mt-4 flex flex-1 flex-col space-y-4">
          <Reveal variant="reappear" className="w-full">
            <BookingHeader />
          </Reveal>
          {bookingsError && <Retry message={bookingsError} onRetry={refreshBookings} />}
          {bookingsLoading && !bookings.length ? (
            <p className="my-auto py-8 text-center text-gray-400">Loading bookings...</p>
          ) : bookingsError ? null : filteredBookings.length ? (
            filteredBookings.map((booking) => (
              <Reveal key={booking.bookingId} className="w-full">
                <BookingCard booking={booking}>
                  {booking.status === "PENDING" && (
                    <button type="button" onClick={() => setCancelling(booking.bookingId)} className={`${bookingButton} bg-red-500`}>
                      CANCEL BOOKING
                    </button>
                  )}
                </BookingCard>
              </Reveal>
            ))
          ) : (
            <p className="my-auto py-8 text-center text-gray-400">
              {bookings.length ? "No bookings match your filters..." : "You haven't booked any events yet..."}
            </p>
          )}
        </div>
      </section>
      {cancelling !== null && (
        <ConfirmModal
          message="Cancel booking?"
          description="A cancellation request will be sent to the admin for confirmation."
          confirmText={texter("CANCEL BOOKING", "CANCELLING")}
          loading={loading}
          onConfirm={handleCancel}
          onClose={() => setCancelling(null)}
        />
      )}
      {failed && <ConfirmModal type="error" message={failed} onClose={() => setFailed("")} />}
    </div>
  );
}