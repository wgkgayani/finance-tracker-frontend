// src/types/budget.types.ts
export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
  alertsEnabled: boolean;
  alertThreshold: number; // percentage (e.g., 80 for 80%)
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetRequest {
  category: string;
  amount: number;
  month: number;
  year: number;
  alertsEnabled?: boolean;
  alertThreshold?: number;
}

export interface BudgetPerformance {
  budget: Budget;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: "good" | "warning" | "critical" | "exceeded";
  projectedSpending: number;
  dailyAverage: number;
  daysRemaining: number;
  recommendedDailyLimit: number;
}

export interface BudgetAlert {
  id: string;
  userId: string;
  budgetId: string;
  category: string;
  message: string;
  severity: "info" | "warning" | "critical";
  read: boolean;
  createdAt: string;
}
