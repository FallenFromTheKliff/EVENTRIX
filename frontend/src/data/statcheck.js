export const bookingStatuses = {
  PENDING: { label: "Pending Payment", color: "text-yellow-500" },
  PAID: { label: "Successful", color: "text-green-500" },
  PROCESSING: { label: "Processing", color: "text-cyan-400" },
  CANCELLED: { label: "Cancelled", color: "text-red-500" },
  DECLINED: { label: "Cancelled", color: "text-red-500" },
  COMPLETED: { label: "Completed", color: "text-green-500" }
};

export const eventStatuses = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "ARCHIVED", label: "ARCHIVED" }
];

export const statusBadges = {
  ACTIVE: { label: "LIVE", color: "bg-green-500/20 text-green-500" },
  ARCHIVED: { label: "CLOSED", color: "bg-red-500/20 text-red-500" }
};