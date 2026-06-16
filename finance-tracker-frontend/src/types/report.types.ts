// src/types/report.types.ts

export type ReportType = "monthly" | "quarterly" | "yearly" | "custom";
export type ReportFormat = "pdf" | "excel" | "csv";
export type ReportStatus = "generating" | "ready" | "failed";

export interface ReportFilters {
  startDate: string;
  endDate: string;
  categories?: string[];
  type?: "all" | "income" | "expense";
  includeCharts?: boolean;
  includeTransactions?: boolean;
  includeBudgets?: boolean;
  includeSavings?: boolean;
}

export interface ReportData {
  id: string;
  title: string;
  type: ReportType;
  format: ReportFormat;
  generatedAt: string;
  status: ReportStatus;
  filters: ReportFilters;
  summary: ReportSummary;
  charts: ReportChart[];
  transactions: ReportTransaction[];
  budgets: ReportBudget[];
  savings: ReportSavings[];
  insights: string[];
}

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  averageDailySpending: number;
  transactionCount: number;
  topCategory: string;
  topCategoryAmount: number;
}

export interface ReportChart {
  type: "pie" | "bar" | "line" | "area";
  title: string;
  data: Array<{
    label: string;
    value: number;
    [key: string]: any;
  }>;
}

export interface ReportTransaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
}

export interface ReportBudget {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface ReportSavings {
  goalName: string;
  target: number;
  saved: number;
  percentage: number;
  deadline: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  defaultFilters: ReportFilters;
  isDefault: boolean;
}

export interface ExportOptions {
  format: ReportFormat;
  includeCharts: boolean;
  includeSummary: boolean;
  includeTransactions: boolean;
  pageSize?: "A4" | "Letter" | "A3";
  orientation?: "portrait" | "landscape";
}
