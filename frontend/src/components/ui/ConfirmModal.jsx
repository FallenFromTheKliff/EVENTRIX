import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";

export default function ConfirmModal({ type = "prompt", message, description, confirmText = "Yes", loading = false, onConfirm, onClose }) {
  return (
    <div onClick={loading ? undefined : onClose} className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 backdrop-blur-lg px-6 transition-opacity duration-300 starting:opacity-0">
      <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl bg-slate-900 text-center text-white p-8 shadow-2xl shadow-black transition duration-300 starting:scale-90 starting:opacity-0">
        {type === "success" && <IconCircleCheck size={112} className="text-green-500" />}
        {type === "error" && <IconCircleX size={112} className="text-red-500" />}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{message}</h2>
          {type === "prompt" && <p className="text-sm text-gray-400">{description}</p>}
        </div>
        {type === "prompt" ? (
          <div className="flex w-full gap-3">
            <button onClick={onClose} disabled={loading} className="flex-1 bg-gray-600 font-bold rounded-md py-2 cursor-pointer transition duration-200 hover:brightness-90 disabled:opacity-50">
              No
            </button>
            <button onClick={onConfirm} disabled={loading} className="flex-1 bg-cyan-500 font-bold rounded-md py-2 cursor-pointer transition duration-200 hover:brightness-90 disabled:opacity-50">
              {confirmText}
            </button>
          </div>
        ) : (
          <button onClick={onClose} className="w-full bg-cyan-500 font-bold rounded-md py-2 cursor-pointer transition duration-200 hover:brightness-90">
            Close
          </button>
        )}
      </div>
    </div>
  )
}