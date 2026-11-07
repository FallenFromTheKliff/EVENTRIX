import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";

import EventCard from "../components/events/EventCard";
import Reveal from "../components/ui/Reveal";
import FilterRow from "../components/ui/FilterRow";
import Pagination from "../components/ui/Pagination";

import { messageStyle } from "../utils/styles";
import { adminEventFilters, eventFilters, months, statuses } from "../utils/filters";
import usePagination from "../utils/usePagination";
import { categories } from "../data/details";

export default function Events() {
  const { user } = useAuth();
  const { events, filters, handleFilter, favoritesOnly, debouncedFavorites, eventsLoading, eventsError } = useEvents();
  const { page, pages, setPage, items } = usePagination(events);

  const fields = user.role === "ADMIN" ? adminEventFilters : eventFilters;
  const options = { category: categories, date: months, status: statuses };

  const handleChange = (e) => {
    handleFilter(e);
    setPage(1);
  };

  return (
    <div className="flex flex-1 flex-col">
      <title>Events | EVENTRIX</title>
      <div className="flex flex-wrap items-end gap-x-4">
        <h2 className="relative -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          <Reveal variant="type">{user.role === "ADMIN" ? "Manage Events" : "Events"}</Reveal>
        </h2>
        <Reveal variant="slide" className="ml-auto">
          <FilterRow fields={fields.filter(({ type }) => type === "search")} filters={filters} options={options} onChange={handleChange} />
        </Reveal>
        <div className="bg-zinc-900 order-1 2xl:order-2 h-1 w-full" />
        <Reveal variant="slide" className="order-2 2xl:order-1 mt-3 2xl:mt-0">
          <FilterRow fields={fields.filter(({ type }) => type !== "search")} filters={filters} options={options} onChange={handleChange} />
        </Reveal>
      </div>
      {eventsLoading && !events.length ? (
        <p className={messageStyle}>Loading events...</p>
      ) : eventsError ? (
        <p className={messageStyle}>{eventsError}</p>
      ) : events.length > 0 ? (
        <div className="grid gap-8 mt-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((event) => (
            <Reveal key={`${event.eventId}-${debouncedFavorites}`} className="h-full">
              <EventCard event={event} role={user.role} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="my-auto py-8 text-center text-gray-400">
          {favoritesOnly
            ? "You haven't favorited any events yet..."
            : filters.name.trim() || filters.category || filters.date || (user.role === "ADMIN" && filters.status !== "ACTIVE")
              ? "No events match your filters..."
              : user.role === "ADMIN"
                ? "You should start adding events to kick things off!"
                : "It seems there are no events available..."}
        </p>
      )}
      <Pagination page={page} pages={pages} onChange={setPage} className="pt-6" />
    </div>
  );
}