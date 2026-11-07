import { adminColumns, bookingColumns } from "../../utils/styles";

const labels = ["Event", "Tickets", "Status", "Reference ID"];

export default function BookingHeader({ admin = false }) {
  return (
    <div className={`hidden items-center text-gray-300 md:grid ${admin ? `${adminColumns} gap-3 px-5 py-3 text-lg` : `${bookingColumns} w-full gap-4 px-6 py-3 text-lg`}`}>
      {(admin ? ["Client", ...labels] : labels).map((label, i) => (
        <p key={label} className={`font-semibold ${i > 0 ? "text-center" : ""}`}>{label}</p>
      ))}
    </div>
  )
}