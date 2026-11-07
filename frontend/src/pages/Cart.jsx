import { useState } from "react";
import { Link } from "react-router";

import { useCart } from "../context/CartContext";

import { categories, ticketTypes } from "../data/details";
import { toSlug } from "../utils/events";
import { messageStyle, bookingButton } from "../utils/styles";
import { cartFilters, emptyCartFilters, months } from "../utils/filters";

import useDebouncing from "../utils/useDebouncing";
import usePagination from "../utils/usePagination";

import BookingCard from "../components/transactions/BookingCard";
import BookingHeader from "../components/transactions/BookingHeader";
import FilterRow from "../components/ui/FilterRow";
import Reveal from "../components/ui/Reveal";
import Pagination from "../components/ui/Pagination";

export default function Cart() {
  const { cartBookings, cartLoading, cartError, removeFromCart } = useCart();
  const [filters, setFilters] = useState(emptyCartFilters);
  const [removingItemId, setRemovingItemId] = useState(null);

  const options = {
    category: categories,
    ticketType: ticketTypes,
    date: months
  };

  const debouncedFilters = useDebouncing(filters, 200);
  const filteredBookings = cartBookings.filter((booking) =>
    booking.eventTitle.toLowerCase().includes(debouncedFilters.name.trim().toLowerCase()) &&
    (!debouncedFilters.category || booking.eventCategory === debouncedFilters.category) &&
    (!debouncedFilters.ticketType || booking.ticketName === debouncedFilters.ticketType) &&
    (!debouncedFilters.date || booking.eventDateTime?.startsWith(debouncedFilters.date))
  );

  const { page, pages, setPage, items } = usePagination(filteredBookings);
  const handleFilter = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
    setPage(1);
  };

  const handleRemove = async (itemId) => {
    setRemovingItemId(itemId);

    try {
      await removeFromCart(itemId);
    } finally {
      setRemovingItemId(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <title>Cart | EVENTRIX</title>
      <section className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-end gap-x-4">
          <h2 className="relative -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            <Reveal variant="type">My Cart</Reveal>
          </h2>
          <Reveal variant="slide" className="ml-auto">
            <FilterRow fields={cartFilters.filter(({ type }) => type === "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
          <div className="bg-zinc-900 order-1 2xl:order-2 h-1 w-full" />
          <Reveal variant="slide" className="order-2 2xl:order-1 mt-3 2xl:mt-0">
            <FilterRow fields={cartFilters.filter(({ type }) => type !== "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
        </div>
        <div className="mt-4 flex flex-1 flex-col space-y-4">
          <Reveal variant="reappear" className="w-full">
            <BookingHeader />
          </Reveal>
          {cartLoading && !cartBookings.length ? (
            <p className={messageStyle}>Loading cart...</p>
          ) : cartError ? (
            <p className={messageStyle}>{cartError}</p>
          ) : filteredBookings.length > 0 ? (
            items.map((booking) => (
              <Reveal key={booking.cartItemId} className="w-full">
                <BookingCard booking={booking}>
                  <Link
                    to={`/events/${toSlug(booking.eventTitle)}`}
                    state={{ payment: true, cartItemIds: [booking.cartItemId], from: "/cart", eventId: booking.eventId }}
                    className={`${bookingButton} bg-green-500 hover:brightness-50`}
                  >
                    PROCEED TO PAYMENT
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(booking.cartItemId)}
                    disabled={removingItemId === booking.cartItemId}
                    className={`${bookingButton} bg-red-500`}
                  >
                    {removingItemId === booking.cartItemId ? "REMOVING..." : "REMOVE FROM CART"}
                  </button>
                </BookingCard>
              </Reveal>
            ))
          ) : (
            <p className="my-auto py-8 text-center text-gray-400">
              {cartBookings.length ? "No cart items match these filters." : "Your cart is empty."}
            </p>
          )}
          <Pagination page={page} pages={pages} onChange={setPage} className="pt-8" />
        </div>
      </section>
    </div>
  );
}