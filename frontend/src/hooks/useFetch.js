import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosClient';

/**
 * Generic data-fetching hook.
 * Returns { data, loading, error, refetch }.
 * Replaces the old useMockFetch — now hits real API.
 */
export function useFetch(url, options = {}) {
  const { params, enabled = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, { params });
      if (res.data.success) {
        setData(res.data.data);
      } else {
        setError(res.data.error || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params), enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
