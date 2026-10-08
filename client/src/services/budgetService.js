import api from './api';

export const budgetService = {
  // Get all budgets (with spending calculation)
  getAll: (params = {}) => api.get('/budgets', { params }),

  // Get budget for current month
  getCurrent: (month, year) =>
    api.get('/budgets/current', {
      params: { month, year },
    }),

  // Set/upsert monthly spending limit
  setBudget: (data) => api.post('/budgets', data),

  // Update budget by ID
  update: (id, data) => api.put(`/budgets/${id}`, data),

  // Delete budget by ID
  delete: (id) => api.delete(`/budgets/${id}`),
};

export default budgetService;
