import { useState, useEffect } from "react";

import { useTransactions } from "../../context/TransactionContext";

import { categories, ticketTypes } from "../../data/details";
import { messageStyle, bookingButton } from "../../utils/styles";
import { cartFilters as transactionFilters, emptyFilters, months } from "../../utils/filters";

import useDebouncing from "../../utils/useDebouncing";
import usePagination from "../../utils/usePagination";

import BookingCard from "../../components/transactions/BookingCard";
import BookingHeader from "../../components/transactions/BookingHeader";
import FilterRow from "../../components/ui/FilterRow";
import Reveal from "../../components/ui/Reveal";
import useLoadingText from "../../components/ui/useLoadingText";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Pagination from "../../components/ui/Pagination";

export default function Transactions() {
  const { transactions, transactionsLoading, transactionsError, refreshTransactions, updateTransactionStatus } = useTransactions();
  const { loading, runner, texter } = useLoadingText();
  const [filters, setFilters] = useState(emptyFilters);
  const [action, setAction] = useState(null);
  const [failed, setFailed] = useState("");

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const options = {
    category: categories,
    ticketType: ticketTypes,
    date: months
  };

  const debouncedFilters = useDebouncing(filters, 200);
  const filteredTransactions = transactions.filter((item) =>
    (item.eventTitle || "").toLowerCase().includes(debouncedFilters.name.trim().toLowerCase()) &&
    (!debouncedFilters.category || item.eventCategory === debouncedFilters.category) &&
    (!debouncedFilters.ticketType || item.ticketName === debouncedFilters.ticketType) &&
    (!debouncedFilters.date || item.eventDateTime?.startsWith(debouncedFilters.date))
  );

  const { page, pages, setPage, items } = usePagination(filteredTransactions);
  const handleFilter = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
    setPage(1);
  };

  const handleAsk = (bookingId, status, message) => () => setAction({ bookingId, status, message });
  const handleAction = () => runner(async () => {
    try {
      await updateTransactionStatus(action.bookingId, action.status);
    } catch (error) {
      setFailed(typeof error.response?.data === "string" ? error.response.data : "Failed to update the booking!");
    } finally {
      setAction(null);
    }
  });

  return (
    <div className="flex flex-1 flex-col">
      <title>Transactions | EVENTRIX</title>
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
          <Reveal variant="reappear" className="w-full">
            <BookingHeader admin />
          </Reveal>
          {transactionsLoading && !transactions.length ? (
            <p className={messageStyle}>Loading transactions...</p>
          ) : transactionsError ? (
            <p className={messageStyle}>{transactionsError}</p>
          ) : filteredTransactions.length ? (
            items.map((item) => (
              <Reveal key={item.bookingId} className="w-full">
                <BookingCard booking={item} admin>
                  {item.status === "PROCESSING" && (
                    <>
                      <button type="button" onClick={handleAsk(item.bookingId, "CANCELLED", "Confirm cancellation?")} className={`${bookingButton} bg-red-500`}>
                        CONFIRM CANCELLATION
                      </button>
                      <button type="button" onClick={handleAsk(item.bookingId, "PAID", "Reject cancellation?")} className={`${bookingButton} bg-cyan-500`}>
                        REJECT CANCELLATION
                      </button>
                    </>
                  )}
                </BookingCard>
              </Reveal>
            ))
          ) : (
            <p className="my-auto py-8 text-center text-gray-400">No transactions found.</p>
          )}
          <Pagination page={page} pages={pages} onChange={setPage} className="pt-8" />
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