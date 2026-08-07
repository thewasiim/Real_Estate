import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: !!action.payload,
        isAdmin: action.payload?.role === 'ADMIN',
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Hydrate user from cookie on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.me();
        if (res.data.success) {
          dispatch({ type: 'SET_USER', payload: res.data.data.user });
        } else {
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch {
        dispatch({ type: 'SET_USER', payload: null });
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data.success) {
      dispatch({ type: 'SET_USER', payload: res.data.data.user });
    }
    return res.data;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authApi.register(data);
    if (res.data.success) {
      dispatch({ type: 'SET_USER', payload: res.data.data.user });
    }
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if API fails, clear local state
    }
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
