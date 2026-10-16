import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import { months } from "../utils/filters";

const filterStyle = "bg-zinc-900 rounded-md px-4 py-2 focus:outline-2 focus:outline-cyan-500";

export default function Events() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ name: "", category: "", date: "" });
  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-zinc-900">
      <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
        {user.role === "ADMIN" ? "Manage Events" : "Ongoing Events"}
      </h2>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <input
          name="name"
          type="text"
          placeholder="Search by event name..."
          value={filters.name}
          onChange={handleFilter}
          className={`${filterStyle} w-56`}
        />
        <select name="category" value={filters.category} onChange={handleFilter} className={`${filterStyle} cursor-pointer`}>
          <option value="">All Categories</option>
        </select>
        <select name="date" value={filters.date} onChange={handleFilter} className={`${filterStyle} cursor-pointer`}>
          <option value="">All Dates</option>
          {months.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}