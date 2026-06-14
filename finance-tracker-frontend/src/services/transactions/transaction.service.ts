// src/services/transactions/transaction.service.ts
import api from '@/lib/api/axios.config';

export interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  date: string;
  createdAt: string;
  userId: number;
}

export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.warn('Using mock transaction data');
      return getMockTransactions();
    }
  },

  getById: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};

function getMockTransactions(): Transaction[] {
  return [
    { id: 1, amount: 5000, type: 'INCOME', category: 'Salary', description: 'Monthly Salary', date: '2024-01-15', createdAt: '2024-01-15T10:00:00Z', userId: 1 },
    { id: 2, amount: 150, type: 'EXPENSE', category: 'Food', description: 'Grocery Store', date: '2024-01-20', createdAt: '2024-01-20T14:30:00Z', userId: 1 },
    { id: 3, amount: 25, type: 'EXPENSE', category: 'Transport', description: 'Uber Ride', date: '2024-01-14', createdAt: '2024-01-14T09:15:00Z', userId: 1 },
  ];
}