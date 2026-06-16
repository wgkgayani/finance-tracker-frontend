// src/hooks/useNotifications.ts

"use client";

import { useNotifications as useNotificationContext } from "@/context/NotificationContext";

export function useNotifications() {
  const context = useNotificationContext();

  return {
    ...context,
    // Additional helper methods
    getUnreadCount: () => context.unreadCount,
    hasUnread: () => context.unreadCount > 0,
    getByType: (type: string) =>
      context.notifications.filter((n) => n.type === type),
    getByPriority: (priority: string) =>
      context.notifications.filter((n) => n.priority === priority),
    getRecent: (limit: number = 5) => context.notifications.slice(0, limit),
  };
}
