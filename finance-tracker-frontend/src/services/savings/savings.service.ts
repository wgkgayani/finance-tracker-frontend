// src/services/savings/savings.service.ts

import api from "@/lib/api/axios.config";
import {
  SavingsGoal,
  SavingsGoalRequest,
  SavingsProgress,
} from "@/types/savings.types";

// Mock data for development
let mockSavingsGoals: SavingsGoal[] = [
  {
    id: 1,
    userId: 1,
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 6500,
    deadline: "2024-12-31",
    category: "Savings",
    priority: "high",
    notes: "6 months of expenses",
    automaticSaving: true,
    monthlyContribution: 500,
    status: "active",
    progress: 65,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    name: "Vacation to Bali",
    targetAmount: 3000,
    currentAmount: 1200,
    deadline: "2024-08-15",
    category: "Travel",
    priority: "medium",
    notes: "Summer vacation",
    automaticSaving: false,
    monthlyContribution: 200,
    status: "active",
    progress: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    userId: 1,
    name: "New Laptop",
    targetAmount: 1500,
    currentAmount: 1500,
    deadline: "2024-03-01",
    category: "Electronics",
    priority: "medium",
    notes: "For work",
    automaticSaving: false,
    monthlyContribution: 0,
    status: "completed",
    progress: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const savingsService = {
  getAll: async (status?: string): Promise<SavingsGoal[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        let goals = [...mockSavingsGoals];
        if (status) {
          goals = goals.filter((g) => g.status === status);
        }
        return goals;
      }

      const params = new URLSearchParams();
      if (status) params.append("status", status);
      const response = await api.get(`/savings/goals?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching savings goals:", error);
      return [];
    }
  },

  getById: async (id: number): Promise<SavingsGoal> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const goal = mockSavingsGoals.find((g) => g.id === id);
      if (!goal) throw new Error("Savings goal not found");
      return goal;
    }

    const response = await api.get(`/savings/goals/${id}`);
    return response.data;
  },

  create: async (data: SavingsGoalRequest): Promise<SavingsGoal> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newGoal: SavingsGoal = {
        id: mockSavingsGoals.length + 1,
        userId: 1,
        currentAmount: 0,
        status: "active",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };

      mockSavingsGoals.push(newGoal);
      return newGoal;
    }

    const response = await api.post("/savings/goals", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<SavingsGoalRequest>,
  ): Promise<SavingsGoal> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = mockSavingsGoals.findIndex((g) => g.id === id);
      if (index === -1) throw new Error("Savings goal not found");

      mockSavingsGoals[index] = {
        ...mockSavingsGoals[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return mockSavingsGoals[index];
    }

    const response = await api.put(`/savings/goals/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      mockSavingsGoals = mockSavingsGoals.filter((g) => g.id !== id);
      return;
    }

    await api.delete(`/savings/goals/${id}`);
  },

  addContribution: async (id: number, amount: number): Promise<SavingsGoal> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = mockSavingsGoals.findIndex((g) => g.id === id);
      if (index === -1) throw new Error("Savings goal not found");

      const goal = mockSavingsGoals[index];
      const newAmount = goal.currentAmount + amount;
      const progress = (newAmount / goal.targetAmount) * 100;

      mockSavingsGoals[index] = {
        ...goal,
        currentAmount: newAmount,
        progress: Math.min(progress, 100),
        status: progress >= 100 ? "completed" : "active",
        updatedAt: new Date().toISOString(),
      };
      return mockSavingsGoals[index];
    }

    const response = await api.post(`/savings/goals/${id}/contribute`, {
      amount,
    });
    return response.data;
  },

  getProgress: async (id: number): Promise<SavingsProgress> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const goal = mockSavingsGoals.find((g) => g.id === id);
      if (!goal) throw new Error("Savings goal not found");

      const remainingAmount = goal.targetAmount - goal.currentAmount;
      const percentageComplete = (goal.currentAmount / goal.targetAmount) * 100;
      const today = new Date();
      const deadlineDate = new Date(goal.deadline);
      const remainingDays = Math.max(
        0,
        Math.ceil(
          (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );

      const monthlyRecommended =
        remainingAmount / Math.max(1, remainingDays / 30);
      const dailyRecommended = remainingAmount / Math.max(1, remainingDays);

      return {
        goal,
        percentageComplete,
        remainingAmount,
        remainingDays,
        monthlyRecommended,
        onTrack: goal.monthlyContribution
          ? goal.monthlyContribution >= monthlyRecommended
          : false,
        projectedCompletionDate: new Date(
          today.getTime() +
            (remainingAmount / (goal.monthlyContribution || 1)) *
              30 *
              24 *
              60 *
              60 *
              1000,
        ).toISOString(),
        dailyRecommended,
      };
    }

    const response = await api.get(`/savings/goals/${id}/progress`);
    return response.data;
  },

  getSummary: async (): Promise<any> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const activeGoals = mockSavingsGoals.filter((g) => g.status === "active");
      const completedGoals = mockSavingsGoals.filter(
        (g) => g.status === "completed",
      );

      return {
        totalGoals: mockSavingsGoals.length,
        activeGoals: activeGoals.length,
        completedGoals: completedGoals.length,
        totalTargetAmount: mockSavingsGoals.reduce(
          (sum, g) => sum + g.targetAmount,
          0,
        ),
        totalSavedAmount: mockSavingsGoals.reduce(
          (sum, g) => sum + g.currentAmount,
          0,
        ),
        overallProgress:
          (mockSavingsGoals.reduce((sum, g) => sum + g.currentAmount, 0) /
            mockSavingsGoals.reduce((sum, g) => sum + g.targetAmount, 0)) *
          100,
        nearestDeadline:
          activeGoals.sort(
            (a, b) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
          )[0]?.deadline || "No active goals",
      };
    }

    const response = await api.get("/savings/summary");
    return response.data;
  },

  getRecommendations: async (): Promise<any[]> => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const recommendations = [];
      const activeGoals = mockSavingsGoals.filter((g) => g.status === "active");

      for (const goal of activeGoals) {
        const progress = await savingsService.getProgress(goal.id);
        if (!progress.onTrack) {
          recommendations.push({
            id: goal.id,
            goalName: goal.name,
            message: `You're behind on your "${goal.name}" savings goal.`,
            recommendation: `Increase your monthly contribution to $${Math.ceil(progress.monthlyRecommended)}`,
            impact: `This will help you reach your goal on time by ${new Date(goal.deadline).toLocaleDateString()}`,
          });
        }
      }

      return recommendations;
    }

    const response = await api.get("/savings/recommendations");
    return response.data;
  },
};
