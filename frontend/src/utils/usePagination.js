import { useState } from "react";

import useDebouncing from "./useDebouncing";

export default function usePagination(items, size = 8) {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(items.length / size);
  const current = Math.min(page, Math.max(pages, 1));
  const debounced = useDebouncing(current, 200);
  const shown = Math.min(debounced, Math.max(pages, 1));

  return { page: current, pages, setPage, items: items.slice((shown - 1) * size, shown * size) };
}