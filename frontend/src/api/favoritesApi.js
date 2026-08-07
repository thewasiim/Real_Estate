import api from './axiosClient';

export const favoritesApi = {
  getAll: () => api.get('/favorites'),
  add: (propertyId) => api.post('/favorites', { propertyId }),
  remove: (propertyId) => api.delete(`/favorites/${propertyId}`),
};
