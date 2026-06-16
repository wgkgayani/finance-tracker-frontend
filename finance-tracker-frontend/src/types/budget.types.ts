// src/types/budget.types.ts

export interface Budget {
  id: number;
  userId: number;
  category: string;
  limit: number;
  spent: number;
  month: number;
  year: number;
  alertsEnabled: boolean;
  alertThreshold: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetRequest {
  category: string;
  limit: number;
  month: number;
  year: number;
  alertsEnabled?: boolean;
  alertThreshold?: number;
  notes?: string;
}

export interface BudgetPerformance {
  budget: Budget;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: "good" | "warning" | "critical" | "exceeded";
  dailyAverage: number;
  daysRemaining: number;
  recommendedDailyLimit: number;
}

export interface BudgetAlert {
  id: number;
  category: string;
  message: string;
  severity: "info" | "warning" | "critical";
  read: boolean;
  createdAt: string;
}
