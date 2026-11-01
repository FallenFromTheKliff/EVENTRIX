import { useState } from "react";

import { IconPhoto, IconCrown, IconTicket, IconCheck, IconPlus, IconEye, IconEyeOff } from "@tabler/icons-react";

import { imageTypes, resizeImage, inputStyle, iconStyle } from "../../utils/events";

import DroppingDown from "../ui/DroppingDown";

const ticketButtonStyle = "relative w-44 flex items-center gap-2 rounded-md px-3 py-3 text-base font-bold cursor-pointer transition duration-200 enabled:hover:brightness-50";
const ticketButtonColors = { STANDARD: "bg-cyan-500 text-white", VIP: "bg-blue-950 text-yellow-400" };

export default function EventField({ type = "text", label, icon: Icon, hint, error, children, options, all, onSelect, text, limit = 1, count = 0, width, height, onPick, onError, enabled, onToggle, ...props }) {
  const [show, setShow] = useState(false);
  
  if (type === "toggle") return (
    <button
      type="button"
      onClick={onToggle}
      className={`${ticketButtonStyle} ${enabled ? ticketButtonColors[label] : "bg-zinc-700 text-gray-400"}`}
    >
      {label === "VIP" ? <IconCrown size={22} /> : <IconTicket size={22} />}
      {label}
      {enabled ? <IconCheck size={20} className="absolute right-3" /> : <IconPlus size={20} className="absolute right-3" />}
    </button>
  );

  if (type === "select") return (
    <div className="flex items-center gap-4">
      <p className="w-28 text-sm">{label}</p>
      <div className="relative flex-1">
        <DroppingDown
          value={props.value}
          options={options}
          all={all}
          icon={<Icon size={18} className="text-cyan-400" />}
          className={`${inputStyle} w-full`}
          onChange={onSelect}
        />
      </div>
    </div>
  );

  if (type === "photo") {
    const handleFiles = async (e) => {
      const files = [...e.target.files].slice(0, limit - count);
      e.target.value = "";
      if (!files.length) return;
      if (files.some((file) => !imageTypes.includes(file.type))) {
        onError("Only PNG, JPG, and WEBP images are allowed!");
        return;
      }
      try {
        onPick(await Promise.all(files.map((file) => resizeImage(file, width, height))));
      } catch {
        onError("Unable to read that image!");
      }
    };

    return (
      <div>
        <div className="flex items-center gap-4">
          <p className="w-28 text-sm">{label}</p>
          <label className={`flex flex-1 items-center justify-center gap-2 bg-gray-300 text-black font-bold rounded-md py-3 transition duration-200 ${count >= limit ? "opacity-50" : "cursor-pointer hover:brightness-50"}`}>
            <IconPhoto size={20} />
            {text}
            <input
              type="file"
              multiple={limit > 1}
              accept={imageTypes.join()}
              disabled={count >= limit}
              onChange={handleFiles}
              className="hidden"
            />
          </label>
        </div>
        {hint && <p className="text-sm text-gray-400 mt-1 pl-32">{hint}</p>}
        {children}
      </div>
    );
  }

  if (type === "textarea") return (
    <div>
      <label htmlFor={props.name} className="text-sm">{label}</label>
      <div className="relative mt-1">
        <Icon size={18} className="absolute left-3 top-3 text-cyan-400" />
        <textarea id={props.name} rows={5} className={`${inputStyle} w-full pl-10`} {...props} />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4">
        <label htmlFor={props.name} className="w-28 text-sm">{label}</label>
        <div className="relative flex-1">
          {Icon && <Icon size={18} className={iconStyle} />}
          <input id={props.name} type={type === "password" && show ? "text" : type} className={`${inputStyle} w-full disabled:cursor-not-allowed ${Icon ? "pl-10" : ""} ${type === "password" ? "pr-10" : ""}`} {...props} />
          {type === "password" && (
            <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-3 flex items-center text-gray-300 cursor-pointer transition-colors duration-200 hover:text-white">
              {show ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          )}
        </div>
      </div>
      {hint && <p className="text-sm text-gray-400 mt-1 pl-32">{hint}</p>}
      {error && <p className="text-red-500 text-sm mt-1 pl-32">{error}</p>}
    </div>
  )
}