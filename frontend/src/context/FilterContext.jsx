import React, { createContext, useContext, useReducer, useCallback } from 'react';

const FilterContext = createContext(null);

const initialFilters = {
  listingType: 'BUY',
  city: '',
  locality: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  bhk: '',
  bathrooms: '',
  minArea: '',
  maxArea: '',
  furnishing: '',
  readyToMove: false,
  amenities: [],
  sort: 'popularityScore_desc',
  page: 1,
  limit: 12,
};

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.key]: action.value, page: 1 };
    case 'SET_FILTERS':
      return { ...state, ...action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET':
      return { ...initialFilters };
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const setFilter = useCallback((key, value) => {
    dispatch({ type: 'SET_FILTER', key, value });
  }, []);

  const setFilters = useCallback((payload) => {
    dispatch({ type: 'SET_FILTERS', payload });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setFilter, setFilters, setPage, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
