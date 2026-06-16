// src/types/analytics.types.ts

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  averageDailySpending: number;
  monthlyAverage: number;
  highestSpendingDay: string;
  highestSpendingAmount: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  averageAmount: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  income: number;
  expense: number;
  savings: number;
  transactionCount: number;
}

export interface CashFlowData {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface SpendingInsight {
  type: "warning" | "success" | "info" | "danger";
  title: string;
  message: string;
  recommendation?: string;
  metric?: number;
  comparison?: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  categories?: string[];
  type?: "all" | "income" | "expense";
  period?: "day" | "week" | "month" | "year";
}

export interface TopCategory {
  category: string;
  amount: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  changePercentage: number;
}
