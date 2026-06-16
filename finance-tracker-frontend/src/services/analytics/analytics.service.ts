// src/services/analytics/analytics.service.ts

import api from "@/lib/api/axios.config";
import {
  AnalyticsSummary,
  CategorySpending,
  MonthlyTrend,
  CashFlowData,
  SpendingInsight,
  AnalyticsFilters,
} from "@/types/analytics.types";

// Mock data for development
const mockTransactions = [
  {
    id: 1,
    amount: 5000,
    type: "INCOME",
    category: "Salary",
    date: "2024-01-15",
    description: "Monthly Salary",
  },
  {
    id: 2,
    amount: 150,
    type: "EXPENSE",
    category: "Food",
    date: "2024-01-20",
    description: "Grocery Store",
  },
  {
    id: 3,
    amount: 25,
    type: "EXPENSE",
    category: "Transport",
    date: "2024-01-14",
    description: "Uber Ride",
  },
  {
    id: 4,
    amount: 200,
    type: "EXPENSE",
    category: "Shopping",
    date: "2024-01-13",
    description: "Amazon",
  },
  {
    id: 5,
    amount: 15,
    type: "EXPENSE",
    category: "Entertainment",
    date: "2024-01-19",
    description: "Netflix",
  },
  {
    id: 6,
    amount: 450,
    type: "EXPENSE",
    category: "Bills",
    date: "2024-01-10",
    description: "Electric Bill",
  },
  {
    id: 7,
    amount: 250,
    type: "EXPENSE",
    category: "Food",
    date: "2024-01-05",
    description: "Restaurant",
  },
  {
    id: 8,
    amount: 300,
    type: "EXPENSE",
    category: "Transport",
    date: "2024-01-08",
    description: "Car Maintenance",
  },
  {
    id: 9,
    amount: 5000,
    type: "INCOME",
    category: "Freelance",
    date: "2024-01-25",
    description: "Project Payment",
  },
  {
    id: 10,
    amount: 100,
    type: "EXPENSE",
    category: "Healthcare",
    date: "2024-01-18",
    description: "Pharmacy",
  },
];

export const analyticsService = {
  getSummary: async (filters?: AnalyticsFilters): Promise<AnalyticsSummary> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return getMockSummary();
      }

      const response = await api.get("/analytics/summary", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      return getMockSummary();
    }
  },

  getCategorySpending: async (
    filters?: AnalyticsFilters,
  ): Promise<CategorySpending[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return getMockCategorySpending();
      }

      const response = await api.get("/analytics/categories", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching category spending:", error);
      return getMockCategorySpending();
    }
  },

  getMonthlyTrends: async (months: number = 6): Promise<MonthlyTrend[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return getMockMonthlyTrends(months);
      }

      const response = await api.get(`/analytics/trends?months=${months}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly trends:", error);
      return getMockMonthlyTrends(months);
    }
  },

  getCashFlow: async (days: number = 30): Promise<CashFlowData[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return getMockCashFlow(days);
      }

      const response = await api.get(`/analytics/cashflow?days=${days}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cash flow:", error);
      return getMockCashFlow(days);
    }
  },

  getInsights: async (): Promise<SpendingInsight[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return getMockInsights();
      }

      const response = await api.get("/analytics/insights");
      return response.data;
    } catch (error) {
      console.error("Error fetching insights:", error);
      return getMockInsights();
    }
  },

  getTopCategories: async (limit: number = 5): Promise<TopCategory[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return getMockTopCategories(limit);
      }

      const response = await api.get(
        `/analytics/top-categories?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching top categories:", error);
      return getMockTopCategories(limit);
    }
  },

  // Fixed export function with proper error handling
  exportAnalytics: async (
    format: "pdf" | "excel",
    filters?: AnalyticsFilters,
  ): Promise<Blob> => {
    try {
      // In development, generate mock export
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate mock data for export
        const data = {
          summary: getMockSummary(),
          categories: getMockCategorySpending(),
          trends: getMockMonthlyTrends(6),
          cashflow: getMockCashFlow(30),
          generatedAt: new Date().toISOString(),
        };

        // Create a text blob as mock export
        const content = JSON.stringify(data, null, 2);
        const blob = new Blob([content], {
          type:
            format === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        return blob;
      }

      // In production, call the real API
      const response = await api.post(
        "/analytics/export",
        { format, filters },
        {
          responseType: "blob",
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error exporting analytics:", error);
      throw error;
    }
  },

  // Helper function to download export
  downloadExport: async (format: "pdf" | "excel", filename?: string) => {
    try {
      const blob = await analyticsService.exportAnalytics(format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `analytics-report.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading export:", error);
      throw error;
    }
  },
};

// Mock data generators (same as before)
function getMockSummary(): AnalyticsSummary {
  const totalIncome = 10000;
  const totalExpense = 3250;
  const netSavings = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate: (netSavings / totalIncome) * 100,
    averageDailySpending: totalExpense / 30,
    monthlyAverage: totalExpense,
    highestSpendingDay: "2024-01-20",
    highestSpendingAmount: 450,
    transactionCount: mockTransactions.length,
    incomeCount: mockTransactions.filter((t) => t.type === "INCOME").length,
    expenseCount: mockTransactions.filter((t) => t.type === "EXPENSE").length,
  };
}

function getMockCategorySpending(): CategorySpending[] {
  const categories: Record<string, number> = {};
  mockTransactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

  const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

  return Object.entries(categories).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / total) * 100,
    transactionCount: mockTransactions.filter((t) => t.category === category)
      .length,
    averageAmount:
      amount / mockTransactions.filter((t) => t.category === category).length,
  }));
}

function getMockMonthlyTrends(months: number): MonthlyTrend[] {
  const trends = [];
  const currentDate = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);

    trends.push({
      month: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
      income: 4500 + Math.random() * 1500,
      expense: 2800 + Math.random() * 800,
      savings: 4500 + Math.random() * 1500 - (2800 + Math.random() * 800),
      transactionCount: Math.floor(Math.random() * 30) + 10,
    });
  }

  return trends;
}

function getMockCashFlow(days: number): CashFlowData[] {
  const data = [];
  const currentDate = new Date();
  let balance = 5000;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);

    const income =
      Math.random() > 0.8 ? Math.floor(Math.random() * 1000) + 500 : 0;
    const expense = Math.floor(Math.random() * 200) + 50;
    balance += income - expense;

    data.push({
      date: date.toISOString().split("T")[0],
      income,
      expense,
      balance: Math.max(balance, 0),
    });
  }

  return data;
}

function getMockInsights(): SpendingInsight[] {
  return [
    {
      type: "warning",
      title: "High Food Spending",
      message: "You are spending 40% of your budget on food.",
      recommendation: "Consider reducing dining out and meal prepping.",
      metric: 40,
      comparison: 10,
    },
    {
      type: "success",
      title: "Excellent Savings Rate",
      message: "You are saving 35% of your income.",
      recommendation: "Consider investing your savings for better returns.",
      metric: 35,
      comparison: 15,
    },
    {
      type: "info",
      title: "Transportation Costs",
      message: "Your transport expenses have increased by 15%.",
      recommendation: "Consider carpooling or public transport.",
      metric: 15,
      comparison: 5,
    },
    {
      type: "danger",
      title: "High Bill Payments",
      message: "Utility bills are 20% higher than last month.",
      recommendation: "Check for energy-efficient alternatives.",
      metric: 20,
      comparison: 10,
    },
  ];
}

function getMockTopCategories(limit: number): TopCategory[] {
  const categories = [
    { category: "Food", amount: 1200, percentage: 37 },
    { category: "Shopping", amount: 800, percentage: 25 },
    { category: "Bills", amount: 500, percentage: 15 },
    { category: "Transport", amount: 450, percentage: 14 },
    { category: "Entertainment", amount: 300, percentage: 9 },
  ];

  return categories.slice(0, limit).map((cat) => ({
    ...cat,
    trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as
      | "up"
      | "down"
      | "stable",
    changePercentage: Math.round((Math.random() * 20 - 10) * 10) / 10,
  }));
}
