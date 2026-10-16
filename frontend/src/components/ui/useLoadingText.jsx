import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";

export default function useLoadingText() {
  const [loading, setLoading] = useState(false);

  const runner = async (action) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };
  
  const texter = (idle, busy) => loading ? (
    <span className="flex flex-row items-center justify-center gap-2">
      <IconLoader2 size={24} className="animate-spin" />
      {busy}
    </span>
  ) : (
    <span>{idle}</span>
  );

  return { loading, runner, texter }
}