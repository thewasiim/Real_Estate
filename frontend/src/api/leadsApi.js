import api from './axiosClient';

export const leadsApi = {
  create: (data) => api.post('/leads', data),
  getAll: (params) => api.get('/leads', { params }),
  updateStatus: (id, data) => api.patch(`/leads/${id}`, data),
};
