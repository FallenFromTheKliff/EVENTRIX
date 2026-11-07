import { ticketNames, defaultTicketPrice, defaultTicketQuantity } from "../data/details";

export const findTicket = (ticketTypes = [], name) => ticketTypes.find((ticket) => ticket.name === name);
export const selectedTickets = (tickets = []) => tickets.filter(({ enabled }) => enabled);
export const ticketCount = (tickets = []) => tickets.reduce((sum, ticket) => sum + Number(ticket.availableQuantity || 0), 0);
export const validTicketSetup = (tickets = []) =>
  tickets.length > 0 &&
  tickets.every(({ ticketId, price, availableQuantity }) =>
    Number(price) >= defaultTicketPrice &&
    availableQuantity !== "" &&
    Number.isInteger(Number(availableQuantity)) &&
    Number(availableQuantity) >= (ticketId ? 0 : defaultTicketQuantity)
  );

export const priceRange = (ticketTypes = []) =>
ticketNames
  .map((name) => findTicket(ticketTypes, name))
  .filter(Boolean)
  .map(({ price }) => `₱${price}`)
  .join(" - ");
export const isSoldOut = ({ status, ticketTypes = [] }) => status === "ACTIVE" && ticketTypes.length > 0 && ticketTypes.every(({ availableQuantity }) => availableQuantity < 1);

export const emptySelection = Object.fromEntries(ticketNames.map((name) => [name, { enabled: false, quantity: String(defaultTicketQuantity) }]));
export const eventTickets = (ticketTypes, selection, cartItems) => ticketNames.flatMap((name) => {
  const ticket = findTicket(ticketTypes, name);
  return ticket ? [{ ...ticket, ...selection[name], name, carted: cartItems.filter((item) => item.ticketType.id === ticket.id).reduce((sum, item) => sum + item.quantity, 0) }] : [];
});
export const totalPrice = (tickets = [], key) => tickets.reduce((sum, ticket) => sum + ticket.price * Number(ticket[key]), 0);

export const validSeats = (tickets = []) =>
  tickets.length > 0 &&
  tickets.every(({ quantity, availableQuantity }) =>
    Number.isInteger(Number(quantity)) &&
    Number(quantity) >= 1 &&
    Number(quantity) <= availableQuantity
  );