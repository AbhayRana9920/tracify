import api from './api';

export const foundItemService = {
  getAll: (params) => api.get('/found-items', { params }),
  getById: (id) => api.get(`/found-items/${id}`),
  getMine: (params) => api.get('/found-items/my', { params }),
  create: (formData) => api.post('/found-items', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/found-items/${id}`, data),
  updateStatus: (id, status) => api.patch(`/found-items/${id}/status`, { status }),
  delete: (id) => api.delete(`/found-items/${id}`),
};

export default foundItemService;
