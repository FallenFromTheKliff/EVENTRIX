import { useState } from "react";

import { useTransactions } from "../context/TransactionContext";
import { useEvents } from "../context/EventContext";
import { emptyFilters, bookingFilters, bookingStatusOptions, months } from "../utils/filters";

import BookingCard from "../components/transactions/BookingCard";
import FilterRow from "../components/ui/FilterRow";
import Reveal from "../components/ui/Reveal";

export default function Bookings() {
  const { bookings = [], bookingsLoading, bookingsError, refreshBookings, cancelBooking } = useTransactions();
  const { categories } = useEvents();
  const [filters, setFilters] = useState(emptyFilters);

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

  return (
    <div>
      <title>Bookings - EVENTRIX</title>
      <section>
        <div className="flex flex-wrap items-end gap-x-4">
          <h2 className="relative -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            <Reveal variant="type">My Bookings</Reveal>
          </h2>
          <Reveal variant="slide" className="ml-auto">
            <FilterRow fields={bookingFilters.filter(({ type }) => type === "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
          <div className="order-1 h-1 w-full bg-zinc-900" />
          <Reveal variant="slide" className="order-2 mt-3">
            <FilterRow fields={bookingFilters.filter(({ type }) => type !== "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
        </div>
        <div className="mt-4 space-y-4">
          {bookingsError && (
            <div>
              <p role="alert" className="py-4 text-center text-red-400">{bookingsError}</p>
              <button type="button" onClick={refreshBookings} className="mx-auto block rounded-md bg-cyan-500 px-4 py-2 font-bold">
                RETRY
              </button>
            </div>
          )}
          {bookingsLoading ? (
            <p className="py-8 text-center text-gray-400">Loading bookings...</p>
          ) : bookingsError ? null : filteredBookings.length ? (
            filteredBookings.map((booking) => (
              <Reveal key={booking.bookingId} className="w-full">
                <BookingCard booking={booking}>
                  {booking.status === "PENDING" && (
                    <button type="button" onClick={() => cancelBooking(booking.bookingId)} className="w-full rounded-md bg-red-500 py-2 text-xs font-bold transition duration-200 hover:brightness-50">
                      CANCEL BOOKING
                    </button>
                  )}
                </BookingCard>
              </Reveal>
            ))
          ) : (
            <p className="py-8 text-center text-gray-400">No bookings found.</p>
          )}
        </div>
      </section>
    </div>
  );
}