import api from './api';

export const messageService = {
  send: (data) => api.post('/messages', data),
  getForClaim: (claimId) => api.get(`/messages/claim/${claimId}`),
  markAsRead: (claimId) => api.put(`/messages/claim/${claimId}/read`),
};

export default messageService;
