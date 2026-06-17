// src/components/notifications/NotificationList.tsx

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellIcon, BellOffIcon } from "lucide-react";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/types/notification.types";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => Promise<void>;
  onViewAll?: () => void;
  compact?: boolean;
  className?: string;
}

export default function NotificationList({
  notifications,
  onMarkAsRead,
  onViewAll,
  compact = false,
  className = "",
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BellOffIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="font-medium text-gray-900">No notifications</h4>
        <p className="text-sm text-gray-500 mt-1">
          You're all caught up! Check back later for updates.
        </p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="divide-y divide-gray-100">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NotificationItem
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              compact={compact}
            />
          </motion.div>
        ))}
      </div>

      {onViewAll && notifications.length > 5 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onViewAll}
            className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
