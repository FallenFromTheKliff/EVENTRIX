export const imageTypes = ["image/png", "image/jpeg", "image/webp"];
export const steps = ["Introduction", "Venue", "Tickets"];
export const ticketNames = ["STANDARD", "VIP"];
export const defaultTicketPrice = 200;
export const defaultTicketQuantity = 1;

export const emptyTicket = (name, ticket = {}) => ({
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
  category: "",
  dateTime: "",
  location: "",
  doorsOpen: "",
  totalTickets: "",
  ticketTypes: ticketNames.map((name) => emptyTicket(name))
});

export const eventFormValues = (event) => ({
  title: event.title,
  description: event.description ?? "",
  category: String(event.category?.id ?? ""),
  dateTime: event.dateTime.slice(0, 16),
  location: event.location,
  doorsOpen: event.doorsOpen?.slice(11, 16) ?? "",
  totalTickets: String(event.totalTickets),
  status: event.status,
  ticketTypes: ticketNames.map((name) =>
    emptyTicket(name, event.ticketTypes?.find(({ name: type }) => type?.toUpperCase() === name))
  )
});

export const filled = (value) => String(value ?? "").trim() !== "";

export const doorsLate = ({ doorsOpen, dateTime }) =>
  Boolean(dateTime && doorsOpen > dateTime.slice(11, 16));

export const selectedTickets = (tickets = []) =>
  tickets.filter(({ enabled }) => enabled);

export const ticketCount = (tickets = []) =>
  tickets.reduce((sum, ticket) => sum + Number(ticket.availableQuantity || 0), 0);

export const validTickets = (tickets = []) =>
  tickets.length > 0 &&
  tickets.every(({ price, availableQuantity }) =>
    Number(price) >= defaultTicketPrice &&
    Number.isInteger(Number(availableQuantity)) &&
    Number(availableQuantity) >= 1
  );

export const eventPayload = (data, photo) => {
  const tickets = selectedTickets(data.ticketTypes);

  return {
    ...data,
    imageUrl: photo,
    price: tickets.length ? Math.min(...tickets.map(({ price }) => Number(price))) : 0,
    category: data.category ? { id: Number(data.category) } : null,
    doorsOpen: data.doorsOpen && `${data.dateTime.slice(0, 10)}T${data.doorsOpen}`,
    ticketTypes: tickets.map(({ enabled, ticketId, ...ticket }) => ({ ...ticket, id: ticketId })),
    totalTickets: ticketCount(tickets)
  };
};