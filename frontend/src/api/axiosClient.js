import axios from 'axios';

/**
 * Central Axios instance.
 * - In development: Vite proxy handles /api → localhost:4000
 * - In production: VITE_API_BASE_URL env var points to deployed backend
 *
 * All API calls go through this instance so auth cookie handling
 * (withCredentials) and error shape are centralized.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — unwrap { success, data, error }
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401, could trigger logout or redirect — handled by AuthContext
    if (error.response?.status === 401) {
      // AuthContext will handle this via its own logic
    }
    return Promise.reject(error);
  }
);

export default api;
