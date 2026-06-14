// src/services/budgets/budget.service.ts
import api from '@/lib/api/axios.config';

export interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  month: number;
  year: number;
  userId: number;
}

export const budgetService = {
  getAll: async (): Promise<Budget[]> => {
    try {
      const response = await api.get('/budgets');
      return response.data;
    } catch (error) {
      console.warn('Using mock budget data');
      return getMockBudgets();
    }
  },

  create: async (data: Partial<Budget>): Promise<Budget> => {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Budget>): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },
};

function getMockBudgets(): Budget[] {
  return [
    { id: 1, category: 'Food', limit: 800, spent: 650, month: 1, year: 2024, userId: 1 },
    { id: 2, category: 'Transport', limit: 300, spent: 245, month: 1, year: 2024, userId: 1 },
    { id: 3, category: 'Shopping', limit: 400, spent: 380, month: 1, year: 2024, userId: 1 },
  ];
}