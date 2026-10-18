import { IconCalendar, IconCategory, IconSearch } from "@tabler/icons-react";

import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";

import EventCard from "../components/events/EventCard";

import { months } from "../utils/filters";

const wrapStyle = "relative rounded-md bg-zinc-900";
const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
const filterStyle = "relative block bg-transparent rounded-md py-2 pl-10 pr-4 focus:outline-2 focus:outline-cyan-500";

export default function Events() {
  const { user } = useAuth();
  const { events, categories, filters, handleFilter } = useEvents();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-zinc-900">
        <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          {user.role === "ADMIN" ? "Manage Events" : "Ongoing Events"}
        </h2>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className={wrapStyle}>
            <IconSearch size={20} className={iconStyle} />
            <input
              name="name"
              type="text"
              placeholder="Search by event name..."
              value={filters.name}
              onChange={handleFilter}
              className={`${filterStyle} w-56`}
            />
          </div>
          <div className={wrapStyle}>
            <IconCategory size={20} className={iconStyle} />
            <select name="category" value={filters.category} onChange={handleFilter} className={`${filterStyle} cursor-pointer`}>
              <option value="" className="bg-zinc-900">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category} className="bg-zinc-900">{category}</option>
              ))}
            </select>
          </div>
          <div className={wrapStyle}>
            <IconCalendar size={20} className={iconStyle} />
            <select name="date" value={filters.date} onChange={handleFilter} className={`${filterStyle} cursor-pointer`}>
              <option value="" className="bg-zinc-900">All Dates</option>
              {months.map(({ value, label }) => (
                <option key={value} value={value} className="bg-zinc-900">{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid gap-8 mt-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {events.map((event) => (
          <EventCard key={event.eventId} event={event} role={user.role} />
        ))}
      </div>
    </div>
  )
}