import { useState } from "react";

import { toDate, toReference } from "../../utils/events";
import { bookingStatuses } from "../../data/statcheck";

import EventInfo from "./EventInfo";
import Placeholder from "../../assets/images/EVENTRIX-Placeholder.jpeg";

const bookingGrid = "grid grid-cols-[minmax(0,2fr)_minmax(5rem,1fr)_minmax(7rem,1fr)_minmax(8rem,1.5fr)_7rem] items-center gap-4";
const bookingButton = "flex w-full items-center justify-center rounded-md py-2 text-center text-sm font-bold transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";

export default function BookingCard({ booking, children }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const { label, color } = bookingStatuses[booking.status] ?? bookingStatuses.PENDING;

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-zinc-800">
        <div className={`${bookingGrid} px-6 py-4`}>
          <h3 className="truncate text-lg font-bold">{booking.eventTitle}</h3>
          <p className="text-center font-bold">{booking.quantity}</p>
          <p className={`text-center text-sm ${color}`}>{label}</p>
          <p className="text-center font-bold">
            {booking.bookingReference || "—"}
          </p>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            className="w-full rounded-md bg-yellow-500 py-2 text-sm font-bold transition duration-200 cursor-pointer hover:brightness-50"
          >
            {open ? "COLLAPSE" : "VIEW DETAILS"}
          </button>
        </div>
        <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className="border-t border-zinc-700">
              <div className="flex flex-col gap-6 px-6 pt-5 pb-6 lg:flex-row lg:items-stretch">
                <img
                  src={booking.eventImageUrl || Placeholder}
                  alt={booking.eventTitle || "Event"}
                  className="h-56 w-full rounded-md object-cover lg:w-72 lg:shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 md:flex-row md:items-end">
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                    <p>Event Date:</p>
                    <p>{booking.eventDateTime ? toDate(booking.eventDateTime, "long") : "—"}</p>
                    <p>Event Venue:</p>
                    <p>{booking.eventLocation || "—"}</p>
                    <p>Booking Date:</p>
                    <p>{booking.bookingDate ? toDate(booking.bookingDate, "long") : "—"}</p>
                    {booking.ticketName && (
                      <>
                        <p>Ticket Type:</p>
                        <p>{booking.ticketName}</p>
                      </>
                    )}
                    <p>Ticket Price:</p>
                    <p>₱{(Number(booking.totalAmount || 0) / Math.max(Number(booking.quantity || 0), 1)).toFixed(2)}</p>
                    <p>Number of Tickets:</p>
                    <p>{booking.quantity}</p>
                    <div className="col-span-2 border-t border-gray-500" />
                    <p>Total Price:</p>
                    <p>₱{Number(booking.totalAmount || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex w-full flex-col justify-center gap-2 md:w-60 md:shrink-0">
                    {booking.cartItemId ? children : (
                      <button
                        type="button"
                        onClick={() => setDetails(true)}
                        className={`${bookingButton} bg-green-500 hover:brightness-50`}
                      >
                        VIEW DETAILS
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {details && <EventInfo booking={booking} onClose={() => setDetails(false)} />}
    </>
  );
}