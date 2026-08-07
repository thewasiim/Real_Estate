import React, { createContext, useContext, useState, useCallback } from 'react';

const CompareContext = createContext(null);

const MAX_COMPARE = 4;

export function CompareProvider({ children }) {
  const [compareIds, setCompareIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('compare') || '[]');
    } catch {
      return [];
    }
  });

  const persist = (ids) => {
    localStorage.setItem('compare', JSON.stringify(ids));
  };

  const addToCompare = useCallback((propertyId) => {
    setCompareIds((prev) => {
      if (prev.includes(propertyId) || prev.length >= MAX_COMPARE) return prev;
      const next = [...prev, propertyId];
      persist(next);
      return next;
    });
  }, []);

  const removeFromCompare = useCallback((propertyId) => {
    setCompareIds((prev) => {
      const next = prev.filter((id) => id !== propertyId);
      persist(next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    persist([]);
  }, []);

  const isInCompare = useCallback((propertyId) => compareIds.includes(propertyId), [compareIds]);

  return (
    <CompareContext.Provider
      value={{ compareIds, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
