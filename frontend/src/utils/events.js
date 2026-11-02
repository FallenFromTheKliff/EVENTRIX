import PaymentGCash from "../assets/images/Payment-GCash.png";
import PaymentPayPal from "../assets/images/Payment-PayPal.png";

export const toSlug = (title) => title.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");

const inputBase = "w-full bg-white/15 rounded-md p-3 focus:outline-2";
export const inputStyle = `${inputBase} focus:outline-cyan-500`;
export const registerInputStyle = `${inputBase} focus:outline-yellow-500`;

export const imageTypes = ["image/png", "image/jpeg", "image/webp"];
export const steps = ["Introduction", "Venue", "Tickets", "Display"];
export const ticketNames = ["STANDARD", "VIP"];
export const ticketTypes = ticketNames.map((name) => ({ value: name, label: name }));
export const defaultTicketPrice = 200;
export const defaultTicketQuantity = 1;

export const profileSegments = ["Introduction", "Aesthetics", "Additional Details", "Security"];

export const segmentStyle = "-mb-1 border-b-4 pb-3 transition duration-300";
export const buttonStyle = "flex-1 font-bold rounded-md py-3 text-center transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";
export const pillStyle = "relative rounded-md bg-white/5 p-3 pl-11 text-gray-300";
export const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400";
export const tagStyle = "flex w-fit items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400";
export const messageStyle = "my-auto py-8 text-center text-lg text-white";
export const removeStyle = "flex items-center gap-2 bg-red-500 text-sm font-bold rounded-md px-3 py-2 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50";
export const bookingButton = "flex w-full items-center justify-center rounded-md py-2 text-center text-sm font-bold transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";
export const bookingColumns = "grid-cols-[minmax(0,2fr)_minmax(5rem,1fr)_minmax(7rem,1fr)_minmax(8rem,1.5fr)_7rem]";
export const adminColumns = "grid-cols-[minmax(0,1.7fr)_4rem_6rem_minmax(0,1.3fr)_minmax(0,1fr)_6rem]";

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
  category: event.category ?? "",
  dateTime: event.dateTime.slice(0, 10),
  location: event.location,
  showTime: (event.showTime ?? event.dateTime).slice(11, 16),
  totalTickets: String(event.totalTickets),
  status: event.status,
  ticketTypes: ticketNames.map((name) => emptyTicket(name, findTicket(event.ticketTypes, name)))
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
    .map((name) => findTicket(ticketTypes, name))
    .filter(Boolean)
    .map(({ price }) => `₱${price}`)
    .join(" - ");

export const emptySelection = Object.fromEntries(ticketNames.map((name) => [name, { enabled: false, quantity: "1" }]));

export const findTicket = (ticketTypes = [], name) => ticketTypes.find((ticket) => ticket.name?.toUpperCase() === name);

export const toDate = (value, dateStyle = "full") => new Date(value).toLocaleDateString("en-US", { dateStyle });

export const paymentMethods = [
  { label: "GCASH", image: PaymentGCash, field: "Mobile No.:", placeholder: "Must be 11 digits", pattern: /^[0-9]{11}$/, maxLength: 11 },
  { label: "PAYPAL", image: PaymentPayPal, field: "Email:", placeholder: "Enter your PayPal email", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
];

export const toTime = (value) => value ? new Date(value).toLocaleTimeString("en-US", { timeStyle: "short" }) : "TBA";

const membershipUnits = [["year", 365], ["month", 30], ["week", 7]];

export const toMembership = (joinedAt) => {
  const days = (Date.now() - new Date(joinedAt)) / 86400000;
  const [unit, length] = membershipUnits.find(([, size]) => days >= size) ?? [];

  if (!unit) return "less than 1 week";

  const count = Math.floor(days / length);
  return `${count} ${unit}${count > 1 ? "s" : ""}`;
};

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
    ticketTypes: tickets.map(({ ticketId, ...ticket }) => ({ ...ticket, id: ticketId })),
    totalTickets: ticketCount(tickets)
  };
};