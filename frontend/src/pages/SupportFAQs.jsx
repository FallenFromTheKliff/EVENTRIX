import { contacts, faqs } from "../data/support";

export default function SupportFAQs() {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex border-b-4 border-zinc-900">
          <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            Support
          </h2>
        </div>
        <div className="mt-8 space-y-4 text-xl text-gray-300">
          {contacts.map(({ label, value }) => (
            <p key={label}>
              <strong className="text-white">{label}</strong>{" "}
              {value}
            </p>
          ))}
        </div>
      </section>
      <section>
        <div className="flex border-b-4 border-zinc-900">
          <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            FAQs
          </h2>
        </div>
        <div className="mt-8 space-y-8 text-lg text-gray-300">
          {faqs.map(({ question, answer }, i) => (
            <div key={question} className="space-y-2">
              <p><strong className="text-xl text-white">Q{i + 1}: {question}</strong></p>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}