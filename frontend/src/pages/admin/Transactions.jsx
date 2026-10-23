import { useState } from "react";

import { useTransactions } from "../../context/TransactionContext";
import { bookingFilters, emptyFilters, months } from "../../utils/filters";

import BookingCard from "../../components/transactions/BookingCard";
import FilterRow from "../../components/ui/FilterRow";
import Reveal from "../../components/ui/Reveal";

const transactionFilters = bookingFilters.filter(({ name }) => name !== "status");

export default function Transactions() {
  const { transactions = [], transactionsLoading, transactionsError, refreshTransactions, updateTransactionStatus } = useTransactions();
  const [filters, setFilters] = useState(emptyFilters);

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
    ["PENDING", "PAID", "CANCELLED"].includes(item.status)
  );

  const changeStatus = async (bookingId, status) => {
    await updateTransactionStatus(bookingId, status);
  };

  return (
    <div>
      <title>Transactions - EVENTRIX</title>
      <section>
        <div className="flex flex-wrap items-end gap-x-4">
          <h2 className="relative -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            <Reveal variant="type">Transaction History</Reveal>
          </h2>
          <Reveal variant="slide" className="ml-auto">
            <FilterRow fields={transactionFilters.filter(({ type }) => type === "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
          <div className="order-1 h-1 w-full bg-zinc-900" />
          <Reveal variant="slide" className="order-2 mt-3">
            <FilterRow fields={transactionFilters.filter(({ type }) => type !== "search")} filters={filters} options={options} onChange={handleFilter} />
          </Reveal>
        </div>
        <div className="mt-4 space-y-4">
          {transactionsError && (
            <div>
              <p role="alert" className="py-4 text-center text-red-400">{transactionsError}</p>
              <button type="button" onClick={refreshTransactions} className="mx-auto block rounded-md bg-cyan-500 px-4 py-2 font-bold">
                RETRY
              </button>
            </div>
          )}
          {transactionsLoading ? (
            <p className="py-8 text-center text-gray-400">Loading transactions...</p>
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
                  <BookingCard booking={{ ...item, status: item.status === "PENDING" ? "PROCESSING" : item.status }} admin>
                    {item.status !== "PENDING" && (
                      <button type="button" onClick={() => changeStatus(item.bookingId, "PENDING")} className="w-full rounded-md bg-cyan-500 py-2 text-xs font-bold">
                        MARK PROCESSING
                      </button>
                    )}
                    {item.status !== "PAID" && (
                      <button type="button" onClick={() => changeStatus(item.bookingId, "PAID")} className="w-full rounded-md bg-green-500 py-2 text-xs font-bold">
                        MARK SUCCESSFUL
                      </button>
                    )}
                    {item.status !== "CANCELLED" && (
                      <button type="button" onClick={() => changeStatus(item.bookingId, "CANCELLED")} className="w-full rounded-md bg-red-500 py-2 text-xs font-bold">
                        CANCEL
                      </button>
                    )}
                  </BookingCard>
                </Reveal>
              ))}
            </>
          ) : (
            <p className="py-8 text-center text-gray-400">No transactions found.</p>
          )}
        </div>
      </section>
    </div>
  );
}