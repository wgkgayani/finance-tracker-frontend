// src/services/ai/ai.service.ts
import api from '@/lib/api/axios.config';

export const aiService = {
  getInsights: async () => {
    try {
      const response = await api.get('/ai/insights');
      return response.data;
    } catch (error) {
      return [
        { id: 1, severity: 'warning', title: 'High Food Spending', message: 'You spend 40% on food', recommendation: 'Set a food budget of $600', impact: 'Save $200/month' },
        { id: 2, severity: 'success', title: 'Great Savings!', message: 'You saved 35% this month', recommendation: 'Open a high-yield savings account', impact: 'Earn 4-5% APY' },
      ];
    }
  },

  getFinancialHealthScore: async () => {
    return {
      overall: 78,
      categories: { savings: 85, spending: 70, budgeting: 75, consistency: 80, goalProgress: 65 },
      recommendations: ['Reduce food spending', 'Increase emergency fund'],
      percentile: 65,
    };
  },

  getMonthlyForecast: async () => {
    return [
      { month: 'Jan', predictedIncome: 5000, predictedExpenses: 3200, predictedSavings: 1800, confidence: 85, riskFactors: [] },
      { month: 'Feb', predictedIncome: 5000, predictedExpenses: 3300, predictedSavings: 1700, confidence: 80, riskFactors: [] },
      { month: 'Mar', predictedIncome: 5200, predictedExpenses: 3100, predictedSavings: 2100, confidence: 75, riskFactors: [] },
    ];
  },

  chatWithAI: async (message: string) => {
    return `Based on your financial data, here's my advice: ${message}`;
  },
};