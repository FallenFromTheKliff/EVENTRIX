import { useState } from "react";

import { useTransactions } from "../../context/TransactionContext";
import { bookingFilters, emptyFilters, months } from "../../utils/filters";

import BookingCard from "../../components/transactions/BookingCard";
import FilterRow from "../../components/ui/FilterRow";
import Reveal from "../../components/ui/Reveal";
import useLoadingText from "../../components/ui/useLoadingText";
import ConfirmModal from "../../components/ui/ConfirmModal";

const transactionFilters = bookingFilters.filter(({ name }) => name !== "status");
const adminButton = "w-full rounded-md py-2 text-xs font-bold transition duration-200 cursor-pointer hover:brightness-50";

export default function Transactions() {
  const { transactions = [], transactionsLoading, transactionsError, refreshTransactions, updateTransactionStatus } = useTransactions();
  const { loading, runner, texter } = useLoadingText();
  const [filters, setFilters] = useState(emptyFilters);
  const [action, setAction] = useState(null);
  const [failed, setFailed] = useState("");

  const handleFilter = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });

  const options = {
    category: [...new Set(transactions.map((item) => item.eventCategory).filter(Boolean))].map((name) => ({ value: name, label: name })),
    ticketType: [...new Set(transactions.map((item) => item.ticketName).filter(Boolean))].map((name) => ({ value: name, label: name })),
    date: months
  };

  const filteredTransactions = transactions.filter((item) =>
    (item.eventTitle || "").toLowerCase().includes(filters.name.trim().toLowerCase()) &&
    (!filters.category || item.eventCategory === filters.category) &&
    (!filters.ticketType || item.ticketName === filters.ticketType) &&
    (!filters.date || item.eventDateTime?.startsWith(filters.date)) &&
    ["PROCESSING", "PENDING", "PAID", "CANCELLED"].includes(item.status)
  );

  const handleAsk = (bookingId, status, message) => () => setAction({ bookingId, status, message });
  const handleAction = () => runner(async () => {
    try {
      await updateTransactionStatus(action.bookingId, action.status);
    } catch {
      setFailed("Failed to update the booking!");
    } finally {
      setAction(null);
    }
  });

  return (
    <div className="flex flex-1 flex-col">
      <title>Transactions - EVENTRIX</title>
      <section className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-end gap-x-4">
          <h2 className="relative -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            <Reveal variant="type">Transaction History</Reveal>
          </h2>
          <Reveal variant="slide" className="ml-auto">
            <FilterRow fields={transactionFilters.filter(({ type }) => type === "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
          <div className="bg-zinc-900 order-1 2xl:order-2 h-1 w-full" />
          <Reveal variant="slide" className="order-2 2xl:order-1 mt-3 2xl:mt-0">
            <FilterRow fields={transactionFilters.filter(({ type }) => type !== "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
        </div>
        <div className="mt-4 flex flex-1 flex-col space-y-4">
          {transactionsError && (
            <div className="my-auto">
              <p role="alert" className="py-4 text-center text-red-400">{transactionsError}</p>
              <button type="button" onClick={refreshTransactions} className="mx-auto block rounded-md bg-cyan-500 px-4 py-2 font-bold">
                RETRY
              </button>
            </div>
          )}
          {transactionsLoading ? (
            <p className="my-auto py-8 text-center text-gray-400">Loading transactions...</p>
          ) : transactionsError ? null : filteredTransactions.length ? (
            <>
              <Reveal variant="reappear" className="w-full">
                <div className="hidden grid-cols-[minmax(0,1.7fr)_4rem_6rem_minmax(0,1.3fr)_minmax(0,1fr)_6rem] items-center gap-3 px-5 py-3 text-xs text-gray-300 md:grid">
                  <p className="font-semibold">Event</p>
                  <p className="text-center font-semibold">Tickets</p>
                  <p className="text-center font-semibold">Status</p>
                  <p className="text-center font-semibold">Reference ID</p>
                  <p className="text-center font-semibold">USER</p>
                  <div />
                </div>
              </Reveal>
              {filteredTransactions.map((item) => (
                <Reveal key={item.bookingId} className="w-full">
                  <BookingCard booking={item} admin>
                    {item.status === "PENDING" && (
                      <>
                        <button type="button" onClick={() => updateTransactionStatus(item.bookingId, "PAID")} className={`${adminButton} bg-green-500`}>
                          MARK SUCCESSFUL
                        </button>
                        <button type="button" onClick={() => updateTransactionStatus(item.bookingId, "CANCELLED")} className={`${adminButton} bg-red-500`}>
                          CANCEL
                        </button>
                      </>
                    )}
                    {item.status === "PROCESSING" && (
                      <>
                        <button type="button" onClick={() => updateTransactionStatus(item.bookingId, "CANCELLED")} className={`${adminButton} bg-red-500`}>
                          CONFIRM CANCELLATION
                        </button>
                        <button type="button" onClick={() => updateTransactionStatus(item.bookingId, "PENDING")} className={`${adminButton} bg-cyan-500`}>
                          REJECT CANCELLATION
                        </button>
                      </>
                    )}
                  </BookingCard>
                </Reveal>
              ))}
            </>
          ) : (
            <p className="my-auto py-8 text-center text-gray-400">No transactions found.</p>
          )}
        </div>
      </section>
      {action && (
        <ConfirmModal
          message={action.message}
          description="This will update the status of the booking."
          confirmText={texter("CONFIRM", "UPDATING")}
          loading={loading}
          onConfirm={handleAction}
          onClose={() => setAction(null)}
        />
      )}
      {failed && <ConfirmModal type="error" message={failed} onClose={() => setFailed("")} />}
    </div>
  );
}