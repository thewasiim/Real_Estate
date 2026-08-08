import api from './axiosClient';

export const usersApi = {
  getAll: (params) => api.get('/users', { params }),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};
