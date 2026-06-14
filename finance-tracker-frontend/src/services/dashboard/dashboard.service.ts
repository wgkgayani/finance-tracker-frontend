// src/services/dashboard/dashboard.service.ts
import api from '@/lib/api/axios.config';

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  savingsRate: number;
  remainingBudget: number;
  budgetUsage: number;
  healthScore: number;
  categorySpending: Array<{ category: string; amount: number }>;
  recentTransactions: Array<any>;
  budgets: Array<any>;
  insights: Array<{ type: string; message: string; action: string }>;
}

export const dashboardService = {
  getDashboard: async (): Promise<DashboardData> => {
    try {
      const response = await api.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      // Return mock data if API is not ready
      console.warn('Using mock dashboard data - backend not connected');
      return getMockDashboardData();
    }
  },

  getFinancialSummary: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await api.get(`/dashboard/summary?period=${period}`);
    return response.data;
  },

  getRecentActivity: async (limit: number = 10) => {
    const response = await api.get(`/dashboard/recent?limit=${limit}`);
    return response.data;
  },
};

// Mock data for when backend is not ready
function getMockDashboardData(): DashboardData {
  return {
    totalIncome: 5250,
    totalExpense: 3250,
    savings: 2000,
    savingsRate: 38.1,
    remainingBudget: 850,
    budgetUsage: 65,
    healthScore: 78,
    categorySpending: [
      { category: 'Food', amount: 1200 },
      { category: 'Transport', amount: 450 },
      { category: 'Shopping', amount: 800 },
      { category: 'Entertainment', amount: 300 },
      { category: 'Bills', amount: 500 },
    ],
    recentTransactions: [
      { id: 1, description: 'Grocery Store', amount: 150, category: 'Food', type: 'EXPENSE', date: '2024-01-20' },
      { id: 2, description: 'Netflix', amount: 15, category: 'Entertainment', type: 'EXPENSE', date: '2024-01-19' },
      { id: 3, description: 'Salary', amount: 5000, category: 'Salary', type: 'INCOME', date: '2024-01-15' },
      { id: 4, description: 'Uber Ride', amount: 25, category: 'Transport', type: 'EXPENSE', date: '2024-01-14' },
      { id: 5, description: 'Amazon', amount: 200, category: 'Shopping', type: 'EXPENSE', date: '2024-01-13' },
    ],
    budgets: [
      { category: 'Food', limit: 800, spent: 650, remaining: 150 },
      { category: 'Transport', limit: 300, spent: 245, remaining: 55 },
      { category: 'Shopping', limit: 400, spent: 380, remaining: 20 },
      { category: 'Entertainment', limit: 200, spent: 150, remaining: 50 },
    ],
    insights: [
      { type: 'warning', message: 'Food spending is 40% above your budget', action: 'Review grocery expenses' },
      { type: 'success', message: 'You saved 35% of your income this month', action: 'Keep it up!' },
      { type: 'info', message: 'Subscription expenses increased by 15%', action: 'Review subscriptions' },
    ],
  };
}