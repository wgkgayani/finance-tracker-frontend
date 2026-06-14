// src/types/transaction.types.ts
export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

export enum TransactionCategory {
  // Income Categories
  SALARY = "SALARY",
  FREELANCE = "FREELANCE",
  INVESTMENT = "INVESTMENT",
  GIFT = "GIFT",
  REFUND = "REFUND",
  OTHER_INCOME = "OTHER_INCOME",

  // Expense Categories
  FOOD = "FOOD",
  TRANSPORT = "TRANSPORT",
  SHOPPING = "SHOPPING",
  ENTERTAINMENT = "ENTERTAINMENT",
  BILLS = "BILLS",
  HEALTHCARE = "HEALTHCARE",
  EDUCATION = "EDUCATION",
  HOUSING = "HOUSING",
  CLOTHING = "CLOTHING",
  PERSONAL_CARE = "PERSONAL_CARE",
  SUBSCRIPTIONS = "SUBSCRIPTIONS",
  DINING_OUT = "DINING_OUT",
  GROCERIES = "GROCERIES",
  INSURANCE = "INSURANCE",
  TAXES = "TAXES",
  OTHER_EXPENSE = "OTHER_EXPENSE",
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory | string;
  description: string;
  date: string;
  notes?: string;
  attachments?: string[];
  tags?: string[];
  location?: string;
  recurring?: boolean;
  recurringId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRequest {
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
  notes?: string;
  tags?: string[];
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: "date" | "amount" | "category";
  sortOrder?: "asc" | "desc";
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  averageDailySpending: number;
  topCategory: string;
  topCategoryAmount: number;
  transactionCount: number;
}
