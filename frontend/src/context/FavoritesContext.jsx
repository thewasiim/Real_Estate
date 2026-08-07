import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { favoritesApi } from '../api/favoritesApi';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch favorites from backend when logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setFavoriteIds(new Set());
      return;
    }
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await favoritesApi.getAll();
        if (res.data.success) {
          const ids = new Set(res.data.data.map((f) => f.propertyId || f.id));
          setFavoriteIds(ids);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [isLoggedIn]);

  const isFavorite = useCallback((propertyId) => favoriteIds.has(propertyId), [favoriteIds]);

  const toggleFavorite = useCallback(
    async (propertyId) => {
      if (!isLoggedIn) return { needsLogin: true };

      // Optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(propertyId)) {
          next.delete(propertyId);
        } else {
          next.add(propertyId);
        }
        return next;
      });

      try {
        if (favoriteIds.has(propertyId)) {
          await favoritesApi.remove(propertyId);
        } else {
          await favoritesApi.add(propertyId);
        }
      } catch {
        // Revert on failure
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(propertyId)) {
            next.delete(propertyId);
          } else {
            next.add(propertyId);
          }
          return next;
        });
      }

      return { needsLogin: false };
    },
    [isLoggedIn, favoriteIds]
  );

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
