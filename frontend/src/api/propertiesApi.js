import api from './axiosClient';

export const propertiesApi = {
  getAll: (params, config = {}) => api.get('/properties', { ...config, params }),
  getById: (id, config = {}) => api.get('/properties/' + id, config),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
};
