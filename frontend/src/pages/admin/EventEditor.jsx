import { useState, useEffect } from "react";
import { useBlocker, useNavigate, useParams } from "react-router";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { IconArrowLeft, IconPhoto, IconCategory, IconCalendar, IconClock, IconMapPin, IconFileText, IconTicket, IconCrown, IconCheck, IconCurrencyPeso, IconPlus, IconArchive } from "@tabler/icons-react";

import { useEvents } from "../../context/EventContext";

import { imageTypes, steps, emptyEventValues, eventFormValues, filled, doorsLate, selectedTickets as getSelectedTickets, ticketCount as getTicketCount, validTickets, eventPayload } from "../../utils/events";

import Reveal from "../../components/ui/Reveal";
import useLoadingText from "../../components/ui/useLoadingText";
import ConfirmModal from "../../components/ui/ConfirmModal";

const inputStyle = "flex-1 bg-white/15 rounded-md p-2 focus:outline-2 focus:outline-cyan-500";
const buttonStyle = "flex-1 font-bold rounded-md py-3 text-center transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";
const ticketButtonStyle = "relative w-44 flex items-center gap-2 rounded-md px-3 py-3 text-base font-bold cursor-pointer transition duration-200 enabled:hover:brightness-50";
const ticketButtonColors = { STANDARD: "bg-cyan-500 text-white", VIP: "bg-blue-950 text-yellow-400" };

export default function EventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { categories, getEvent, createEvent, updateEvent } = useEvents();
  const { loading, runner, texter } = useLoadingText();
  const event = getEvent(id);

  const { register, handleSubmit, control, reset, setValue, formState: { isDirty } } = useForm({
    defaultValues: emptyEventValues()
  });
  const { fields } = useFieldArray({ control, name: "ticketTypes" });
  const values = useWatch({ control });

  const [step, setStep] = useState(0);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState(null);
  const photo = image || event?.thumbnailUrl;

  const tickets = getSelectedTickets(values.ticketTypes);
  const totalTickets = getTicketCount(tickets);
  const ready = [
    filled(values.title),
    filled(values.location) && filled(values.dateTime) && !doorsLate(values),
    validTickets(tickets)
  ];

  const unsaved = (isDirty || image !== "") && message?.type !== "success";
  const blocker = useBlocker(unsaved);

  useEffect(() => {
    if (!unsaved) return;

    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsaved]);

  useEffect(() => {
    setStep(0);
    setImage("");
    setMessage(null);

    if (!id) reset(emptyEventValues());
  }, [id, reset]);

  useEffect(() => {
    if (id && event) reset(eventFormValues(event));
  }, [id, event, reset]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!imageTypes.includes(file.type)) {
      setMessage({ type: "error", message: "Only PNG, JPG, and WEBP images are allowed!" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmission = (data) => runner(async () => {
    try {
      await (id ? updateEvent(id, eventPayload(data, photo)) : createEvent(eventPayload(data, photo)));
      setMessage({ type: "success", message: id ? "Event updated!" : "Event added!" });
    } catch (error) {
      setMessage({ type: "error", message: typeof error.response?.data === "string" ? error.response.data : "Failed to save event!" });
    }
  });
  const handleClose = () => {
    setMessage(null);
    if (message.type === "success") navigate("/events");
  };

  return (
    <div>
      <div className="flex border-b-4 border-zinc-900">
        <h2 className="flex items-center gap-3 -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          {id ? (
            <>
              <button onClick={() => navigate("/events")} disabled={loading} className="flex items-center gap-3 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50">
                <IconArrowLeft size={32} />
                <Reveal variant="type">Edit Event</Reveal>
              </button>
              {event && <span>/ <Reveal variant="type">{event.title}</Reveal></span>}
            </>
          ) : <Reveal variant="type">Add Event</Reveal>}
        </h2>
      </div>
      <Reveal variant="lazy" ready={!id || Boolean(event)} className="flex flex-col lg:flex-row bg-zinc-900 overflow-hidden rounded-xl mt-8">
        <div className="relative flex flex-col items-center justify-center bg-gray-100 text-gray-400 min-h-180 overflow-hidden lg:w-1/2">
          {photo ? (
            <img src={photo} alt="Event" className="absolute inset-0 size-full object-cover" />
          ) : (
            <div className="flex flex-col items-center">
              <IconPhoto size={112} />
              <p className="mt-6 font-bold">Nothing to see here yet!</p>
              <p className="text-sm">Start by uploading your first image</p>
            </div>
          )}
        </div>
        <Reveal variant="right" className="relative flex flex-1 flex-col px-8 pt-8 pb-8">
          <div className="flex gap-6 border-b border-zinc-700 pb-3">
            {steps.map((label, i) => (
              <p key={label} className={`text-sm transition-colors duration-300 ${i === step ? "font-bold text-cyan-400" : "text-gray-500"}`}>
                {i + 1}. {label}
              </p>
            ))}
          </div>
          <form noValidate onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-1 flex-col">
            <fieldset disabled={loading} className="flex flex-1 min-w-0 flex-col">
              <div className="flex-1 space-y-4">
                {step === 0 && (
                  <>
                    <div className="flex items-center gap-4">
                      <label htmlFor="title" className="w-28 text-sm">Event Title:</label>
                      <div className="relative flex-1">
                        <IconFileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                        <input id="title" type="text" className={`${inputStyle} w-full pl-10`} {...register("title")} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="category" className="w-28 text-sm">Category:</label>
                      <div className="relative flex-1">
                        <IconCategory size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                        <select key={categories.length} id="category" className={`${inputStyle} w-full pl-10 enabled:cursor-pointer`} {...register("category")}>
                          <option value="" className="bg-zinc-900">No category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id} className="bg-zinc-900">{category.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {id && (
                      <div className="flex items-center gap-4">
                        <label htmlFor="status" className="w-28 text-sm">Status:</label>
                        <div className="relative flex-1">
                          <IconArchive size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                          <select id="status" className={`${inputStyle} w-full pl-10 enabled:cursor-pointer`} {...register("status")}>
                            <option value="ACTIVE" className="bg-zinc-900">ACTIVE</option>
                            <option value="ARCHIVED" className="bg-zinc-900">ARCHIVED</option>
                          </select>
                        </div>
                      </div>
                    )}
                    <div>
                      <label htmlFor="description" className="text-sm">Description:</label>
                      <div className="relative mt-1">
                        <IconFileText size={18} className="absolute left-3 top-3 text-cyan-400" />
                        <textarea id="description" rows={5} className={`${inputStyle} w-full pl-10`} {...register("description")} />
                      </div>
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <div className="flex items-center gap-4">
                      <p className="w-28 text-sm">Event Picture:</p>
                      <label className={`${buttonStyle} flex cursor-pointer items-center justify-center gap-2 bg-gray-300 text-black hover:brightness-50`}>
                        <IconPhoto size={20} />
                        UPLOAD PHOTO
                        <input type="file" accept={imageTypes.join()} onChange={handleImage} className="hidden" />
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="location" className="w-28 text-sm">Location:</label>
                      <div className="relative flex-1">
                        <IconMapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                        <input id="location" type="text" className={`${inputStyle} w-full pl-10`} {...register("location")} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="dateTime" className="w-28 text-sm">Date:</label>
                      <div className="relative flex-1">
                        <IconCalendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                        <input id="dateTime" type="datetime-local" className={`${inputStyle} w-full pl-10`} {...register("dateTime")} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-4">
                        <label htmlFor="doorsOpen" className="w-28 text-sm">Doors Open:</label>
                        <div className="relative flex-1">
                          <IconClock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                          <input id="doorsOpen" type="time" className={`${inputStyle} w-full pl-10`} {...register("doorsOpen")} />
                        </div>
                      </div>
                      {doorsLate(values) && <p className="text-red-500 text-sm mt-1 pl-32">Doors must open before the event starts!</p>}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        const enabled = values.ticketTypes[index].enabled;
                        return (
                          <div key={field.id} className="space-y-3">
                            <button
                              type="button"
                              onClick={() => setValue(`ticketTypes.${index}.enabled`, !enabled, { shouldDirty: true })}
                              className={`${ticketButtonStyle} ${enabled ? ticketButtonColors[field.name] : "bg-zinc-700 text-gray-400"}`}
                            >
                              {field.name === "VIP" ? <IconCrown size={22} /> : <IconTicket size={22} />}
                              {field.name}
                              {enabled ? <IconCheck size={20} className="absolute right-3" /> : <IconPlus size={20} className="absolute right-3" />}
                            </button>
                            <div className={`space-y-3 transition-opacity duration-200 ${enabled ? "" : "opacity-50"}`}>
                              <div className="flex items-center gap-4">
                                <label htmlFor={`ticketTypes.${index}.price`} className="w-28 text-sm">Price:</label>
                                <div className="relative flex-1">
                                  <IconCurrencyPeso size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                                  <input id={`ticketTypes.${index}.price`} type="number" min="200" step="1" disabled={!enabled} className={`${inputStyle} w-full pl-10 disabled:cursor-not-allowed`} {...register(`ticketTypes.${index}.price`)} />
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <label htmlFor={`ticketTypes.${index}.availableQuantity`} className="w-28 text-sm">Ticket Quantity:</label>
                                <input id={`ticketTypes.${index}.availableQuantity`} type="number" min="1" step="1" disabled={!enabled} className={`${inputStyle} disabled:cursor-not-allowed`} {...register(`ticketTypes.${index}.availableQuantity`)} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-zinc-700" />
                    <div className="flex items-center gap-4">
                      <label htmlFor="totalTickets" className="w-28 text-sm">No. Tickets:</label>
                      <div className="relative flex-1">
                        <IconTicket size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                        <input id="totalTickets" type="number" className={`${inputStyle} w-full pl-10`} value={totalTickets} readOnly />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-6 pt-4">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)} className={`${buttonStyle} bg-gray-300 text-black`}>
                    BACK
                  </button>
                )}
                <button type="button" onClick={step < 2 ? () => setStep(step + 1) : handleSubmit(onSubmission)} disabled={!ready[step]} className={`${buttonStyle} ${step < 2 ? "bg-cyan-500" : "bg-green-500"}`}>
                  {step < 2 ? "NEXT" : texter(id ? "SAVE CHANGES" : "ADD EVENT", id ? "SAVING..." : "ADDING...")}
                </button>
              </div>
            </fieldset>
          </form>
        </Reveal>
      </Reveal>
      {message && <ConfirmModal type={message.type} message={message.message} onClose={handleClose} />}
      {blocker.state === "blocked" && <ConfirmModal message="Discard changes?" description="Your unsaved changes will be lost." confirmText="DISCARD" onConfirm={blocker.proceed} onClose={blocker.reset} />}
    </div>
  )
}