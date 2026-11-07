import { useState, useEffect } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router";
import { IconArrowLeft, IconCalendarEvent, IconClock, IconCurrencyPeso, IconFileText, IconMapPin, IconTag } from "@tabler/icons-react";

import { useEvents } from "../context/EventContext";
import { useCart } from "../context/CartContext";

import { backLabels } from "../data/navbox";
import { defaultTicketQuantity } from "../data/details";
import { paymentMethods } from "../data/payment";
import { emptySelection, eventTickets, selectedTickets, totalPrice, validSeats, isSoldOut } from "../utils/tickets";
import { toDate, toTime } from "../utils/dates";
import { segmentStyle, buttonStyle, tagStyle } from "../utils/styles";

import Reveal from "../components/ui/Reveal";
import useLoadingText from "../components/ui/useLoadingText";
import ConfirmModal from "../components/ui/ConfirmModal";
import PictureSlider from "../components/events/PictureSlider";
import EventField from "../components/events/EventField";

import Placeholder from "../assets/images/EVENTRIX-Placeholder.jpeg";

const methodStyle = "flex flex-1 items-center justify-center bg-white rounded-md py-3 cursor-pointer transition-colors duration-200 hover:bg-gray-300";

export default function EventView() {
  const { slug } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getEvent, getEventById } = useEvents();
  const { cartItems, addToCart, checkout } = useCart();
  const { loading, runner, texter } = useLoadingText();

  const [fetched, setFetched] = useState(null);

  useEffect(() => {
    if (!state?.eventId) return;

    let active = true;

    getEventById(state.eventId)
      .then((data) => {
        if (active) setFetched(data);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [state?.eventId, getEventById]);

  const event = fetched ?? getEvent(slug) ?? state?.event;
  const segments = state?.payment ? ["Payment"] : event?.status === "ACTIVE" && !state?.from && !isSoldOut(event) ? ["Details", "Seats"] : ["Details"];

  const [slide, setSlide] = useState(0);
  const [segment, setSegment] = useState(segments[0]);
  const [selection, setSelection] = useState(emptySelection);
  const [method, setMethod] = useState(paymentMethods[0]);
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [paying, setPaying] = useState(false);

  if (!event) return null;

  const payingItems = state?.cartItemIds ? cartItems.filter(({ id }) => state.cartItemIds.includes(id)) : cartItems;
  const tickets = eventTickets(event.ticketTypes, selection, payingItems);
  const chosen = selectedTickets(tickets);
  const cartTotal = totalPrice(tickets, "carted");

  const updateTicket = (name, change) => setSelection({ ...selection, [name]: { ...selection[name], ...change } });

  const ticketFields = (getText) => tickets.map((ticket) => (
    <EventField key={ticket.name} type="ticket" name={`${ticket.name}Info`} label={ticket.name} value={getText(ticket)} />
  ));

  const handleAdd = () => runner(async () => {
    try {
      await addToCart(chosen.map(({ id, quantity }) => ({ ticketTypeId: id, quantity: Number(quantity) })));
      setMessage({ type: "success", message: "Added to cart!" });
    } catch {
      setMessage({ type: "error", message: "Failed to add to cart!" });
    } finally {
      setConfirming(false);
    }
  });

  const handlePay = () => runner(async () => {
    try {
      await checkout({ paymentMethod: method.label, referenceNumber: account, cartItemIds: state.cartItemIds });
      setMessage({ type: "success", message: "Payment successful!" });
    } catch (error) {
      setMessage({ type: "error", message: typeof error.response?.data === "string" ? error.response.data : "Payment failed!" });
    } finally {
      setPaying(false);
    }
  });

  const handleClose = () => {
    setMessage(null);
    if (message?.type === "success") navigate(state?.payment ? "/bookings" : "/events");
  };

  return (
    <div>
      <title>{event.title}</title>
      <div className="flex border-b-4 border-zinc-900">
        <h2 className="flex items-center gap-3 -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          <Link to={state?.from ?? "/events"} className="flex items-center gap-3 transition duration-200 hover:brightness-50">
            <IconArrowLeft size={32} />
            <Reveal variant="type">{backLabels[state?.from] ?? "Events"}</Reveal>
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
                <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-bold">{event.title}</h3>
                  {event.category && <p className={tagStyle}><IconTag size={18} />{event.category}</p>}
                  <EventField type="textarea" name="description" label="Description:" icon={IconFileText} value={event.description ?? ""} readOnly />
                  <p className="-mb-3 text-sm">Additional Details:</p>
                  <EventField name="eventDate" icon={IconCalendarEvent} value={toDate(event.dateTime)} readOnly />
                  <EventField name="eventLocation" icon={IconMapPin} value={event.location} readOnly />
                  <div className="grid grid-cols-2 gap-4">
                    <EventField name="doorsOpen" icon={IconClock} value={`Doors Open: ${toTime(event.doorsOpen)}`} readOnly />
                    <EventField name="showTime" icon={IconClock} value={`Show Time: ${toTime(event.showTime)}`} readOnly />
                  </div>
                </div>
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
                          placeholder={`Must be at least ${defaultTicketQuantity}`}
                          min={defaultTicketQuantity}
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
                  {ticketFields(({ carted }) => carted)}
                  <EventField type="number" name="totalPrice" label="Total Price:" icon={IconCurrencyPeso} value={cartTotal} readOnly />
                </>
              )}
            </div>
            <div className="flex gap-6 pt-4">
              {segment === "Details" && segments.length > 1 && (
                <button type="button" onClick={() => setSegment("Seats")} className={`${buttonStyle} bg-cyan-500`}>
                  NEXT
                </button>
              )}
              {segment === "Seats" && (
                <>
                  <button type="button" onClick={() => setSegment("Details")} className={`${buttonStyle} bg-gray-300 text-black`}>
                    BACK
                  </button>
                  <button type="button" onClick={() => setConfirming(true)} disabled={!validSeats(chosen)} className={`${buttonStyle} bg-green-500`}>
                    ADD TO CART
                  </button>
                </>
              )}
              {segment === "Payment" && (
                <button type="button" onClick={() => setPaying(true)} disabled={cartTotal === 0 || !method.pattern.test(account)} className={`${buttonStyle} bg-green-500`}>
                  PAY
                </button>
              )}
            </div>
          </fieldset>
        </Reveal>
      </Reveal>
      {confirming && (
        <ConfirmModal
          message="Add to cart?"
          description="The selected tickets will be added to your cart."
          confirmText={texter("ADD", "ADDING")}
          loading={loading}
          onConfirm={handleAdd}
          onClose={() => setConfirming(false)}
        />
      )}
      {paying && (
        <ConfirmModal
          message="Proceed to payment?"
          description="This will pay for the selected tickets and book them."
          confirmText={texter("PAY", "PAYING")}
          loading={loading}
          onConfirm={handlePay}
          onClose={() => setPaying(false)}
        />
      )}
      {message && <ConfirmModal type={message.type} message={message.message} onClose={handleClose} />}
    </div>
  );
}