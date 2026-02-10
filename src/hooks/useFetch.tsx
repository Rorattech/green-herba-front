"use client";

import { useEffect, useState } from 'react';

export function useFetch<T = unknown>(url?: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) return;
    let mounted = true;
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => mounted && setData(d))
      .catch((e) => mounted && setError(e))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
