// src/types/savings.types.ts
export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
  priority: "low" | "medium" | "high";
  notes?: string;
  automaticSaving?: boolean;
  monthlyContribution?: number;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoalRequest {
  name: string;
  targetAmount: number;
  deadline: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  monthlyContribution?: number;
}

export interface SavingsProgress {
  goal: SavingsGoal;
  percentageComplete: number;
  remainingAmount: number;
  remainingDays: number;
  monthlyRecommended: number;
  onTrack: boolean;
  projectedCompletionDate: string;
}
