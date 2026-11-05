import { useState } from "react";
import { Link } from "react-router";

import { IconCalendarEvent, IconClock, IconHeartFilled, IconMapPin } from "@tabler/icons-react";
import { priceRange, toSlug, toTime, toDate } from "../../utils/events";

import { useEvents } from "../../context/EventContext";
import { useCart } from "../../context/CartContext";

import useLoadingText from "../ui/useLoadingText";
import ConfirmModal from "../ui/ConfirmModal";

import Placeholder from "../../assets/images/EVENTRIX-Placeholder.jpeg";

const colors = { USER: "bg-zinc-800", ADMIN: "bg-zinc-900" };
const buttonStyle = "flex-1 font-bold rounded-md py-2 cursor-pointer transition duration-200 hover:brightness-50";
const disabledStyle = "disabled:opacity-50 disabled:cursor-default disabled:hover:brightness-100 aria-disabled:opacity-50 aria-disabled:cursor-default aria-disabled:hover:brightness-100";

export default function EventCard({ event, role }) {
  const { toggleFavorite, deleteEvent } = useEvents();
  const { quickBuy: addQuickBuyToCart } = useCart();
  const { loading, runner, texter } = useLoadingText();
  const quickBuy = useLoadingText(500);
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState("");
  const [added, setAdded] = useState(false);

  const handleDelete = () => runner(async () => {
    try {
      await deleteEvent(event.eventId);
    } catch {
      setConfirming(false);
      setFailed("Failed to delete event!");
    }
  });

  const handleQuickBuy = () => {
    if (added) return;

    quickBuy.runner(async () => {
      try {
        const ticket = event.ticketTypes.find(({ name }) => name?.toUpperCase() === "STANDARD");

        if (!ticket) {
          setFailed("Standard tickets are unavailable!");
          return;
        }

        await addQuickBuyToCart(ticket.id, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
      } catch {
        setFailed("Failed to add to cart!");
      }
    });
  };

  return (
    <>
      <div className={`flex flex-col h-full min-h-136 ${colors[role]} overflow-hidden rounded-xl shadow-2xl shadow-black/60`}>
        <div className="relative">
          <img src={event.thumbnailUrl || Placeholder} alt={event.title} className="h-72 w-full object-cover" />
          {role === "USER" && (
            <button
              onClick={() => toggleFavorite(event.eventId)}
              className={`absolute top-3 right-3 bg-black/50 rounded-full p-2 cursor-pointer transition duration-200 hover:brightness-50 ${event.liked ? "text-red-500" : "text-white"}`}
            >
              <IconHeartFilled size={28} />
            </button>
          )}
        </div>
        <div className="space-y-1 p-4">
          <h3 className="text-2xl font-bold">{event.title}</h3>
          <p className="flex items-center gap-2 text-sm text-gray-300">
            <IconCalendarEvent size={18} className="shrink-0 text-cyan-400" />
            {toDate(event.dateTime)}
          </p>
          <p className="flex items-center gap-2 text-sm text-gray-300">
            <IconClock size={18} className="shrink-0 text-cyan-400" />
            {toTime(event.showTime)}
          </p>
          <p className="flex items-center gap-2 text-sm text-gray-300">
            <IconMapPin size={18} className="shrink-0 text-cyan-400" />
            {event.location}
          </p>
        </div>
        <div className="mt-auto space-y-3 px-4 pb-4">
          <p className="text-lg font-semibold text-cyan-400">{priceRange(event.ticketTypes)}</p>
          <div className="flex gap-3">
            {role === "ADMIN" ? (
              <>
                <Link to={`/edit-event/${toSlug(event.title)}`} className={`${buttonStyle} bg-yellow-500 text-center`}>EDIT</Link>
                <button onClick={() => setConfirming(true)} className={`${buttonStyle} bg-red-500`}>ARCHIVE</button>
              </>
            ) : (
              <>
                <Link
                  to={`/events/${toSlug(event.title)}`}
                  onClick={(e) => quickBuy.loading && e.preventDefault()}
                  aria-disabled={quickBuy.loading}
                  className={`${buttonStyle} ${disabledStyle} bg-cyan-500 text-center`}
                >
                  VIEW
                </Link>
                <button
                  onClick={handleQuickBuy}
                  disabled={quickBuy.loading}
                  className={`${buttonStyle} ${disabledStyle} bg-yellow-500`}
                >
                  {added ? "ADDED!" : quickBuy.texter("QUICK BUY", "ADDING")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {confirming && (
        <ConfirmModal
          message="Delete event?"
          description="This will permanently remove the event and cannot be undone."
          confirmText={texter("DELETE", "DELETING")}
          loading={loading}
          onConfirm={handleDelete}
          onClose={() => setConfirming(false)}
        />
      )}
      {failed && <ConfirmModal type="error" message={failed} onClose={() => setFailed("")} />}
    </>
  );
}