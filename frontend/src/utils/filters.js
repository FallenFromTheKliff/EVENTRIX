import { IconCalendar, IconCategory, IconSearch, IconArchive } from "@tabler/icons-react";

export const eventFilters = [
  { name: "name", type: "search", placeholder: "Search by event name...", icon: IconSearch },
  { name: "category", type: "select", all: "All Categories", icon: IconCategory },
  { name: "date", type: "select", all: "All Dates", icon: IconCalendar }
]

export const adminEventFilters = [
  ...eventFilters,
  { name: "status", type: "select", all: "All Statuses", icon: IconArchive }
]

export const statuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" }
]

const now = new Date();

export const months = Array.from({ length: 6 }, (_, i) => {
  const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
  const prefix = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  return {
    value: prefix,
    label: date.toLocaleString("en-US", { month: "long", year: "numeric" }),
    startDate: `${prefix}-01T00:00:00`,
    endDate: `${prefix}-${new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}T23:59:59`
  };
})