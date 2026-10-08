import api from './api';

export const transactionService = {
  // Fetch transactions with query parameters (search, filter, sort, pagination)
  getAll: (params = {}) => api.get('/transactions', { params }),

  // Get single transaction by ID
  getById: (id) => api.get(`/transactions/${id}`),

  // Create new transaction
  create: (data) => api.post('/transactions', data),

  // Update existing transaction
  update: (id, data) => api.put(`/transactions/${id}`, data),

  // Delete transaction
  delete: (id) => api.delete(`/transactions/${id}`),
};

export default transactionService;
