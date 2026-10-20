import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";

export default function ConfirmModal({ type = "prompt", message, description, confirmText = "PROCEED", loading = false, onConfirm, onClose }) {
  return (
    <div onClick={loading ? undefined : onClose} className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 backdrop-blur-lg px-6 transition-opacity duration-300 starting:opacity-0">
      <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-135 flex-col items-center gap-7 rounded-xl bg-slate-900 text-white p-10 shadow-2xl shadow-black transition duration-300 starting:scale-90">
        {type === "success" && <IconCircleCheck size={134} className="text-green-500" />}
        {type === "error" && <IconCircleX size={134} className="text-red-500" />}
        <div className={`w-full space-y-2 ${type === "prompt" ? "" : "text-center"}`}>
          <h2 className="text-4xl font-bold">{message}</h2>
          {type === "prompt" && <p className="text-base text-gray-400">{description}</p>}
        </div>
        {type === "prompt" ? (
          <div className="flex w-full gap-3">
            <button onClick={onClose} disabled={loading} className="flex-1 bg-gray-600 text-lg font-bold rounded-md py-2.5 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50">
              NO
            </button>
            <button onClick={onConfirm} disabled={loading} className="flex-1 bg-cyan-500 text-lg font-bold rounded-md py-2.5 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50">
              {confirmText}
            </button>
          </div>
        ) : (
          <button onClick={onClose} className="w-full bg-cyan-500 text-lg font-bold rounded-md py-2.5 cursor-pointer transition duration-200 hover:brightness-50">
            CLOSE
          </button>
        )}
      </div>
    </div>
  )
}