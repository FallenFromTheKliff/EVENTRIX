import { useState, useEffect } from "react";
import { IconCalendarEvent, IconClock, IconFileText, IconMapPin, IconTag } from "@tabler/icons-react";

import { useEvents } from "../../context/EventContext";
import { iconStyle, pillStyle, tagStyle, toDate, toTime } from "../../utils/events";

import EventField from "../events/EventField";
import Placeholder from "../../assets/images/EVENTRIX-Placeholder.jpeg";

export default function DetailsModal({ booking, onClose }) {
  const { getEventById } = useEvents();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    let active = true;

    getEventById(booking.eventId)
      .then((data) => {
        if (active) setEvent(data);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [booking.eventId, getEventById]);

  return (
    <div onClick={onClose} className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 backdrop-blur-lg px-6 transition-opacity duration-300 starting:opacity-0">
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-full w-full max-w-180 flex-col gap-4 overflow-y-auto rounded-xl bg-slate-900 p-8 text-white shadow-2xl shadow-black transition duration-300 starting:scale-90">
        <img src={booking.eventImageUrl || Placeholder} alt={booking.eventTitle} className="h-56 w-full rounded-md object-cover" />
        {event ? (
          <>
            <h3 className="text-3xl font-bold">{event.title}</h3>
            {event.category && <p className={tagStyle}><IconTag size={18} />{event.category}</p>}
            <p className={pillStyle}>
              <IconCalendarEvent size={20} className={iconStyle} />
              {toDate(event.dateTime)}
            </p>
            <p className={pillStyle}>
              <IconMapPin size={20} className={iconStyle} />
              {event.location}
            </p>
            <div className="flex gap-4">
              <p className={`${pillStyle} flex-1`}>
                <IconClock size={20} className={iconStyle} />
                Doors Open: {toTime(event.doorsOpen)}
              </p>
              <p className={`${pillStyle} flex-1`}>
                <IconClock size={20} className={iconStyle} />
                Show Time: {toTime(event.showTime)}
              </p>
            </div>
            <EventField type="textarea" name="description" label="Description:" icon={IconFileText} value={event.description ?? ""} readOnly />
          </>
        ) : (
          <h3 className="text-3xl font-bold">{booking.eventTitle}</h3>
        )}
        <button type="button" onClick={onClose} className="w-full rounded-md bg-cyan-500 py-2.5 text-lg font-bold transition duration-200 hover:brightness-50">
          CLOSE
        </button>
      </div>
    </div>
  );
}