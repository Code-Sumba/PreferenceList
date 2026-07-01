import { useCallback, useEffect, useState } from "react";
import { getCredits } from "../api";

export function useCredits(autoLoad = true) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(autoLoad);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { balance } = await getCredits();
      setBalance(balance);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) refresh();
  }, [autoLoad, refresh]);

  return { balance, loading, refresh, setBalance };
}
