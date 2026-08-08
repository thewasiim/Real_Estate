import api from './axiosClient';

export const leadsApi = {
  create: (data) => api.post('/leads', data),
  getAll: (params) => api.get('/leads', { params }),
  updateStatus: (id, status) => api.patch(`/leads/${id}`, { status }),
  delete: (id) => api.delete(`/leads/${id}`),
};
