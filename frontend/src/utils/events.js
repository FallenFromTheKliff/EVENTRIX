export const imageTypes = ["image/png", "image/jpeg", "image/webp"];
export const steps = ["Introduction", "Venue", "Tickets", "Display"];
export const ticketNames = ["STANDARD", "VIP"];
export const defaultTicketPrice = 200;
export const defaultTicketQuantity = 1;

export const resizeImage = (file, width, height) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const scale = Math.max(width / img.width, height / img.height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.drawImage(img, (width - img.width * scale) / 2, (height - img.height * scale) / 2, img.width * scale, img.height * scale);
    URL.revokeObjectURL(url);
    resolve(canvas.toDataURL("image/jpeg", 0.85));
  };
  img.onerror = reject;
  img.src = url;
});

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
  showTime: "",
  totalTickets: "",
  ticketTypes: ticketNames.map((name) => emptyTicket(name))
});

export const eventFormValues = (event) => ({
  title: event.title,
  description: event.description ?? "",
  category: String(event.category?.id ?? ""),
  dateTime: event.dateTime.slice(0, 10),
  location: event.location,
  showTime: (event.showTime ?? event.dateTime).slice(11, 16),
  totalTickets: String(event.totalTickets),
  status: event.status,
  ticketTypes: ticketNames.map((name) =>
    emptyTicket(name, event.ticketTypes?.find(({ name: type }) => type?.toUpperCase() === name))
  )
});

export const filled = (value) => String(value ?? "").trim() !== "";

const toLocal = (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export const nowLocal = () => toLocal(new Date());

export const dateInPast = ({ dateTime, showTime }) => Boolean(dateTime) && new Date(`${dateTime}T${showTime || "23:59"}`) < new Date();

export const doorsOpenAt = (dateTime, showTime) => dateTime && showTime ? toLocal(new Date(new Date(`${dateTime}T${showTime}`).getTime() - 7200000)) : "";

export const dateTaken = (dateTime, takenDates = []) => Boolean(dateTime) && takenDates.some((taken) => Math.abs(new Date(dateTime) - new Date(taken)) <= 86400000);

export const selectedTickets = (tickets = []) => tickets.filter(({ enabled }) => enabled);

export const ticketCount = (tickets = []) => tickets.reduce((sum, ticket) => sum + Number(ticket.availableQuantity || 0), 0);

export const validTickets = (tickets = []) =>
  tickets.length > 0 &&
  tickets.every(({ price, availableQuantity }) =>
    Number(price) >= defaultTicketPrice &&
    Number.isInteger(Number(availableQuantity)) &&
    Number(availableQuantity) >= 1
  );

export const priceRange = (ticketTypes = []) =>
  ticketNames
    .map((name) => ticketTypes.find((ticket) => ticket.name?.toUpperCase() === name))
    .filter(Boolean)
    .map(({ price }) => `₱${price}`)
    .join(" - ");

export const eventPayload = (data, photo, pictures) => {
  const tickets = selectedTickets(data.ticketTypes);

  return {
    ...data,
    location: data.location.trim(),
    imageUrl: photo,
    price: tickets.length ? Math.min(...tickets.map(({ price }) => Number(price))) : 0,
    category: data.category ? { id: Number(data.category) } : null,
    previewImages: pictures,
    dateTime: `${data.dateTime}T00:00`,
    showTime: `${data.dateTime}T${data.showTime}`,
    doorsOpen: doorsOpenAt(data.dateTime, data.showTime),
    ticketTypes: tickets.map(({ enabled, ticketId, ...ticket }) => ({ ...ticket, id: ticketId })),
    totalTickets: ticketCount(tickets)
  };
};