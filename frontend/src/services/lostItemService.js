import api from './api';

export const lostItemService = {
  getAll: (params) => api.get('/lost-items', { params }),
  getById: (id) => api.get(`/lost-items/${id}`),
  getMine: (params) => api.get('/lost-items/my', { params }),
  create: (formData) => api.post('/lost-items', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/lost-items/${id}`, data),
  delete: (id) => api.delete(`/lost-items/${id}`),
  getMatches: (id) => api.get(`/lost-items/${id}/matches`),
  reportFound: (id, payload) => api.post(`/lost-items/${id}/report-found`, payload),
};

export default lostItemService;
