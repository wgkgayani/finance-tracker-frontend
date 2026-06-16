// src/services/budgets/budget.service.ts

import api from "@/lib/api/axios.config";
import { Budget, BudgetRequest } from "@/types/budget.types";

// Mock data for development
let mockBudgets: Budget[] = [
  {
    id: 1,
    userId: 1,
    category: "Food",
    limit: 800,
    spent: 650,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    alertsEnabled: true,
    alertThreshold: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    category: "Transport",
    limit: 300,
    spent: 245,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    alertsEnabled: true,
    alertThreshold: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    userId: 1,
    category: "Shopping",
    limit: 400,
    spent: 380,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    alertsEnabled: true,
    alertThreshold: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    userId: 1,
    category: "Entertainment",
    limit: 200,
    spent: 150,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    alertsEnabled: true,
    alertThreshold: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    userId: 1,
    category: "Bills",
    limit: 1000,
    spent: 950,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    alertsEnabled: true,
    alertThreshold: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const budgetService = {
  getAll: async (month?: number, year?: number): Promise<Budget[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        let budgets = [...mockBudgets];

        if (month && year) {
          budgets = budgets.filter((b) => b.month === month && b.year === year);
        }
        return budgets;
      }

      const params = new URLSearchParams();
      if (month) params.append("month", month.toString());
      if (year) params.append("year", year.toString());

      const response = await api.get(`/budgets?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching budgets:", error);
      return [];
    }
  },

  getById: async (id: number): Promise<Budget> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const budget = mockBudgets.find((b) => b.id === id);
      if (!budget) throw new Error("Budget not found");
      return budget;
    }

    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  create: async (data: BudgetRequest): Promise<Budget> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if budget already exists for this category/month/year
      const existing = mockBudgets.find(
        (b) =>
          b.category === data.category &&
          b.month === data.month &&
          b.year === data.year,
      );

      if (existing) {
        throw new Error("Budget already exists for this category this month");
      }

      const newBudget: Budget = {
        id: mockBudgets.length + 1,
        userId: 1,
        spent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        alertsEnabled: data.alertsEnabled ?? true,
        alertThreshold: data.alertThreshold ?? 80,
        notes: data.notes,
        ...data,
      };

      mockBudgets.push(newBudget);
      return newBudget;
    }

    const response = await api.post("/budgets", data);
    return response.data;
  },

  update: async (id: number, data: Partial<BudgetRequest>): Promise<Budget> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = mockBudgets.findIndex((b) => b.id === id);
      if (index === -1) throw new Error("Budget not found");

      mockBudgets[index] = {
        ...mockBudgets[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return mockBudgets[index];
    }

    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      mockBudgets = mockBudgets.filter((b) => b.id !== id);
      return;
    }

    await api.delete(`/budgets/${id}`);
  },

  getPerformance: async (id: number): Promise<any> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const budget = mockBudgets.find((b) => b.id === id);
      if (!budget) throw new Error("Budget not found");

      const remaining = budget.limit - budget.spent;
      const percentageUsed = (budget.spent / budget.limit) * 100;

      let status = "good";
      if (percentageUsed >= 100) status = "exceeded";
      else if (percentageUsed >= 90) status = "critical";
      else if (percentageUsed >= 75) status = "warning";

      const daysInMonth = new Date(budget.year, budget.month, 0).getDate();
      const daysRemaining = daysInMonth - new Date().getDate();
      const dailyAverage = budget.spent / (daysInMonth - daysRemaining);

      return {
        budget,
        spent: budget.spent,
        remaining,
        percentageUsed,
        status,
        dailyAverage: isNaN(dailyAverage) ? 0 : dailyAverage,
        daysRemaining,
        recommendedDailyLimit: remaining / daysRemaining,
      };
    }

    const response = await api.get(`/budgets/${id}/performance`);
    return response.data;
  },

  getAlerts: async (): Promise<any[]> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const alerts = [];
      for (const budget of mockBudgets) {
        const percentageUsed = (budget.spent / budget.limit) * 100;

        if (percentageUsed >= 100) {
          alerts.push({
            id: budget.id,
            category: budget.category,
            message: `You have exceeded your ${budget.category} budget by $${(budget.spent - budget.limit).toFixed(2)}`,
            severity: "critical",
            read: false,
            createdAt: new Date().toISOString(),
          });
        } else if (percentageUsed >= 90) {
          alerts.push({
            id: budget.id,
            category: budget.category,
            message: `You have used ${percentageUsed.toFixed(0)}% of your ${budget.category} budget`,
            severity: "warning",
            read: false,
            createdAt: new Date().toISOString(),
          });
        } else if (percentageUsed >= 75) {
          alerts.push({
            id: budget.id,
            category: budget.category,
            message: `You have used ${percentageUsed.toFixed(0)}% of your ${budget.category} budget`,
            severity: "info",
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
      return alerts;
    }

    const response = await api.get("/budgets/alerts");
    return response.data;
  },
};
