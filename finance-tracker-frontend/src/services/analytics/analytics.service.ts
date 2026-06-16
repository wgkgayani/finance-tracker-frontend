// src/services/analytics/analytics.service.ts
import api from '@/lib/api/axios.config';

export const analyticsService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.warn('Using mock analytics data');
      return {
        totalIncome: 5250,
        totalExpense: 3250,
        savings: 2000,
        savingsRate: 38.1,
        categorySpending: [
          { category: 'Food', amount: 1200 },
          { category: 'Transport', amount: 450 },
          { category: 'Shopping', amount: 800 },
        ],
      };
    }
  },

  getAnalytics: async (months: number = 6) => {
    const response = await api.get(`/analytics/trends?months=${months}`);
    return response.data;
  },

  getAIInsights: async () => {
    try {
      const response = await api.get('/ai/insights');
      return response.data;
    } catch (error) {
      return [
        { id: 1, type: 'warning', message: 'Food spending is high', recommendation: 'Reduce dining out', impact: 'Save $200/month' },
        { id: 2, type: 'success', message: 'Good savings rate', recommendation: 'Consider investing', impact: 'Grow wealth' },
      ];
    }
  },
};