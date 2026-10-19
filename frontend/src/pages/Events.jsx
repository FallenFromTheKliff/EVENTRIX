import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";

import EventCard from "../components/events/EventCard";
import Reveal from "../components/ui/Reveal";
import FilterRow from "../components/ui/FilterRow";

import { adminEventFilters, eventFilters, months, statuses } from "../utils/filters";

export default function Events() {
  const { user } = useAuth();
  const { events, categories, filters, handleFilter } = useEvents();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-zinc-900">
        <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          <Reveal variant="type">{user.role === "ADMIN" ? "Manage Events" : "Ongoing Events"}</Reveal>
        </h2>
        <Reveal variant="slide">
          <FilterRow fields={user.role === "ADMIN" ? adminEventFilters : eventFilters} filters={filters} options={{ category: categories.map(({ name }) => ({ value: name, label: name })), date: months, status: statuses }} onChange={handleFilter} />
        </Reveal>
      </div>
      <div className="grid gap-8 mt-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {events.map((event) => (
          <Reveal key={event.eventId} className="h-full">
            <EventCard event={event} role={user.role} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}