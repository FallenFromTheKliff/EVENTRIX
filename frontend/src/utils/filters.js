import { IconCalendar, IconCategory, IconSearch, IconArchive, IconTicket } from "@tabler/icons-react";
import { bookingStatuses, eventStatuses } from "../data/statcheck";
import { months as monthNames } from "../data/details";

export const emptyFilters = { name: "", category: "", ticketType: "", date: "", status: "" };
export const emptyEventFilters = { name: "", category: "", date: "", status: "ACTIVE" };
export const emptyCartFilters = { name: "", category: "", ticketType: "", date: "" };

export const eventFilters = [
  { name: "name", type: "search", placeholder: "Search by event name...", icon: IconSearch },
  { name: "category", type: "select", all: "All Categories", icon: IconCategory },
  { name: "date", type: "select", all: "All Dates", icon: IconCalendar }
];

export const adminEventFilters = [
  ...eventFilters,
  { name: "status", type: "select", all: "All Statuses", icon: IconArchive }
];

export const statuses = eventStatuses;

export const cartFilters = [
  { name: "name", type: "search", placeholder: "Search cart...", icon: IconSearch },
  { name: "category", type: "select", all: "All Categories", icon: IconCategory },
  { name: "ticketType", type: "select", all: "All Ticket Types", icon: IconTicket },
  { name: "date", type: "select", all: "All Dates", icon: IconCalendar }
];

export const bookingFilters = [
  ...cartFilters,
  { name: "status", type: "select", all: "All Statuses", icon: IconArchive }
];

export const bookingStatusOptions = ["PENDING", "PAID", "PROCESSING", "CANCELLED", "COMPLETED"].map((value) => ({ value, label: bookingStatuses[value].label }));

const now = new Date();

export const months = Array.from({ length: 6 }, (_, i) => {
  const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
  const prefix = `${date.getFullYear()}-${monthNames[date.getMonth()].value}`;
  return {
    value: prefix,
    label: `${monthNames[date.getMonth()].label} ${date.getFullYear()}`,
    startDate: `${prefix}-01T00:00:00`,
    endDate: `${prefix}-${new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}T23:59:59`
  };
});