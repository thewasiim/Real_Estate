import api from './axiosClient';

export const faqsApi = {
  getAll: (params) => api.get('/faqs', { params }),
  getById: (id) => api.get(`/faqs/${id}`),
  create: (data) => api.post('/faqs', data),
  update: (id, data) => api.put(`/faqs/${id}`, data),
  delete: (id) => api.delete(`/faqs/${id}`),
};
