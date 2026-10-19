import { Link, useParams } from "react-router";
import { IconArrowLeft } from "@tabler/icons-react";

import { useEvents } from "../context/EventContext";

import Reveal from "../components/ui/Reveal";

import Placeholder from "../assets/images/EVENTRIX-Placeholder.jpeg";

export default function EventView() {
  const { id } = useParams();
  const { getEvent } = useEvents();

  const event = getEvent(id);
  if (!event) return null;

  return (
    <div>
      <div className="flex border-b-4 border-zinc-900">
        <h2 className="flex items-center gap-3 -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          <Link to="/events" className="flex items-center gap-3 transition duration-200 hover:brightness-50">
            <IconArrowLeft size={32} />
            <Reveal variant="type">View Event</Reveal>
          </Link>
          <span>/ <Reveal variant="type">{event.title}</Reveal></span>
        </h2>
      </div>
      <Reveal variant="lazy" className="flex flex-col lg:flex-row bg-zinc-800 min-h-180 overflow-hidden rounded-xl mt-8">
        <div className="relative min-h-112 overflow-hidden lg:w-1/2">
          <img src={event.thumbnailUrl || Placeholder} alt={event.title} className="absolute inset-0 size-full object-cover" />
        </div>
        <Reveal variant="right" className="relative flex-1 p-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold">{event.title}</h3>
            {event.category && <p className="w-fit rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400">{event.category.name}</p>}
            <p className="text-gray-300">{new Date(event.dateTime).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
            {event.doorsOpen && <p className="text-gray-300">Doors open: {new Date(event.doorsOpen).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>}
            <p className="text-gray-300">{event.location}</p>
            <p className="text-2xl font-semibold text-cyan-400">₱{event.price}</p>
            <p className="text-gray-300">{event.availableTickets > 0 ? `${event.availableTickets} tickets left` : "Sold out"}</p>
            <p className="whitespace-pre-line text-gray-300">{event.description}</p>
          </div>
        </Reveal>
      </Reveal>
    </div>
  )
}