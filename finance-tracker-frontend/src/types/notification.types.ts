// src/types/notification.types.ts

export type NotificationType =
  | "budget_alert"
  | "transaction_alert"
  | "savings_goal"
  | "ai_insight"
  | "system"
  | "reminder"
  | "achievement";

export type NotificationPriority = "low" | "medium" | "high" | "critical";
export type NotificationStatus = "unread" | "read" | "archived";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  icon?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    budget_alert: boolean;
    transaction_alert: boolean;
    savings_goal: boolean;
    ai_insight: boolean;
    system: boolean;
    reminder: boolean;
    achievement: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationSummary {
  total: number;
  unread: number;
  highPriority: number;
  recent: Notification[];
  categories: {
    budget_alert: number;
    transaction_alert: number;
    savings_goal: number;
    ai_insight: number;
    system: number;
    reminder: number;
    achievement: number;
  };
}
