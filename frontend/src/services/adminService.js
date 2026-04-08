import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleBlock: (id) => api.put(`/admin/users/${id}/toggle-block`),
  getClaims: (params) => api.get('/admin/claims', { params }),
  getClaimById: (id) => api.get(`/admin/claims/${id}`),
  approveClaim: (id, adminNotes) => api.put(`/admin/claims/${id}/approve`, null, { params: { adminNotes } }),
  rejectClaim: (id, adminNotes) => api.put(`/admin/claims/${id}/reject`, null, { params: { adminNotes } }),
  reviewClaim: (id, adminNotes) => api.put(`/admin/claims/${id}/review`, null, { params: { adminNotes } }),
  updateClaimStatus: (id, status, adminNotes) => api.put(`/admin/claims/${id}/status`, null, { params: { status, adminNotes } }),
  getComplaints: (params) => api.get('/admin/complaints', { params }),
  respondToComplaint: (id, status, adminResponse) => api.put(`/admin/complaints/${id}/respond`, null, { params: { status, adminResponse } }),
  updateLostItemStatus: (id, status) => api.put(`/admin/lost-items/${id}/status`, null, { params: { status } }),
  updateFoundItemStatus: (id, status) => api.put(`/admin/found-items/${id}/status`, null, { params: { status } }),
  getAllLostItems: (page=0, size=20, keyword='') => api.get('/lost-items', { params: { page, size, keyword } }),
  deleteLostItem: (id) => api.delete(`/lost-items/${id}`),
  getAllFoundItems: (page=0, size=20, keyword='') => api.get('/found-items', { params: { page, size, keyword } }),
  deleteFoundItem: (id) => api.delete(`/found-items/${id}`)
};

export default adminService;
