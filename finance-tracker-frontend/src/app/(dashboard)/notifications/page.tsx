// src/app/(dashboard)/notifications/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BellIcon,
  CheckCheckIcon,
  FilterIcon,
  ArchiveIcon,
  TrashIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import NotificationPreferences from "@/components/notifications/NotificationPreferences";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

type FilterType = "all" | "unread" | "read" | "archived";

export default function NotificationsPage() {
  const {
    notifications,
    summary,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    archive,
    delete: deleteNotification,
    refresh,
  } = useNotifications();

  const [filter, setFilter] = useState<FilterType>("all");
  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );
  const [showPreferences, setShowPreferences] = useState(false);
  const [isBulkAction, setIsBulkAction] = useState(false);

  useEffect(() => {
    let filtered = [...notifications];

    if (filter === "unread") {
      filtered = filtered.filter((n) => n.status === "unread");
    } else if (filter === "read") {
      filtered = filtered.filter((n) => n.status === "read");
    } else if (filter === "archived") {
      filtered = filtered.filter((n) => n.status === "archived");
    }

    setFilteredNotifications(filtered);
  }, [notifications, filter]);

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    setIsBulkAction(true);
    try {
      await Promise.all(selectedNotifications.map((id) => markAsRead(id)));
      toast.success(
        `${selectedNotifications.length} notifications marked as read`,
      );
      setSelectedNotifications([]);
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    } finally {
      setIsBulkAction(false);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedNotifications.length === 0) return;
    setIsBulkAction(true);
    try {
      await Promise.all(selectedNotifications.map((id) => archive(id)));
      toast.success(`${selectedNotifications.length} notifications archived`);
      setSelectedNotifications([]);
    } catch (error) {
      toast.error("Failed to archive notifications");
    } finally {
      setIsBulkAction(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;
    if (
      !window.confirm(`Delete ${selectedNotifications.length} notifications?`)
    )
      return;

    setIsBulkAction(true);
    try {
      await Promise.all(
        selectedNotifications.map((id) => deleteNotification(id)),
      );
      toast.success(`${selectedNotifications.length} notifications deleted`);
      setSelectedNotifications([]);
    } catch (error) {
      toast.error("Failed to delete notifications");
    } finally {
      setIsBulkAction(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "All caught up! No unread notifications"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <CheckCheckIcon className="w-4 h-4 mr-2" />
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <BellIcon className="w-4 h-4 mr-2" />
            Preferences
          </button>
          <button
            onClick={refresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCwIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FilterIcon className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="border-0 bg-transparent text-sm font-medium text-gray-700 focus:outline-none focus:ring-0"
              >
                <option value="all">All</option>
                <option value="unread">Unread ({unreadCount})</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">
                  {selectedNotifications.length}
                </span>
                <span>selected</span>
                <button
                  onClick={handleBulkMarkAsRead}
                  disabled={isBulkAction}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Mark read
                </button>
                <button
                  onClick={handleBulkArchive}
                  disabled={isBulkAction}
                  className="text-gray-600 hover:text-gray-700"
                >
                  Archive
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isBulkAction}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {filteredNotifications.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {selectedNotifications.length === filteredNotifications.length
                ? "Deselect all"
                : "Select all"}
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BellIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No notifications
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {filter === "all"
                ? "You have no notifications yet"
                : `No ${filter} notifications`}
            </p>
          </div>
        ) : (
          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onArchive={archive}
            onDelete={deleteNotification}
          />
        )}
      </div>

      {/* Notification Preferences Modal */}
      {showPreferences && (
        <NotificationPreferences
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
}
