import api from './axiosClient';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  requestPasswordReset: (email) => api.post('/auth/forgot-password', { email }),
  verifyPasswordResetToken: (token) => api.get(`/auth/reset-password/${encodeURIComponent(token)}`),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};
