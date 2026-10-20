import { useState } from "react";

import { Link, useParams } from "react-router";
import { IconArrowLeft, IconCalendarEvent, IconClock, IconMapPin, IconTag, IconCurrencyPeso, IconTicket, IconFileText } from "@tabler/icons-react";

import { useEvents } from "../context/EventContext";

import Reveal from "../components/ui/Reveal";
import PictureSlider from "../components/events/PictureSlider";

import Placeholder from "../assets/images/EVENTRIX-Placeholder.jpeg";

export default function EventView() {
  const { id } = useParams();
  const { getEvent } = useEvents();
  const [slide, setSlide] = useState(0);

  const event = getEvent(id);
  if (!event) return null;
  const images = event.previewImages?.length ? event.previewImages.map(({ imageUrl }) => imageUrl) : [Placeholder];

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
          <PictureSlider images={images} index={slide} alt={event.title} onChange={setSlide} />
        </div>
        <Reveal variant="right" className="relative flex-1 p-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold">{event.title}</h3>
            {event.category && <p className="flex w-fit items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400"><IconTag size={18} />{event.category.name}</p>}
            <p className="relative rounded-md bg-white/5 p-3 pl-11 text-gray-300">
              <IconCalendarEvent size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              {new Date(event.dateTime).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
            </p>
            {event.doorsOpen && (
              <p className="relative rounded-md bg-white/5 p-3 pl-11 text-gray-300">
                <IconClock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                Doors open: {new Date(event.doorsOpen).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            )}
            <p className="relative rounded-md bg-white/5 p-3 pl-11 text-gray-300">
              <IconMapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              {event.location}
            </p>
            <p className="relative flex items-center gap-2 rounded-md bg-white/5 p-3 pl-11 text-2xl font-semibold text-cyan-400">
              <IconCurrencyPeso size={22} className="absolute left-3 top-1/2 -translate-y-1/2" />
              {event.price}
            </p>
            <p className="relative rounded-md bg-white/5 p-3 pl-11 text-gray-300">
              <IconTicket size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              {event.availableTickets > 0 ? `${event.availableTickets} tickets left` : "Sold out"}
            </p>
            <p className="relative whitespace-pre-line rounded-md bg-white/5 p-3 pl-11 text-gray-300">
              <IconFileText size={20} className="absolute left-3 top-3 text-cyan-400" />
              {event.description}
            </p>
          </div>
        </Reveal>
      </Reveal>
    </div>
  )
}