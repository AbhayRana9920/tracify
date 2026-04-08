import { FILE_BASE_URL } from './constants';

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

export const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x300?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${FILE_BASE_URL}${path}`;
};

export const truncate = (str, len = 100) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export const getStatusLabel = (status) => {
  return status?.replace(/_/g, ' ') || '';
};
