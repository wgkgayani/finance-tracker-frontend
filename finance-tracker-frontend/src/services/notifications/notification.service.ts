// src/services/notifications/notification.service.ts

import api from "@/lib/api/axios.config";
import {
  Notification,
  NotificationSummary,
  NotificationPreferences,
} from "@/types/notification.types";

// Mock data for development
let mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    title: "Budget Alert: Food",
    message: "You have used 85% of your food budget this month",
    type: "budget_alert",
    priority: "high",
    status: "unread",
    icon: "⚠️",
    actionUrl: "/budgets",
    actionLabel: "View Budget",
    metadata: { category: "Food", percentage: 85 },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "2",
    userId: "1",
    title: "Savings Goal Progress",
    message: "You're 75% towards your Emergency Fund goal!",
    type: "savings_goal",
    priority: "medium",
    status: "unread",
    icon: "🎯",
    actionUrl: "/savings-goals",
    actionLabel: "View Progress",
    metadata: { goal: "Emergency Fund", progress: 75 },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "3",
    userId: "1",
    title: "AI Insight: Spending Pattern",
    message: "Your dining out expenses have increased by 25% this month",
    type: "ai_insight",
    priority: "medium",
    status: "read",
    icon: "🤖",
    actionUrl: "/ai-insights",
    actionLabel: "View Insights",
    metadata: { category: "Dining", increase: 25 },
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "4",
    userId: "1",
    title: "Transaction Alert",
    message: "Large transaction detected: $2,500 at Amazon",
    type: "transaction_alert",
    priority: "critical",
    status: "unread",
    icon: "💳",
    actionUrl: "/transactions",
    actionLabel: "View Transaction",
    metadata: { amount: 2500, merchant: "Amazon" },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "5",
    userId: "1",
    title: "Achievement Unlocked!",
    message: "You've successfully saved $10,000!",
    type: "achievement",
    priority: "low",
    status: "read",
    icon: "🏆",
    actionUrl: "/savings-goals",
    actionLabel: "Celebrate",
    metadata: { achievement: "10k_savings" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export const notificationService = {
  // Get all notifications
  getNotifications: async (status?: string): Promise<Notification[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        let notifications = [...mockNotifications];
        if (status === "unread") {
          notifications = notifications.filter((n) => n.status === "unread");
        } else if (status === "read") {
          notifications = notifications.filter((n) => n.status === "read");
        }
        return notifications.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      }

      const params = new URLSearchParams();
      if (status) params.append("status", status);
      const response = await api.get(`/notifications?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  // Get notification summary
  getSummary: async (): Promise<NotificationSummary> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const notifications = mockNotifications;
        const unread = notifications.filter((n) => n.status === "unread");

        return {
          total: notifications.length,
          unread: unread.length,
          highPriority: notifications.filter(
            (n) =>
              n.priority === "high" ||
              (n.priority === "critical" && n.status === "unread"),
          ).length,
          recent: notifications.slice(0, 5),
          categories: {
            budget_alert: notifications.filter((n) => n.type === "budget_alert")
              .length,
            transaction_alert: notifications.filter(
              (n) => n.type === "transaction_alert",
            ).length,
            savings_goal: notifications.filter((n) => n.type === "savings_goal")
              .length,
            ai_insight: notifications.filter((n) => n.type === "ai_insight")
              .length,
            system: notifications.filter((n) => n.type === "system").length,
            reminder: notifications.filter((n) => n.type === "reminder").length,
            achievement: notifications.filter((n) => n.type === "achievement")
              .length,
          },
        };
      }

      const response = await api.get("/notifications/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching notification summary:", error);
      return {
        total: 0,
        unread: 0,
        highPriority: 0,
        recent: [],
        categories: {
          budget_alert: 0,
          transaction_alert: 0,
          savings_goal: 0,
          ai_insight: 0,
          system: 0,
          reminder: 0,
          achievement: 0,
        },
      };
    }
  },

  // Mark a notification as read
  markAsRead: async (id: string): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const index = mockNotifications.findIndex((n) => n.id === id);
        if (index !== -1) {
          mockNotifications[index].status = "read";
          mockNotifications[index].readAt = new Date().toISOString();
        }
        return;
      }

      await api.patch(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockNotifications = mockNotifications.map((n) => ({
          ...n,
          status: "read",
          readAt: new Date().toISOString(),
        }));
        return;
      }

      await api.patch("/notifications/read-all");
    } catch (error) {
      console.error("Error marking all as read:", error);
      throw error;
    }
  },

  // Archive a notification
  archive: async (id: string): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const index = mockNotifications.findIndex((n) => n.id === id);
        if (index !== -1) {
          mockNotifications[index].status = "archived";
        }
        return;
      }

      await api.patch(`/notifications/${id}/archive`);
    } catch (error) {
      console.error("Error archiving notification:", error);
      throw error;
    }
  },

  // Delete a notification
  delete: async (id: string): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        mockNotifications = mockNotifications.filter((n) => n.id !== id);
        return;
      }

      await api.delete(`/notifications/${id}`);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Get user preferences
  getPreferences: async (): Promise<NotificationPreferences> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return {
          email: true,
          push: true,
          inApp: true,
          types: {
            budget_alert: true,
            transaction_alert: true,
            savings_goal: true,
            ai_insight: true,
            system: true,
            reminder: true,
            achievement: true,
          },
          quietHours: {
            enabled: false,
            start: "22:00",
            end: "07:00",
          },
        };
      }

      const response = await api.get("/notifications/preferences");
      return response.data;
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return {
        email: true,
        push: true,
        inApp: true,
        types: {
          budget_alert: true,
          transaction_alert: true,
          savings_goal: true,
          ai_insight: true,
          system: true,
          reminder: true,
          achievement: true,
        },
        quietHours: {
          enabled: false,
          start: "22:00",
          end: "07:00",
        },
      };
    }
  },

  // Update preferences
  updatePreferences: async (
    preferences: Partial<NotificationPreferences>,
  ): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Preferences updated:", preferences);
        return;
      }

      await api.put("/notifications/preferences", preferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  },
};
