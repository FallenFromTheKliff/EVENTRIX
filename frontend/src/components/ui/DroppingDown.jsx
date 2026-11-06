import { useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

export default function DroppingDown({ value, options = [], all, icon, className = "", onChange }) {
  const [open, setOpen] = useState(false);
  const items = all === undefined ? options : [{ value: "", label: all }, ...options];

  return (
    <>
      {open && <button type="button" onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" />}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 enabled:cursor-pointer disabled:cursor-not-allowed ${className}`}
      >
        {icon}
        <span className="flex-1 truncate text-left">{items.find((item) => item.value === value)?.label}</span>
        {open ? <IconChevronUp size={24} /> : <IconChevronDown size={24} />}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 bg-zinc-900 mt-3 min-w-full max-h-60 overflow-y-auto rounded-md border border-zinc-700 shadow-lg shadow-black transition duration-200 starting:opacity-0 starting:-translate-y-2">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className="block w-full px-4 py-3 text-left whitespace-nowrap cursor-pointer transition-colors duration-200 hover:bg-cyan-600"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}