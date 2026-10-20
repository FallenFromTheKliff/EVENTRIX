import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const arrowStyle = "absolute top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 cursor-pointer transition duration-200 hover:brightness-50";

export default function PictureSlider({ images, index, alt, onChange }) {
  return (
    <>
      {images.map((src, i) => (
        <img key={i} src={src} alt={alt} className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`} />
      ))}
      {images.length > 1 && (
        <>
          <button type="button" onClick={() => onChange((index - 1 + images.length) % images.length)} className={`${arrowStyle} left-3`}>
            <IconChevronLeft size={28} />
          </button>
          <button type="button" onClick={() => onChange((index + 1) % images.length)} className={`${arrowStyle} right-3`}>
            <IconChevronRight size={28} />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 bg-black/50 rounded-full px-3 py-2">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={() => onChange(i)} className={`size-3 rounded-full cursor-pointer transition duration-200 ${i === index ? "bg-cyan-400" : "bg-white/60 hover:bg-white"}`} />
            ))}
          </div>
        </>
      )}
    </>
  )
}