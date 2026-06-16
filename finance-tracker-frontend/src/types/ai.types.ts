// src/types/ai.types.ts
export interface AIInsight {
  id: string;
  userId: string;
  type: "spending" | "saving" | "budget" | "investment" | "general";
  severity: "info" | "warning" | "critical" | "success";
  title: string;
  message: string;
  recommendation: string;
  impact: string;
  actionUrl?: string;
  metric?: number;
  comparison?: number;
  category?: string;
  read: boolean;
  createdAt: string;
}

export interface SpendingPrediction {
  category: string;
  predictedAmount: number;
  confidence: number;
  factors: string[];
}

export interface BudgetRecommendation {
  category: string;
  currentBudget: number;
  recommendedBudget: number;
  reasoning: string;
  potentialSavings: number;
}

export interface FinancialHealthScore {
  overall: number;
  categories: {
    savings: number;
    spending: number;
    budgeting: number;
    consistency: number;
    goalProgress: number;
  };
  recommendations: string[];
  percentile: number;
}

export interface MonthlyForecast {
  month: string;
  predictedIncome: number;
  predictedExpenses: number;
  predictedSavings: number;
  confidence: number;
  riskFactors: string[];
}
