import { useState, useEffect } from "react";
import { useBlocker, useNavigate, useParams } from "react-router";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { IconArrowLeft, IconPhoto, IconTrash } from "@tabler/icons-react";

import { useEvents } from "../../context/EventContext";

import Reveal from "../../components/ui/Reveal";
import useLoadingText from "../../components/ui/useLoadingText";
import ConfirmModal from "../../components/ui/ConfirmModal";

const inputStyle = "flex-1 bg-white/15 rounded-md p-2 focus:outline-2 focus:outline-cyan-500";
const buttonStyle = "flex-1 font-bold rounded-md py-3 text-center transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";
const imageTypes = ["image/png", "image/jpeg", "image/webp"];
const steps = ["Introduction", "Venue", "Tickets"];
const emptyTicket = { name: "", price: "", availableQuantity: "", description: "" };

const filled = (value) => String(value ?? "").trim() !== "";
const doorsLate = ({ doorsOpen, dateTime }) => Boolean(dateTime && doorsOpen > dateTime.slice(11, 16));

export default function EventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { categories, getEvent, createEvent, updateEvent } = useEvents();
  const { loading, runner, texter } = useLoadingText();
  const event = getEvent(id);

  const { register, handleSubmit, control, formState: { isDirty } } = useForm({
    defaultValues: { title: "", description: "", category: "", dateTime: "", location: "", doorsOpen: "", totalTickets: "", ticketTypes: [emptyTicket] },
    values: event && {
      title: event.title,
      description: event.description ?? "",
      category: String(event.category?.id ?? ""),
      dateTime: event.dateTime.slice(0, 16),
      location: event.location,
      doorsOpen: event.doorsOpen?.slice(11, 16) ?? "",
      totalTickets: String(event.totalTickets),
      status: event.status,
      ticketTypes: event.ticketTypes.map(({ id: ticketId, price, availableQuantity, ...ticket }) => ({ ...ticket, price: String(price), availableQuantity: String(availableQuantity), ticketId }))
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "ticketTypes" });
  const values = useWatch({ control });
  
  const [step, setStep] = useState(0);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState(null);
  const photo = image || event?.thumbnailUrl;
  const ready = [
    filled(values.title),
    filled(values.location) && filled(values.dateTime) && !doorsLate(values),
    filled(values.totalTickets) && values.ticketTypes?.length > 0 && values.ticketTypes.every(({ name, price, availableQuantity }) => filled(name) && filled(price) && filled(availableQuantity))
  ];

  const unsaved = (isDirty || image !== "") && message?.type !== "success";
  const blocker = useBlocker(unsaved);

  useEffect(() => {
    if (!unsaved) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsaved]);

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
      const body = {
        ...data,
        imageUrl: photo,
        price: Math.min(...data.ticketTypes.map(({ price }) => Number(price))),
        category: data.category ? { id: Number(data.category) } : null,
        doorsOpen: data.doorsOpen && `${data.dateTime.slice(0, 10)}T${data.doorsOpen}`,
        ticketTypes: data.ticketTypes.map(({ ticketId, ...ticket }) => ({ ...ticket, id: ticketId }))
      };
      await (id ? updateEvent(id, body) : createEvent(body));
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
            <Reveal variant="right" className="flex flex-col items-center">
              <IconPhoto size={112} />
              <p className="mt-6 font-bold">Nothing to see here yet!</p>
              <p className="text-sm">Start by uploading your first image</p>
            </Reveal>
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
                      <input id="title" type="text" className={inputStyle} {...register("title")} />
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="category" className="w-28 text-sm">Category:</label>
                      <select key={categories.length} id="category" className={`${inputStyle} enabled:cursor-pointer`} {...register("category")}>
                        <option value="" className="bg-zinc-900">No category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id} className="bg-zinc-900">{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="description" className="text-sm">Description:</label>
                      <textarea id="description" rows={5} className={`${inputStyle} w-full mt-1`} {...register("description")} />
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <div className="flex items-center gap-4">
                      <p className="w-28 text-sm">Event Picture:</p>
                      <label className={`${buttonStyle} bg-gray-300 text-black cursor-pointer hover:brightness-50`}>
                        UPLOAD PHOTO
                        <input type="file" accept={imageTypes.join()} onChange={handleImage} className="hidden" />
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="location" className="w-28 text-sm">Location:</label>
                      <input id="location" type="text" className={inputStyle} {...register("location")} />
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="dateTime" className="w-28 text-sm">Date:</label>
                      <input id="dateTime" type="datetime-local" className={inputStyle} {...register("dateTime")} />
                    </div>
                    <div>
                      <div className="flex items-center gap-4">
                        <label htmlFor="doorsOpen" className="w-28 text-sm">Doors Open:</label>
                        <input id="doorsOpen" type="time" className={inputStyle} {...register("doorsOpen")} />
                      </div>
                      {doorsLate(values) && <p className="text-red-500 text-sm mt-1 pl-32">Doors must open before the event starts!</p>}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="space-y-3">
                      <p className="text-sm">Ticket Types:</p>
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <input placeholder="Name" type="text" className={inputStyle} {...register(`ticketTypes.${index}.name`)} />
                          <input placeholder="Price" type="number" min="0" step="0.01" className={inputStyle} {...register(`ticketTypes.${index}.price`)} />
                          <input placeholder="Quantity" type="number" min="1" step="1" className={inputStyle} {...register(`ticketTypes.${index}.availableQuantity`)} />
                          <button type="button" onClick={() => remove(index)} className="text-red-500 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50">
                            <IconTrash size={24} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => append(emptyTicket)} className={`${buttonStyle} w-full bg-cyan-500`}>
                        ADD TICKET TYPE
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="totalTickets" className="w-28 text-sm">No. Tickets:</label>
                      <input id="totalTickets" type="number" min="1" step="1" className={inputStyle} {...register("totalTickets")} />
                    </div>
                    {id && (
                      <div className="flex items-center gap-4">
                        <label htmlFor="status" className="w-28 text-sm">Status:</label>
                        <select id="status" className={`${inputStyle} enabled:cursor-pointer`} {...register("status")}>
                          <option value="ACTIVE" className="bg-zinc-900">Active</option>
                          <option value="ARCHIVED" className="bg-zinc-900">Archived</option>
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-6 pt-4">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)} className={`${buttonStyle} bg-gray-300 text-black`}>
                    BACK
                  </button>
                )}
                <button
                  type="button"
                  onClick={step < 2 ? () => setStep(step + 1) : handleSubmit(onSubmission)}
                  disabled={!ready[step]}
                  className={`${buttonStyle} ${step < 2 ? "bg-cyan-500" : "bg-green-500"}`}
                >
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