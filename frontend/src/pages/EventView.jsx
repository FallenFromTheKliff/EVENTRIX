import { useState } from "react";

import { Link, useParams } from "react-router";
import { IconArrowLeft, IconBrandPaypal, IconCurrencyPeso, IconFileText, IconMapPin, IconTag, IconTicket, IconWallet } from "@tabler/icons-react";

import { useEvents } from "../context/EventContext";
import { useCart } from "../context/CartContext";

import { ticketNames } from "../utils/events";

import Reveal from "../components/ui/Reveal";
import PictureSlider from "../components/events/PictureSlider";
import EventField from "../components/events/EventField";
import useLoadingText from "../components/ui/useLoadingText";
import ConfirmModal from "../components/ui/ConfirmModal";

import Placeholder from "../assets/images/EVENTRIX-Placeholder.jpeg";

const segments = ["Details", "Seats", "Payment"];
const segmentStyle = "-mb-1 border-b-4 pb-3 text-sm transition duration-300";
const pillStyle = "relative rounded-md bg-white/5 p-3 pl-11 text-gray-300";
const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400";
const methodStyle = "flex flex-1 items-center justify-center gap-2 rounded-md py-3 font-bold cursor-pointer transition duration-200 hover:brightness-50";
const payStyle = "mt-4 bg-green-500 w-full font-bold rounded-md py-3 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";

const emptySelection = { STANDARD: { enabled: false, quantity: "1" }, VIP: { enabled: false, quantity: "1" } };
const methods = [
  { label: "GCASH", icon: IconWallet, color: "bg-blue-600", field: "Mobile No.:", placeholder: "Must be 11 digits", pattern: /^[0-9]{11}$/ },
  { label: "PAYPAL", icon: IconBrandPaypal, color: "bg-blue-900", field: "Email:", placeholder: "Enter your PayPal email", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
];

export default function EventView() {
  const { id } = useParams();
  const { getEvent } = useEvents();
  const { addToCart } = useCart();
  const { loading, runner, texter } = useLoadingText();

  const [slide, setSlide] = useState(0);
  const [segment, setSegment] = useState(0);
  const [selection, setSelection] = useState(emptySelection);
  const [method, setMethod] = useState(methods[0]);
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState(null);

  const event = getEvent(id);
  if (!event) return null;
  const images = event.previewImages?.length ? event.previewImages.map(({ imageUrl }) => imageUrl) : [Placeholder];

  const tickets = ticketNames
    .map((name) => ({ ...event.ticketTypes.find((ticket) => ticket.name?.toUpperCase() === name), ...selection[name], name }))
    .filter((ticket) => ticket.id);
  const chosen = tickets.filter(({ enabled }) => enabled);
  const total = chosen.reduce((sum, { price, quantity }) => sum + price * Number(quantity), 0);
  const valid = chosen.length > 0 && chosen.every(({ quantity, availableQuantity }) => Number.isInteger(Number(quantity)) && Number(quantity) >= 1 && Number(quantity) <= availableQuantity);

  const updateTicket = (name, change) => setSelection({ ...selection, [name]: { ...selection[name], ...change } });
  const handlePay = () => runner(() => setMessage({ type: "success", message: "Payment successful!" }));
  const handleClose = async () => {
    const { type } = message;
    setMessage(null);
    if (type !== "success") return;
    try {
      for (const ticket of chosen) await addToCart(ticket.id, Number(ticket.quantity));
      setSelection(emptySelection);
      setAccount("");
      setSegment(0);
    } catch {
      setMessage({ type: "error", message: "Failed to add to cart!" });
    }
  };

  return (
    <div>
      <div className="flex border-b-4 border-zinc-900">
        <h2 className="flex items-center gap-3 -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          <Link to="/events" className="flex items-center gap-3 transition duration-200 hover:brightness-50">
            <IconArrowLeft size={32} />
            <Reveal variant="type">View Event</Reveal>
          </Link>
          <span>/ <Reveal variant="type">{event.title}</Reveal></span>
        </h2>
      </div>
      <Reveal variant="lazy" className="flex flex-col lg:flex-row bg-zinc-800 min-h-180 overflow-hidden rounded-xl mt-8">
        <div className="relative min-h-112 overflow-hidden lg:w-1/2">
          <PictureSlider images={images} index={slide} alt={event.title} onChange={setSlide} />
        </div>
        <Reveal variant="right" className="relative flex flex-1 flex-col p-8">
          <div className="flex gap-6 border-b-4 border-zinc-900">
            {segments.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setSegment(i)}
                disabled={loading}
                className={`${segmentStyle} ${i === segment ? "border-cyan-500 font-bold text-white" : "border-transparent text-gray-500"} enabled:cursor-pointer enabled:hover:brightness-50`}
              >
                {label}
              </button>
            ))}
          </div>
          <fieldset disabled={loading} className="mt-6 flex flex-1 min-w-0 flex-col">
            <div className="flex-1 space-y-4">
              {segment === 0 && (
                <>
                  <h3 className="text-3xl font-bold">{event.title}</h3>
                  {event.category && <p className="flex w-fit items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400"><IconTag size={18} />{event.category.name}</p>}
                  <p className={pillStyle}>
                    <IconMapPin size={20} className={iconStyle} />
                    {event.location}
                  </p>
                  <p className={`${pillStyle} whitespace-pre-line`}>
                    <IconFileText size={20} className="absolute left-3 top-3 text-cyan-400" />
                    {event.description}
                  </p>
                  <div className={pillStyle}>
                    <IconTicket size={20} className={iconStyle} />
                    <div className="flex flex-wrap gap-x-6">
                      {tickets.map(({ name, availableQuantity }) => (
                        <p key={name}>{name}: {availableQuantity > 0 ? `${availableQuantity} left` : "Sold out"}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {segment === 1 && tickets.map(({ name, price, quantity, availableQuantity, enabled }) => (
                <div key={name} className="space-y-3">
                  <div className="flex items-center gap-4">
                    <EventField type="toggle" label={name} enabled={enabled} onToggle={() => updateTicket(name, { enabled: !enabled })} />
                    <p className="text-xl font-semibold text-cyan-400">₱{price}</p>
                  </div>
                  <div className={`transition-opacity duration-200 ${enabled ? "" : "opacity-50"}`}>
                    <EventField
                      type="number"
                      name={`${name}Quantity`}
                      label="Quantity:"
                      placeholder="Must be at least 1"
                      min="1"
                      max={availableQuantity}
                      step="1"
                      disabled={!enabled}
                      value={quantity}
                      onChange={(e) => updateTicket(name, { quantity: e.target.value })}
                    />
                  </div>
                </div>
              ))}
              {segment === 2 && (
                <>
                  <div className="flex gap-4">
                    {methods.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setMethod(item);
                          setAccount("");
                        }}
                        className={`${methodStyle} ${method === item ? `${item.color} text-white` : "bg-zinc-700 text-gray-400"}`}
                      >
                        <item.icon size={22} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <EventField
                    name="account"
                    label={method.field}
                    placeholder={method.placeholder}
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  />
                </>
              )}
              {segment > 0 && (
                <>
                  <div className="border-t border-zinc-700" />
                  <EventField type="number" name="totalPrice" label="Total Price:" icon={IconCurrencyPeso} value={total} readOnly />
                </>
              )}
            </div>
            {segment === 2 && (
              <button
                type="button"
                onClick={handlePay}
                disabled={!valid || !method.pattern.test(account)}
                className={payStyle}
              >
                {texter("PAY", "PAYING")}
              </button>
            )}
          </fieldset>
        </Reveal>
      </Reveal>
      {message && <ConfirmModal type={message.type} message={message.message} onClose={handleClose} />}
    </div>
  )
}