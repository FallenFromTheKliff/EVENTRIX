import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { IconPhoto } from "@tabler/icons-react";

import { useEvents } from "../../context/EventContext";

import useLoadingText from "../../components/ui/useLoadingText";
import ConfirmModal from "../../components/ui/ConfirmModal";

const inputStyle = "flex-1 bg-white/15 rounded-md p-2 focus:outline-2 focus:outline-cyan-500";
const buttonStyle = "flex-1 font-bold rounded-md py-3 text-center cursor-pointer transition duration-200 hover:brightness-50 disabled:opacity-50";
const imageTypes = ["image/png", "image/jpeg", "image/webp"];

export default function EventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, createEvent, updateEvent } = useEvents();
  const { loading, runner, texter } = useLoadingText();
  const event = getEvent(id);
  const { register, handleSubmit, formState: { errors } } = useForm({
    values: event && {
      title: event.title,
      dateTime: event.dateTime.slice(0, 16),
      location: event.location,
      price: event.price,
      doorsOpen: event.doorsOpen?.slice(0, 16) ?? "",
      totalTickets: event.totalTickets,
      description: event.description ?? ""
    }
  });
  const [image, setImage] = useState("");
  const [message, setMessage] = useState(null);
  const photo = image || event?.thumbnailUrl;

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
      const body = { ...data, imageUrl: photo };
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
        <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
          {id ? "Edit Event" : "Add Event"}
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row bg-zinc-900 overflow-hidden rounded-xl mt-8">
        <div className="relative flex flex-col items-center justify-center bg-gray-100 text-gray-400 min-h-112 overflow-hidden lg:w-1/2">
          {photo ? (
            <img src={photo} alt="Event" className="absolute inset-0 size-full object-cover" />
          ) : (
            <>
              <IconPhoto size={112} />
              <p className="mt-6 font-bold">Nothing to see here yet!</p>
              <p className="text-sm">Start by uploading your first image</p>
            </>
          )}
        </div>
        <div className="relative flex-1 px-8 pt-8 pb-4">
          <form noValidate className="space-y-2">
            <div>
              <div className="flex items-center gap-4">
                <label htmlFor="title" className="w-28 text-sm">Event Title:</label>
                <input id="title" type="text" className={inputStyle} {...register("title", { required: "Event title is required!" })} />
              </div>
              <p className="text-red-500 text-sm min-h-5 mt-1 pl-32">{errors.title?.message}</p>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <label htmlFor="dateTime" className="w-28 text-sm">Date:</label>
                <input id="dateTime" type="datetime-local" className={inputStyle} {...register("dateTime", { required: "Date is required!" })} />
              </div>
              <p className="text-red-500 text-sm min-h-5 mt-1 pl-32">{errors.dateTime?.message}</p>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <label htmlFor="location" className="w-28 text-sm">Location:</label>
                <input id="location" type="text" className={inputStyle} {...register("location", { required: "Location is required!" })} />
              </div>
              <p className="text-red-500 text-sm min-h-5 mt-1 pl-32">{errors.location?.message}</p>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <label htmlFor="price" className="w-28 text-sm">Price:</label>
                <input id="price" type="number" min="0" step="0.01" className={inputStyle} {...register("price", { required: "Price is required!" })} />
              </div>
              <p className="text-red-500 text-sm min-h-5 mt-1 pl-32">{errors.price?.message}</p>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <label htmlFor="doorsOpen" className="w-28 text-sm">Doors Open:</label>
                <input id="doorsOpen" type="datetime-local" className={inputStyle} {...register("doorsOpen")} />
              </div>
              <p className="text-red-500 text-sm min-h-5 mt-1 pl-32">{errors.doorsOpen?.message}</p>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <label htmlFor="totalTickets" className="w-28 text-sm">No. Tickets:</label>
                <input id="totalTickets" type="number" min="1" step="1" className={inputStyle} {...register("totalTickets", { required: "Number of tickets is required!" })} />
              </div>
              <p className="text-red-500 text-sm min-h-5 mt-1 pl-32">{errors.totalTickets?.message}</p>
            </div>
            <div>
              <label htmlFor="description" className="text-sm">Description:</label>
              <textarea id="description" rows={5} className={`${inputStyle} w-full mt-1`} {...register("description")} />
            </div>
            <div className="flex gap-6 pt-4">
              <label className={`${buttonStyle} bg-gray-300 text-black`}>
                UPLOAD PHOTO
                <input type="file" accept={imageTypes.join()} onChange={handleImage} className="hidden" />
              </label>
              <button type="button" onClick={handleSubmit(onSubmission)} disabled={loading} className={`${buttonStyle} bg-green-500`}>
                {texter(id ? "SAVE CHANGES" : "ADD EVENT", id ? "SAVING..." : "ADDING...")}
              </button>
            </div>
          </form>
        </div>
      </div>
      {message && <ConfirmModal type={message.type} message={message.message} onClose={handleClose} />}
    </div>
  )
}