import { Link } from "react-router";

import { useCart } from "../context/CartContext";
import { toSlug } from "../utils/events";

import BookingCard from "../components/events/BookingCard";
import Reveal from "../components/ui/Reveal";

const bookingButton = "flex w-full items-center justify-center rounded-md py-2 text-center text-sm font-bold transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";

export default function Cart() {
  const { cartBookings = [], removeFromCart } = useCart();

  return (
    <div>
      <title>Cart - EVENTRIX</title>
      <section>
        <div className="flex border-b-4 border-zinc-900">
          <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            <Reveal variant="type">My Cart</Reveal>
          </h2>
        </div>
        <div className="mt-4 space-y-4">
          {cartBookings.length > 0 ? (
            <>
              <div className="hidden w-full grid-cols-[minmax(0,2fr)_minmax(5rem,1fr)_minmax(7rem,1fr)_minmax(8rem,1.5fr)_7rem] items-center gap-4 px-6 py-4 text-sm text-gray-300 md:grid">
                <p className="text-lg font-bold">Event</p>
                <p className="text-center text-lg font-bold">Tickets</p>
                <p className="text-center text-lg font-bold">Status</p>
                <p className="text-center text-lg font-bold">Reference ID</p>
                <div />
              </div>
              {cartBookings.map((booking) => (
                <BookingCard key={booking.cartItemId} booking={booking}>
                  <Link
                    to={`/events/${toSlug(booking.eventTitle)}`}
                    state={{ payment: true }}
                    className={`${bookingButton} bg-green-500 hover:brightness-50`}
                  >
                    PROCEED TO PAYMENT
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromCart(booking.cartItemId)}
                    className={`${bookingButton} bg-red-500`}
                  >
                    REMOVE FROM CART
                  </button>
                </BookingCard>
              ))}
            </>
          ) : (
            <p className="py-8 text-center text-gray-400">Your cart is empty.</p>
          )}
        </div>
      </section>
    </div>
  );
}