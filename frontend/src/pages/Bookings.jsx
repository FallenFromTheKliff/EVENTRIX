import { useState, useEffect } from "react";

import { useTransactions } from "../context/TransactionContext";

import { categories, ticketTypes } from "../data/details";
import { messageStyle, bookingButton } from "../utils/styles";
import { isUpcoming } from "../utils/dates";
import { emptyFilters, bookingFilters, bookingStatusOptions, months } from "../utils/filters";

import useDebouncing from "../utils/useDebouncing";
import usePagination from "../utils/usePagination";

import BookingCard from "../components/transactions/BookingCard";
import BookingHeader from "../components/transactions/BookingHeader";
import FilterRow from "../components/ui/FilterRow";
import Reveal from "../components/ui/Reveal";
import useLoadingText from "../components/ui/useLoadingText";
import ConfirmModal from "../components/ui/ConfirmModal";
import Pagination from "../components/ui/Pagination";

export default function Bookings() {
  const { bookings, bookingsLoading, bookingsError, refreshBookings, cancelBooking } = useTransactions();
  const { loading, runner, texter } = useLoadingText();
  const [filters, setFilters] = useState(emptyFilters);
  const [cancelling, setCancelling] = useState(null);
  const [failed, setFailed] = useState("");

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  const options = {
    category: categories,
    ticketType: ticketTypes,
    date: months,
    status: bookingStatusOptions
  };

  const debouncedFilters = useDebouncing(filters, 200);
  const filteredBookings = bookings.filter((booking) =>
    (booking.eventTitle || "").toLowerCase().includes(debouncedFilters.name.trim().toLowerCase()) &&
    (!debouncedFilters.category || booking.eventCategory === debouncedFilters.category) &&
    (!debouncedFilters.ticketType || booking.ticketName === debouncedFilters.ticketType) &&
    (!debouncedFilters.date || booking.eventDateTime?.startsWith(debouncedFilters.date)) &&
    (!debouncedFilters.status || booking.status === debouncedFilters.status)
  );

  const { page, pages, setPage, items } = usePagination(filteredBookings);
  const handleFilter = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
    setPage(1);
  };

  const handleCancel = () => runner(async () => {
    try {
      await cancelBooking(cancelling);
    } catch (error) {
      setFailed(typeof error.response?.data === "string" ? error.response.data : "Failed to cancel booking!");
    } finally {
      setCancelling(null);
    }
  });

  return (
    <div className="flex flex-1 flex-col">
      <title>Bookings | EVENTRIX</title>
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
          {bookingsLoading && !bookings.length ? (
            <p className={messageStyle}>Loading bookings...</p>
          ) : bookingsError ? (
            <p className={messageStyle}>{bookingsError}</p>
          ) : filteredBookings.length ? (
            items.map((booking) => (
              <Reveal key={booking.bookingId} className="w-full">
                <BookingCard booking={booking}>
                  {booking.status === "PAID" && isUpcoming(booking.eventDateTime) && (
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
          <Pagination page={page} pages={pages} onChange={setPage} className="pt-8" />
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