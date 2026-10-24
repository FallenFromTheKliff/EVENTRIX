export default function Retry({ message, onRetry }) {
  return (
    <div className="my-auto">
      <p role="alert" className="py-4 text-center text-red-400">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mx-auto block rounded-md bg-cyan-500 px-4 py-2 font-bold transition duration-200 cursor-pointer hover:brightness-50"
      >
        RETRY
      </button>
    </div>
  )
}