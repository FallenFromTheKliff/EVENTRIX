import { useState } from "react";
import { Link } from "react-router";

import { IconHeartFilled } from "@tabler/icons-react";

import { useEvents } from "../../context/EventContext";

import useLoadingText from "../ui/useLoadingText";
import ConfirmModal from "../ui/ConfirmModal";

import Placeholder from "../../assets/images/EVENTRIX-Placeholder.jpeg";

const colors = { USER: "bg-zinc-800", ADMIN: "bg-zinc-900" };
const buttonStyle = "flex-1 font-bold rounded-md py-2 cursor-pointer transition duration-200 hover:brightness-50";

export default function EventCard({ event, role }) {
  const { toggleFavorite, deleteEvent } = useEvents();
  const { loading, runner, texter } = useLoadingText();
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleDelete = () => runner(async () => {
    try {
      await deleteEvent(event.eventId);
    } catch {
      setConfirming(false);
      setFailed(true);
    }
  });

  return (
    <>
      <div className={`flex flex-col ${colors[role]} overflow-hidden rounded-xl shadow-2xl shadow-black/60`}>
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
          <h3 className="text-xl font-bold">{event.title}</h3>
          <p className="text-sm text-gray-300">{new Date(event.dateTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
          <p className="text-sm text-gray-300">{event.location}</p>
          <p className="text-lg font-semibold text-cyan-400">₱{event.price}</p>
        </div>
        <div className="mt-auto flex gap-3 px-4 pb-4">
          {role === "ADMIN" ? (
            <>
              <Link to={`/edit-event/${event.eventId}`} className={`${buttonStyle} bg-yellow-500 text-center`}>EDIT</Link>
              <button onClick={() => setConfirming(true)} className={`${buttonStyle} bg-red-500`}>DELETE</button>
            </>
          ) : (
            <>
              <Link to={`/events/${event.eventId}`} className={`${buttonStyle} bg-cyan-500 text-center`}>VIEW</Link>
              <button className={`${buttonStyle} bg-yellow-500`}>QUICK BUY</button>
            </>
          )}
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
      {failed && <ConfirmModal type="error" message="Failed to delete event!" onClose={() => setFailed(false)} />}
    </>
  )
}