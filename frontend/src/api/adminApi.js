import api from './axiosClient';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
};
