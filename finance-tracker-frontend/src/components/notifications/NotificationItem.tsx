// src/components/notifications/NotificationItem.tsx

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArchiveIcon,
  TrashIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Notification } from "@/types/notification.types";
import { format, formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
  onArchive?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  compact?: boolean;
}

const typeIcons: Record<string, string> = {
  budget_alert: "💰",
  transaction_alert: "💳",
  savings_goal: "🎯",
  ai_insight: "🤖",
  system: "⚙️",
  reminder: "⏰",
  achievement: "🏆",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-600",
  high: "bg-yellow-100 text-yellow-600",
  critical: "bg-red-100 text-red-600",
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onArchive,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsRead = async () => {
    if (notification.status === "read") return;
    setIsLoading(true);
    try {
      await onMarkAsRead(notification.id);
    } finally {
      setIsLoading(false);
    }
  };

  const isUnread = notification.status === "unread";

  if (compact) {
    return (
      <div
        className={`p-3 transition-colors ${isUnread ? "bg-blue-50" : "hover:bg-gray-50"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-xl">
            {notification.icon || typeIcons[notification.type] || "📬"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm ${isUnread ? "font-semibold" : "font-medium"} text-gray-900 truncate`}
              >
                {notification.title}
              </p>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate">
              {notification.message}
            </p>
          </div>
          {isUnread && (
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 transition-all ${
        isUnread ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
      } ${isHovered ? "shadow-sm" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
            {notification.icon || typeIcons[notification.type] || "📬"}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4
                className={`text-sm ${isUnread ? "font-semibold" : "font-medium"} text-gray-900`}
              >
                {notification.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[notification.priority]}`}
                >
                  {notification.priority}
                </span>
                <span className="text-xs text-gray-400">
                  {format(
                    new Date(notification.createdAt),
                    "MMM dd, yyyy h:mm a",
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {isUnread && (
                <button
                  onClick={handleMarkAsRead}
                  disabled={isLoading}
                  className="p-1 text-blue-500 hover:text-blue-700 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
                  title="Mark as read"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                </button>
              )}
              {onArchive && (
                <button
                  onClick={() => onArchive(notification.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
                  title="Archive"
                >
                  <ArchiveIcon className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(notification.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

          {notification.actionUrl && (
            <a
              href={notification.actionUrl}
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-2 font-medium"
            >
              {notification.actionLabel || "View"}
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
