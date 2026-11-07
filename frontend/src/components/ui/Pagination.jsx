import { IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";

import Reveal from "./Reveal";

const buttonStyle = "flex size-9 items-center justify-center rounded-md text-sm transition duration-200 cursor-pointer hover:brightness-50";

export default function Pagination({ page, pages, onChange, className = "" }) {
  if (!pages) return null;

  const start = Math.floor((page - 1) / 3) * 3 + 1;

  return (
    <Reveal variant="reappear" className={`flex items-center justify-center gap-3 ${className}`}>
      {pages > 3 && page > 1 && (
        <button type="button" onClick={() => onChange(page - 1)} className={`${buttonStyle} bg-zinc-900`}>
          <IconChevronsLeft size={18} />
        </button>
      )}
      {Array.from({ length: Math.min(3, pages - start + 1) }, (_, i) => start + i).map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onChange(number)}
          className={`${buttonStyle} ${number === page ? "bg-cyan-500" : "bg-zinc-900"}`}
        >
          {number}
        </button>
      ))}
      {pages > 3 && page < pages && (
        <button type="button" onClick={() => onChange(page + 1)} className={`${buttonStyle} bg-zinc-900`}>
          <IconChevronsRight size={18} />
        </button>
      )}
    </Reveal>
  )
}