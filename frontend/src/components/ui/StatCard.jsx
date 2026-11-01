export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex h-full items-center gap-5 bg-zinc-700 p-6">
      <Icon size={56} className="shrink-0 text-cyan-400" />
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-gray-300">{label}</p>
      </div>
    </div>
  )
}