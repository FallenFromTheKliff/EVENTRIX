import { useState } from "react";
import { Link, useLocation } from "react-router";

import { toSlug } from "../../utils/events";
import { toDate } from "../../utils/dates";
import { adminColumns, bookingButton, bookingColumns } from "../../utils/styles";
import { bookingStatuses, ticketBadges } from "../../data/statcheck";

import Placeholder from "../../assets/images/EVENTRIX-Placeholder.jpeg";

export default function BookingCard({ booking, children, admin = false }) {
  const [open, setOpen] = useState(false);
  const { label, color } = bookingStatuses[booking.status] ?? bookingStatuses.PENDING;
  const { color: ticketColor, icon: TicketIcon } = ticketBadges[booking.ticketName] ?? ticketBadges.STANDARD;
  const { pathname } = useLocation();

  return (
    <>
      <div className={`overflow-hidden rounded-xl ${admin ? "bg-zinc-900" : "bg-zinc-800"}`}>
        <div className={`grid items-center gap-3 px-5 py-4 ${admin ? `${adminColumns} text-sm` : `${bookingColumns} gap-4 px-6`}`}>
          {admin && (
            <p className="truncate" title={booking.userEmail || booking.userName}>
              {booking.userName || booking.userEmail || "—"}
            </p>
          )}
          <h3 className={`truncate ${admin ? "text-base text-center" : "text-lg"} font-bold`}>{booking.eventTitle}</h3>
          <p className="text-center font-bold">{booking.quantity}</p>
          <p className={`text-center ${admin ? "text-xs" : "text-sm"} ${color}`}>{label}</p>
          <p className="truncate text-center font-bold" title={booking.bookingReference}>
            {booking.bookingReference || "—"}
          </p>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            className="w-full rounded-md bg-yellow-500 py-2 text-xs font-bold transition duration-200 cursor-pointer hover:brightness-50"
          >
            {open ? "COLLAPSE" : "VIEW DETAILS"}
          </button>
        </div>
        <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className={`border-t ${admin ? "border-zinc-600" : "border-zinc-700"}`}>
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
                    <p className={booking.bookingDate ? "" : `${bookingStatuses.PENDING.color} italic`}>
                      {booking.bookingDate ? toDate(booking.bookingDate, "long") : "Set after payment"}
                    </p>
                    {booking.ticketName && (
                      <>
                        <p>Ticket Type:</p>
                        <p className={`flex w-fit items-center gap-2 rounded-md px-3 py-0.5 ${ticketColor} font-bold`}>
                          <TicketIcon size={18} />
                          {booking.ticketName}
                        </p>
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
                    {children}
                    {!booking.cartItemId && (
                      <Link
                        to={`${admin ? "/edit-event" : "/events"}/${toSlug(booking.eventTitle)}`}
                        state={{ from: pathname, eventId: booking.eventId }}
                        className={`${bookingButton} bg-green-500 hover:brightness-50`}
                      >
                        VIEW DETAILS
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}