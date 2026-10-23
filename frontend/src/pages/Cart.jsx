import { useState } from "react";
import { Link } from "react-router";

import { useCart } from "../context/CartContext";
import { useEvents } from "../context/EventContext";
import { toSlug } from "../utils/events";
import { cartFilters, emptyCartFilters, months } from "../utils/filters";

import BookingCard from "../components/transactions/BookingCard";
import FilterRow from "../components/ui/FilterRow";
import Reveal from "../components/ui/Reveal";

const bookingButton = "flex w-full items-center justify-center rounded-md py-2 text-center text-sm font-bold transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";

export default function Cart() {
  const { cartBookings = [], cartLoading, cartError, refreshCart, removeFromCart } = useCart();
  const { categories } = useEvents();
  const [filters, setFilters] = useState(emptyCartFilters);
  const [removingItemId, setRemovingItemId] = useState(null);

  const handleFilter = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });
  const options = {
    category: categories.map(({ name }) => ({ value: name, label: name })),
    ticketType: [...new Set(cartBookings.map((booking) => booking.ticketName).filter(Boolean))].map((name) => ({ value: name, label: name })),
    date: months
  };

  const filteredBookings = cartBookings.filter((booking) =>
    booking.status === "PENDING" &&
    booking.eventTitle.toLowerCase().includes(filters.name.trim().toLowerCase()) &&
    (!filters.category || booking.eventCategory === filters.category) &&
    (!filters.ticketType || booking.ticketName === filters.ticketType) &&
    (!filters.date || booking.eventDateTime?.startsWith(filters.date))
  );

  const handleRemove = async (itemId) => {
    setRemovingItemId(itemId);

    try {
      await removeFromCart(itemId);
    } catch {
    } finally {
      setRemovingItemId(null);
    }
  };

  return (
    <div>
      <title>Cart - EVENTRIX</title>
      <section>
        <div className="flex flex-wrap items-end gap-x-4">
          <h2 className="relative -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            <Reveal variant="type">My Cart</Reveal>
          </h2>
          <Reveal variant="slide" className="ml-auto">
            <FilterRow fields={cartFilters.filter(({ type }) => type === "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
          <div className="order-1 h-1 w-full bg-zinc-900" />
          <Reveal variant="slide" className="order-2 mt-3">
            <FilterRow fields={cartFilters.filter(({ type }) => type !== "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
        </div>
        <div className="mt-4 space-y-4">
          <Reveal variant="reappear" className="w-full">
            <div className="hidden w-full grid-cols-[minmax(0,2fr)_minmax(5rem,1fr)_minmax(7rem,1fr)_minmax(8rem,1.5fr)_7rem] items-center gap-4 px-6 py-3 text-sm text-gray-300 md:grid">
              <p className="text-lg font-semibold">Event</p>
              <p className="text-center text-lg font-semibold">Tickets</p>
              <p className="text-center text-lg font-semibold">Status</p>
              <p className="text-center text-lg font-semibold">Reference ID</p>
              <div />
            </div>
          </Reveal>
          {cartError && (
            <div>
              <p role="alert" className="py-4 text-center text-red-400">{cartError}</p>
              <button type="button" onClick={refreshCart} className="mx-auto block rounded-md bg-cyan-500 px-4 py-2 font-bold">
                RETRY
              </button>
            </div>
          )}
          {cartLoading ? (
            <p className="py-8 text-center text-gray-400">Loading cart...</p>
          ) : cartError ? null : filteredBookings.length > 0 ? (
            <>
              {filteredBookings.map((booking) => (
                <Reveal key={booking.cartItemId} className="w-full">
                  <BookingCard booking={booking}>
                    <Link
                      to={`/events/${toSlug(booking.eventTitle)}`}
                      state={{ payment: true, cartItemIds: [booking.cartItemId] }}
                      className={`${bookingButton} bg-green-500 hover:brightness-50`}
                    >
                      PROCEED TO PAYMENT
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(booking.cartItemId)}
                      disabled={removingItemId === booking.cartItemId}
                      className={`${bookingButton} bg-red-500 hover:brightness-50`}
                    >
                      {removingItemId === booking.cartItemId ? "REMOVING..." : "REMOVE FROM CART"}
                    </button>
                  </BookingCard>
                </Reveal>
              ))}
            </>
          ) : (
            <p className="py-8 text-center text-gray-400">
              {cartBookings.length ? "No cart items match these filters." : "Your cart is empty."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}