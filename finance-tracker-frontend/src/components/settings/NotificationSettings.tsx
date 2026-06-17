// src/components/settings/NotificationSettings.tsx

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Bell,
  Mail,
  Smartphone,
  AlertTriangle,
  CreditCard,
  Target,
  Sparkles,
  Calendar,
  Mail as MailIcon,
} from "lucide-react";
import { NotificationSettings } from "@/types/settings.types";
import { settingsService } from "@/services/settings/settings.service";
import toast from "react-hot-toast";

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
}

export default function NotificationSettings({
  settings,
  onUpdate,
}: NotificationSettingsProps) {
  const [formData, setFormData] = useState<NotificationSettings>(settings);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => {
    setFormData({ ...formData, [key]: !formData[key] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await settingsService.updateNotifications(formData);
      onUpdate(result.notifications);
      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update notification settings");
    } finally {
      setIsLoading(false);
    }
  };

  const notificationTypes = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      icon: Mail,
      description: "Receive notifications via email",
    },
    {
      key: "pushNotifications",
      label: "Push Notifications",
      icon: Smartphone,
      description: "Receive push notifications on your device",
    },
    {
      key: "budgetAlerts",
      label: "Budget Alerts",
      icon: AlertTriangle,
      description: "Get alerts when you exceed budget limits",
    },
    {
      key: "transactionAlerts",
      label: "Transaction Alerts",
      icon: CreditCard,
      description: "Get notified about large transactions",
    },
    {
      key: "savingsGoalAlerts",
      label: "Savings Goal Alerts",
      icon: Target,
      description: "Get updates on your savings progress",
    },
    {
      key: "aiInsights",
      label: "AI Insights",
      icon: Sparkles,
      description: "Receive AI-powered financial recommendations",
    },
    {
      key: "weeklyReports",
      label: "Weekly Reports",
      icon: Calendar,
      description: "Get weekly financial summary reports",
    },
    {
      key: "marketingEmails",
      label: "Marketing Emails",
      icon: MailIcon,
      description: "Receive promotional offers and updates",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Notification Settings
          </h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manage how you receive notifications
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {notificationTypes.map((item) => {
          const Icon = item.icon;
          const isEnabled = formData[
            item.key as keyof NotificationSettings
          ] as boolean;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleToggle(item.key as keyof NotificationSettings)
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isEnabled ? "bg-primary-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
