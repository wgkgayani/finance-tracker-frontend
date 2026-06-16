// src/context/NotificationContext.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Notification, NotificationSummary } from "@/types/notification.types";
import { notificationService } from "@/services/notifications/notification.service";
import toast from "react-hot-toast";

interface NotificationContextType {
  notifications: Notification[];
  summary: NotificationSummary | null;
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archive: (id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [notificationsData, summaryData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getSummary(),
      ]);
      setNotifications(notificationsData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const unreadCount = summary?.unread || 0;

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      await fetchData();
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await fetchData();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const archive = async (id: string) => {
    try {
      await notificationService.archive(id);
      await fetchData();
    } catch (error) {
      toast.error("Failed to archive notification");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.delete(id);
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        summary,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        archive,
        delete: deleteNotification,
        refresh: fetchData,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
