import { useState } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router";
import { IconArrowLeft, IconCalendarEvent, IconClock, IconCurrencyPeso, IconFileText, IconMapPin, IconTag, IconTicket } from "@tabler/icons-react";

import { useEvents } from "../context/EventContext";
import { useCart } from "../context/CartContext";

import { emptySelection, paymentMethods, eventTickets, selectedTickets, totalPrice, validSeats, segmentStyle, buttonStyle, pillStyle, iconStyle, tagStyle, toDate, toTime } from "../utils/events";

import Reveal from "../components/ui/Reveal";
import PictureSlider from "../components/events/PictureSlider";
import EventField from "../components/events/EventField";
import useLoadingText from "../components/ui/useLoadingText";
import ConfirmModal from "../components/ui/ConfirmModal";

import Placeholder from "../assets/images/EVENTRIX-Placeholder.jpeg";

const methodStyle = "flex flex-1 items-center justify-center bg-white rounded-md py-3 cursor-pointer transition-colors duration-200 hover:bg-gray-300";

export default function EventView() {
  const { slug } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getEvent } = useEvents();
  const { cartItems, addToCart, checkout } = useCart();
  const { loading, runner, texter } = useLoadingText();

  const event = getEvent(slug) ?? state?.event;
  const segments = state?.payment ? ["Payment"] : event?.status === "ACTIVE" ? ["Details", "Seats"] : ["Details"];
  const [slide, setSlide] = useState(0);
  const [segment, setSegment] = useState(segments[0]);
  const [selection, setSelection] = useState(emptySelection);
  const [method, setMethod] = useState(paymentMethods[0]);
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState(null);

  if (!event) return null;

  const payingItems = state?.cartItemIds ? cartItems.filter(({ id }) => state.cartItemIds.includes(id)) : cartItems;
  const tickets = eventTickets(event.ticketTypes, selection, payingItems);
  const chosen = selectedTickets(tickets);
  const cartTotal = totalPrice(tickets, "carted");

  const updateTicket = (name, change) => setSelection({ ...selection, [name]: { ...selection[name], ...change } });

  const ticketPills = (getText) => (
    <div className="flex gap-4">
      {tickets.map((ticket) => (
        <p key={ticket.name} className={`${pillStyle} flex-1`}>
          <IconTicket size={20} className={iconStyle} />
          {ticket.name}: {getText(ticket)}
        </p>
      ))}
    </div>
  );

  const handleAdd = () => runner(async () => {
    try {
      await addToCart(chosen.map(({ id, quantity }) => ({ ticketTypeId: id, quantity: Number(quantity) })));
      setMessage({ type: "success", message: "Added to cart!" });
    } catch {
      setMessage({ type: "error", message: "Failed to add to cart!" });
    }
  });

  const handlePay = () => runner(async () => {
    try {
      await checkout({ paymentMethod: method.label, referenceNumber: account, cartItemIds: state.cartItemIds });
      setMessage({ type: "success", message: "Payment successful!" });
    } catch {
      setMessage({ type: "error", message: "Payment failed!" });
    }
  });

  const handleClose = () => {
    setMessage(null);
    if (message.type === "success") navigate(state?.payment ? "/bookings" : "/events");
  };

  return (
    <div>
      <title>{event.title}</title>
      <div className="flex border-b-4 border-zinc-900">
        <h2 className="flex items-center gap-3 -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          <Link to="/events" className="flex items-center gap-3 transition duration-200 hover:brightness-50">
            <IconArrowLeft size={32} />
            <Reveal variant="type">Ongoing Events</Reveal>
          </Link>
          <span>/ <Reveal variant="type">{event.title}</Reveal></span>
        </h2>
      </div>
      <Reveal variant="lazy" className="flex flex-col lg:flex-row bg-zinc-800 min-h-180 overflow-hidden rounded-xl mt-8">
        <div className="relative min-h-112 overflow-hidden lg:w-1/2">
          <PictureSlider images={event.previewImages?.length ? event.previewImages.map(({ imageUrl }) => imageUrl) : [Placeholder]} index={slide} alt={event.title} onChange={setSlide} />
        </div>
        <Reveal variant="right" className="relative flex flex-1 flex-col p-8">
          <div className="flex gap-6 border-b-4 border-zinc-900">
            {segments.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setSegment(label)}
                disabled={loading}
                className={`${segmentStyle} ${label === segment ? "border-cyan-500 text-white" : "border-transparent text-gray-500"} enabled:cursor-pointer enabled:hover:brightness-50`}
              >
                {label}
              </button>
            ))}
          </div>
          <fieldset disabled={loading} className="mt-6 flex flex-1 min-w-0 flex-col">
            <div className="flex-1 space-y-4">
              {segment === "Details" && (
                <>
                  <h3 className="text-3xl font-bold">{event.title}</h3>
                  {event.category && <p className={tagStyle}><IconTag size={18} />{event.category}</p>}
                  <p className={pillStyle}>
                    <IconCalendarEvent size={20} className={iconStyle} />
                    {toDate(event.dateTime)}
                  </p>
                  <p className={pillStyle}>
                    <IconMapPin size={20} className={iconStyle} />
                    {event.location}
                  </p>
                  <div className="flex gap-4">
                    <p className={`${pillStyle} flex-1`}>
                      <IconClock size={20} className={iconStyle} />
                      Doors Open: {toTime(event.doorsOpen)}
                    </p>
                    <p className={`${pillStyle} flex-1`}>
                      <IconClock size={20} className={iconStyle} />
                      Show Time: {toTime(event.showTime)}
                    </p>
                  </div>
                  {event.status === "ACTIVE" ? ticketPills(({ availableQuantity }) => availableQuantity > 0 ? `${availableQuantity} left` : "Sold out") : (
                    <p className="rounded-md bg-red-500/20 p-3 text-center font-bold text-red-500">{event.status}</p>
                  )}
                  <EventField type="textarea" name="description" label="Description:" icon={IconFileText} value={event.description ?? ""} readOnly />
                </>
              )}
              {segment === "Seats" && (
                <>
                  {tickets.map(({ name, price, quantity, availableQuantity, enabled }) => (
                    <div key={name} className="space-y-3">
                      <div className="flex items-center gap-4">
                        <EventField type="toggle" label={name} enabled={enabled} onToggle={() => updateTicket(name, { enabled: !enabled })} />
                        <p className="text-xl font-semibold text-cyan-400">₱{price}</p>
                      </div>
                      <div className={`space-y-3 transition-opacity duration-200 ${enabled ? "" : "opacity-50"}`}>
                        <EventField type="number" name={`${name}Left`} label="Seats Left:" value={availableQuantity} readOnly />
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
                  <div className="border-t border-zinc-700" />
                  <EventField type="number" name="totalPrice" label="Total Price:" icon={IconCurrencyPeso} value={totalPrice(chosen, "quantity")} readOnly />
                </>
              )}
              {segment === "Payment" && (
                <>
                  <div className="flex gap-4">
                    {paymentMethods.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setMethod(item);
                          setAccount("");
                        }}
                        className={`${methodStyle} ${method === item ? "ring-4 ring-cyan-500" : ""}`}
                      >
                        <img src={item.image} alt={item.label} className="h-8" />
                      </button>
                    ))}
                  </div>
                  <EventField
                    name="account"
                    label={method.field}
                    placeholder={method.placeholder}
                    maxLength={method.maxLength}
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  />
                  <div className="border-t border-zinc-700" />
                  {ticketPills(({ carted }) => carted)}
                  <EventField type="number" name="totalPrice" label="Total Price:" icon={IconCurrencyPeso} value={cartTotal} readOnly />
                </>
              )}
            </div>
            <div className="flex gap-6 pt-4">
              {segment === "Details" && event.status === "ACTIVE" && (
                <button type="button" onClick={() => setSegment("Seats")} className={`${buttonStyle} bg-cyan-500`}>
                  NEXT
                </button>
              )}
              {segment === "Seats" && (
                <>
                  <button type="button" onClick={() => setSegment("Details")} className={`${buttonStyle} bg-gray-300 text-black`}>
                    BACK
                  </button>
                  <button type="button" onClick={handleAdd} disabled={!validSeats(chosen)} className={`${buttonStyle} bg-green-500`}>
                    {texter("ADD TO CART", "ADDING")}
                  </button>
                </>
              )}
              {segment === "Payment" && (
                <button type="button" onClick={handlePay} disabled={cartTotal === 0 || !method.pattern.test(account)} className={`${buttonStyle} bg-green-500`}>
                  {texter("PAY", "PAYING")}
                </button>
              )}
            </div>
          </fieldset>
        </Reveal>
      </Reveal>
      {message && <ConfirmModal type={message.type} message={message.message} onClose={handleClose} />}
    </div>
  );
}