import { useState } from "react";
import { Link } from "react-router";

import { useCart } from "../context/CartContext";
import { categories } from "../data/details";
import { toSlug, messageStyle, bookingButton, ticketTypes } from "../utils/events";
import { cartFilters, emptyCartFilters, months } from "../utils/filters";

import BookingCard from "../components/transactions/BookingCard";
import BookingHeader from "../components/transactions/BookingHeader";
import FilterRow from "../components/ui/FilterRow";
import Reveal from "../components/ui/Reveal";
import ConfirmModal from "../components/ui/ConfirmModal";

const stepButton = "flex-1 rounded-md bg-zinc-700 py-2 text-sm font-bold transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";

export default function Cart() {
  const { cartBookings, cartLoading, cartError, removeFromCart, updateCartItem } = useCart();
  const [filters, setFilters] = useState(emptyCartFilters);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [failed, setFailed] = useState("");

  const handleFilter = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });
  const options = {
    category: categories,
    ticketType: ticketTypes,
    date: months
  };

  const filteredBookings = cartBookings.filter((booking) =>
    booking.eventTitle.toLowerCase().includes(filters.name.trim().toLowerCase()) &&
    (!filters.category || booking.eventCategory === filters.category) &&
    (!filters.ticketType || booking.ticketName === filters.ticketType) &&
    (!filters.date || booking.eventDateTime?.startsWith(filters.date))
  );

  const handleQuantity = async (itemId, quantity) => {
    setUpdatingItemId(itemId);

    try {
      await updateCartItem(itemId, quantity);
    } catch {
      setFailed("Not enough tickets available!");
    } finally {
      setUpdatingItemId(null);
    }
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
      <title>Cart - EVENTRIX</title>
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
            filteredBookings.map((booking) => (
              <Reveal key={booking.cartItemId} className="w-full">
                <BookingCard booking={booking}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuantity(booking.cartItemId, booking.quantity - 1)}
                      disabled={booking.quantity <= 1 || updatingItemId === booking.cartItemId}
                      className={stepButton}
                    >
                      -
                    </button>
                    <p className="w-12 text-center font-bold">{booking.quantity}</p>
                    <button
                      type="button"
                      onClick={() => handleQuantity(booking.cartItemId, booking.quantity + 1)}
                      disabled={updatingItemId === booking.cartItemId}
                      className={stepButton}
                    >
                      +
                    </button>
                  </div>
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
        </div>
      </section>
      {failed && <ConfirmModal type="error" message={failed} onClose={() => setFailed("")} />}
    </div>
  );
}