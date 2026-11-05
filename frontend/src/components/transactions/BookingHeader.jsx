import { adminColumns, bookingColumns } from "../../utils/events";

const labels = ["Event", "Tickets", "Status", "Reference ID"];

export default function BookingHeader({ admin = false }) {
  return (
    <div className={`hidden items-center text-gray-300 md:grid ${admin ? `${adminColumns} gap-3 px-5 py-3 text-xs` : `${bookingColumns} w-full gap-4 px-6 py-3 text-lg`}`}>
      {(admin ? [labels[0], "USER", ...labels.slice(1)] : labels).map((label, i) => (
        <p key={label} className={`font-semibold ${i > 0 ? "text-center" : ""}`}>{label}</p>
      ))}
      <div />
    </div>
  )
}