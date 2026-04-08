import api from './api';

export const userService = {
  getMe: () => api.get('/users/me'),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/me', data),
  updatePhoto: (formData) => api.post('/users/me/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.put('/users/me/password', data),
};

export default userService;
