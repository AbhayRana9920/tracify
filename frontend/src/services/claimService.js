import api from './api';

export const claimService = {
  submit: (formData) => api.post('/claims', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getById: (id) => api.get(`/claims/${id}`),
  getMine: (params) => api.get('/claims/my', { params }),
  getForItem: (foundItemId, params) => api.get(`/claims/item/${foundItemId}`, { params }),
  finderConfirmHandover: (id) => api.patch(`/claims/${id}/finder-confirm`),
  ownerConfirmReceipt: (id) => api.patch(`/claims/${id}/owner-confirm`),
};

export default claimService;
