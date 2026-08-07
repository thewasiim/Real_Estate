import React, { createContext, useContext, useState, useCallback } from 'react';

const RecentlyViewedContext = createContext(null);

const MAX_RECENT = 10;

export function RecentlyViewedProvider({ children }) {
  const [recentIds, setRecentIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    } catch {
      return [];
    }
  });

  const addRecentlyViewed = useCallback((propertyId) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== propertyId);
      const next = [propertyId, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem('recentlyViewed', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentIds, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
