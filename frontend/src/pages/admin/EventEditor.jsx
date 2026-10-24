import { useState, useEffect } from "react";
import { useBlocker, useNavigate, useParams } from "react-router";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { IconArrowLeft, IconPhoto, IconTrash, IconCategory, IconCalendar, IconClock, IconMapPin, IconFileText, IconTicket, IconCurrencyPeso, IconArchive } from "@tabler/icons-react";

import { useEvents } from "../../context/EventContext";

import { buttonStyle, segmentStyle, steps, emptyEventValues, eventFormValues, filled, selectedTickets as getSelectedTickets, ticketCount as getTicketCount, validTickets, eventPayload, dateInPast, dateTaken, doorsOpenAt, nowLocal } from "../../utils/events";
import { statuses } from "../../utils/filters";

import Reveal from "../../components/ui/Reveal";
import PictureSlider from "../../components/events/PictureSlider";
import EventField from "../../components/events/EventField";
import useDebouncing from "../../utils/useDebouncing";
import useLoadingText from "../../components/ui/useLoadingText";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function EventEditor() {
  const { slug: id } = useParams();
  const navigate = useNavigate();

  const { categories, getEvent, createEvent, updateEvent, getVenueDates } = useEvents();
  const { loading, runner, texter } = useLoadingText();
  const event = getEvent(id);
  const eventId = event?.eventId;

  const { register, handleSubmit, control, reset, setValue, formState: { isDirty } } = useForm({
    defaultValues: emptyEventValues()
  });
  const { fields } = useFieldArray({ control, name: "ticketTypes" });
  const values = useWatch({ control });

  const [step, setStep] = useState(0);
  const [image, setImage] = useState("");
  const [pictures, setPictures] = useState([]);
  const [slide, setSlide] = useState(0);
  const [message, setMessage] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [takenDates, setTakenDates] = useState([]);
  const photo = image || event?.thumbnailUrl;
  const venue = useDebouncing((values.location ?? "").trim());

  const tickets = getSelectedTickets(values.ticketTypes);
  const totalTickets = getTicketCount(tickets);
  const past = !id && dateInPast(values);
  const taken = dateTaken(values.dateTime, venue ? takenDates : []);
  const ready = [
    filled(values.title),
    filled(values.location) && filled(values.dateTime) && filled(values.showTime) && !past && !taken,
    validTickets(tickets)
  ];

  const unsaved = (isDirty || image !== "" || pictures.some(({ id }) => !id) || pictures.length !== (event?.previewImages?.length ?? 0)) && message?.type !== "success";
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
    setPictures([]);
    setSlide(0);

    if (!id) reset(emptyEventValues());
  }, [id, reset]);

  useEffect(() => {
    if (id && event) {
      reset(eventFormValues(event));
      setPictures(event.previewImages ?? []);
      setSlide(0);
    }
  }, [id, event, reset]);

  useEffect(() => {
    if (venue) getVenueDates(venue, eventId).then(setTakenDates).catch(() => setTakenDates([]));
  }, [venue, eventId]);

  const handleError = (text) => setMessage({ type: "error", message: text });
  const handlePictures = (added) => {
    setPictures([...pictures, ...added.map((imageUrl) => ({ imageUrl }))]);
    setSlide(pictures.length);
  };
  const handleRemovePicture = () => {
    setPictures(pictures.filter((_, i) => i !== slide));
    setSlide(Math.max(0, slide - 1));
  };

  const onSubmission = (data) => runner(async () => {
    try {
      await (id ? updateEvent(eventId, eventPayload(data, photo, pictures)) : createEvent(eventPayload(data, photo, pictures)));
      setMessage({ type: "success", message: id ? "Event updated!" : "Event added!" });
    } catch (error) {
      setMessage({ type: "error", message: typeof error.response?.data === "string" ? error.response.data : "Failed to save event!" });
    } finally {
      setConfirming(false);
    }
  });
  const handleClose = () => {
    setMessage(null);
    if (message.type === "success") navigate("/events");
  };

  return (
    <div>
      <title>{id ? event?.title : "Add an Event"}</title>
      <div className="flex border-b-4 border-zinc-900">
        <h2 className="flex items-center gap-3 -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          {id ? (
            <>
              <button
                onClick={() => navigate("/events")}
                disabled={loading}
                className="flex items-center gap-3 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50"
              >
                <IconArrowLeft size={32} />
                <Reveal variant="type">Manage Events</Reveal>
              </button>
              {event && <span>/ <Reveal variant="type">{event.title}</Reveal></span>}
            </>
          ) : <Reveal variant="type">Add Event</Reveal>}
        </h2>
      </div>
      <Reveal variant="lazy" ready={!id || Boolean(event)} className="flex flex-col lg:flex-row bg-zinc-900 overflow-hidden rounded-xl mt-8">
        <div className="relative flex flex-col items-center justify-center bg-gray-100 text-gray-400 min-h-180 overflow-hidden lg:w-1/2">
          {pictures.length ? (
            <>
              <PictureSlider images={pictures.map(({ imageUrl }) => imageUrl)} index={slide} alt="Event" onChange={setSlide} />
              <button
                type="button"
                onClick={handleRemovePicture}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 cursor-pointer transition duration-200 hover:brightness-50"
              >
                <IconTrash size={24} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <IconPhoto size={112} />
              <p className="mt-6 font-bold">Nothing to see here yet!</p>
              <p className="text-sm">Start by uploading your first image</p>
            </div>
          )}
        </div>
        <Reveal variant="right" className="relative flex flex-1 flex-col px-8 pt-8 pb-8">
          <div className="flex gap-6 border-b-4 border-zinc-800">
            {steps.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                disabled={!id || loading}
                className={`${segmentStyle} ${i === step ? "border-cyan-500 text-white" : "border-transparent text-gray-500"} ${id ? "enabled:cursor-pointer enabled:hover:brightness-50" : ""}`}
              >
                {i + 1}. {label}
              </button>
            ))}
          </div>
          <form noValidate onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-1 flex-col">
            <fieldset disabled={loading} className="flex flex-1 min-w-0 flex-col">
              <div className="flex-1 space-y-4">
                {step === 0 && (
                  <>
                    <EventField
                      label="Event Title:"
                      icon={IconFileText}
                      placeholder="Enter the event title"
                      {...register("title")}
                    />
                    <EventField
                      type="select"
                      label="Category:"
                      icon={IconCategory}
                      all="No category"
                      options={categories.map((category) => ({ value: String(category.id), label: category.name }))}
                      value={values.category}
                      onSelect={(value) => setValue("category", value, { shouldDirty: true })}
                    />
                    <EventField
                      type="textarea"
                      label="Description:"
                      icon={IconFileText}
                      placeholder="Enter a short description of the event"
                      {...register("description")}
                    />
                  </>
                )}
                {step === 1 && (
                  <>
                    <EventField
                      type="photo"
                      label="Event Pictures:"
                      text={`ADD PHOTO (${pictures.length}/4)`}
                      hint="Up to 4 pictures, each cropped to 800 × 800 px."
                      limit={4}
                      count={pictures.length}
                      width={800}
                      height={800}
                      onPick={handlePictures}
                      onError={handleError}
                    />
                    <EventField
                      label="Location:"
                      icon={IconMapPin}
                      placeholder="Enter the event location"
                      {...register("location")}
                    />
                    <EventField
                      type="date"
                      label="Date:"
                      icon={IconCalendar}
                      min={id ? undefined : nowLocal().slice(0, 10)}
                      error={past ? "Date cannot be earlier than now!" : taken ? "Location is unavailable on or beside that date!" : ""}
                      {...register("dateTime")}
                    />
                    <EventField type="time" label="Show Time:" icon={IconClock} {...register("showTime")} />
                    <EventField
                      type="time"
                      name="doorsOpen"
                      label="Doors Open:"
                      icon={IconClock}
                      hint="Doors open 2 hours before the show time."
                      value={doorsOpenAt(values.dateTime, values.showTime).slice(11, 16)}
                      readOnly
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        const enabled = values.ticketTypes[index].enabled;
                        return (
                          <div key={field.id} className="space-y-3">
                            <EventField
                              type="toggle"
                              label={field.name}
                              enabled={enabled}
                              onToggle={() => setValue(`ticketTypes.${index}.enabled`, !enabled, { shouldDirty: true })}
                            />
                            <div className={`space-y-3 transition-opacity duration-200 ${enabled ? "" : "opacity-50"}`}>
                              <EventField
                                type="number"
                                label="Price:"
                                icon={IconCurrencyPeso}
                                placeholder="Must be at least 200"
                                min="200"
                                step="1"
                                disabled={!enabled}
                                {...register(`ticketTypes.${index}.price`)}
                              />
                              <EventField
                                type="number"
                                label="Ticket Quantity:"
                                placeholder="Must be at least 1"
                                min="1"
                                step="1"
                                disabled={!enabled}
                                {...register(`ticketTypes.${index}.availableQuantity`)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-zinc-700" />
                    <EventField
                      type="number"
                      name="totalTickets"
                      label="No. Tickets:"
                      icon={IconTicket}
                      value={totalTickets}
                      readOnly
                    />
                  </>
                )}
                {step === 3 && (
                  <>
                    <EventField
                      type="photo"
                      label="Display Picture:"
                      text="UPLOAD PHOTO"
                      hint="Recommended: 720 × 576 px (5:4), other sizes are cropped to fit."
                      width={720}
                      height={576}
                      onPick={([picture]) => setImage(picture)}
                      onError={handleError}
                    >
                      {photo && <img src={photo} alt="Display Picture" className="aspect-5/4 h-40 mt-2 ml-32 object-cover rounded-md" />}
                    </EventField>
                    {id && (
                      <EventField
                        type="select"
                        label="Status:"
                        icon={IconArchive}
                        options={statuses}
                        value={values.status}
                        onSelect={(value) => setValue("status", value, { shouldDirty: true })}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-6 pt-4">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className={`${buttonStyle} bg-gray-300 text-black`}
                  >
                    BACK
                  </button>
                )}
                <button
                  type="button"
                  onClick={step < 3 ? () => setStep(step + 1) : () => setConfirming(true)}
                  disabled={step < 3 ? !ready[step] : !ready.every(Boolean)}
                  className={`${buttonStyle} ${step < 3 ? "bg-cyan-500" : "bg-green-500"}`}
                >
                  {step < 3 ? "NEXT" : id ? "SAVE CHANGES" : "ADD EVENT"}
                </button>
              </div>
            </fieldset>
          </form>
        </Reveal>
      </Reveal>
      {confirming && (
        <ConfirmModal
          message={id ? "Save changes?" : "Add event?"}
          description={id ? "This will update the event with your changes." : "This will publish the event for users to see."}
          confirmText={texter(id ? "SAVE" : "ADD", id ? "SAVING" : "ADDING")}
          loading={loading}
          onConfirm={handleSubmit(onSubmission)}
          onClose={() => setConfirming(false)}
        />
      )}
      {message && <ConfirmModal type={message.type} message={message.message} onClose={handleClose} />}
      {blocker.state === "blocked" && 
        <ConfirmModal 
          message="Discard changes?" 
          description="Your unsaved changes will be lost." 
          confirmText="DISCARD" 
          onConfirm={blocker.proceed} 
          onClose={blocker.reset} 
        />}
    </div>
  )
}