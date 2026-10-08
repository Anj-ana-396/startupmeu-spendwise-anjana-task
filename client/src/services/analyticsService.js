import api from './api';

export const analyticsService = {
  // Get summary totals (income, expense, balance, monthly comparison)
  getSummary: () => api.get('/analytics/summary'),

  // Get category breakdown (with type, date range, or month/year filter)
  getCategories: (params = {}) => api.get('/analytics/categories', { params }),

  // Get monthly trends for bar / area chart
  getMonthlyTrends: (months = 6) => api.get('/analytics/monthly', { params: { months } }),
};

export default analyticsService;
