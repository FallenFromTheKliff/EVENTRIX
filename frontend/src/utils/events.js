import { categories, ticketNames, defaultTicketPrice, defaultTicketQuantity } from "../data/details";
import { findTicket, selectedTickets, ticketCount } from "./tickets";
import { doorsOpenAt } from "./dates";

export const toSlug = (title) => title.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
export const filled = (value) => String(value ?? "").trim() !== "";

const emptyTicket = (name, ticket = {}) => ({
  name,
  price: String(ticket.price ?? defaultTicketPrice),
  availableQuantity: String(ticket.availableQuantity ?? defaultTicketQuantity),
  description: ticket.description ?? "",
  ticketId: ticket.id,
  enabled: Boolean(ticket.id)
});

export const emptyEventValues = () => ({
  title: "",
  description: "",
  category: categories[0].value,
  dateTime: "",
  location: "",
  showTime: "",
  ticketTypes: ticketNames.map((name) => emptyTicket(name))
});
export const eventFormValues = (event) => ({
  title: event.title,
  description: event.description ?? "",
  category: event.category ?? categories[0].value,
  dateTime: event.dateTime.slice(0, 10),
  location: event.location,
  showTime: (event.showTime ?? event.dateTime).slice(11, 16),
  status: event.status,
  ticketTypes: ticketNames.map((name) => emptyTicket(name, findTicket(event.ticketTypes, name)))
});
export const eventPayload = (data, photo, pictures) => {
  const tickets = selectedTickets(data.ticketTypes);
  return {
    ...data,
    location: data.location.trim(),
    imageUrl: photo,
    price: tickets.length ? Math.min(...tickets.map(({ price }) => Number(price))) : 0,
    category: data.category || null,
    previewImages: pictures.map(({ id, imageUrl }) => id ? { id } : { imageUrl }),
    dateTime: `${data.dateTime}T00:00`,
    showTime: `${data.dateTime}T${data.showTime}`,
    doorsOpen: doorsOpenAt(data.dateTime, data.showTime) || null,
    ticketTypes: tickets.map(({ ticketId, name, price, availableQuantity, description }) => ({ id: ticketId, name, price, availableQuantity, description })),
    totalTickets: ticketCount(tickets)
  };
};