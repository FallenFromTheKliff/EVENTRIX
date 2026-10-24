import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";

import EventCard from "../components/events/EventCard";
import Reveal from "../components/ui/Reveal";
import FilterRow from "../components/ui/FilterRow";

import { adminEventFilters, eventFilters, months, statuses } from "../utils/filters";

export default function Events() {
  const { user } = useAuth();
  const { events, categories, filters, handleFilter } = useEvents();
  const fields = user.role === "ADMIN" ? adminEventFilters : eventFilters;
  const options = { category: categories.map(({ name }) => ({ value: name, label: name })), date: months, status: statuses };

  const filteredEvents = events.filter((event) =>
    (!filters.name || event.title.toLowerCase().includes(filters.name.trim().toLowerCase())) &&
    (!filters.category || event.category?.name === filters.category) &&
    (!filters.date || event.dateTime?.startsWith(filters.date)) &&
    (user.role !== "ADMIN" || !filters.status || event.status === filters.status)
  );

  return (
    <div className="flex flex-1 flex-col">
      <title>Events - EVENTRIX</title>
      <div className="flex flex-wrap items-end gap-x-4">
        <h2 className="relative -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          <Reveal variant="type">{user.role === "ADMIN" ? "Manage Events" : "Ongoing Events"}</Reveal>
        </h2>
        <Reveal variant="slide" className="ml-auto">
          <FilterRow fields={fields.filter(({ type }) => type === "search")} filters={filters} options={options} onChange={handleFilter} />
        </Reveal>
        <div className="bg-zinc-900 order-1 2xl:order-2 h-1 w-full" />
        <Reveal variant="slide" className="order-2 2xl:order-1 mt-3 2xl:mt-0">
          <FilterRow fields={fields.filter(({ type }) => type !== "search")} filters={filters} options={options} onChange={handleFilter} />
        </Reveal>
      </div>
      {filteredEvents.length > 0 ? (
        <div className="grid gap-8 mt-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <Reveal key={event.eventId} className="h-full">
              <EventCard event={event} role={user.role} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="my-auto py-8 text-center text-gray-400">
          {events.length === 0
            ? (user.role === "ADMIN" ? "You should start adding events to kick things off" : "It seems there are no events available...")
            : "No events match your filters."}
        </p>
      )}
    </div>
  );
}