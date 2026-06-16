// src/components/notifications/NotificationPreferences.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XIcon,
  BellIcon,
  MailIcon,
  SmartphoneIcon,
  MoonIcon,
} from "lucide-react";
import { NotificationPreferences as PreferencesType } from "@/types/notification.types";
import { notificationService } from "@/services/notifications/notification.service";
import toast from "react-hot-toast";

interface NotificationPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPreferences({
  isOpen,
  onClose,
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<PreferencesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPreferences();
    }
  }, [isOpen]);

  const loadPreferences = async () => {
    try {
      const data = await notificationService.getPreferences();
      setPreferences(data);
    } catch (error) {
      console.error("Error loading preferences:", error);
      toast.error("Failed to load preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;
    setIsSaving(true);
    try {
      await notificationService.updatePreferences(preferences);
      toast.success("Preferences saved successfully");
      onClose();
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleType = (key: keyof PreferencesType["types"]) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      types: {
        ...preferences.types,
        [key]: !preferences.types[key],
      },
    });
  };

  if (!isOpen) return null;

  const typeLabels: Record<keyof PreferencesType["types"], string> = {
    budget_alert: "Budget Alerts",
    transaction_alert: "Transaction Alerts",
    savings_goal: "Savings Goals",
    ai_insight: "AI Insights",
    system: "System Updates",
    reminder: "Reminders",
    achievement: "Achievements",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={onClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={onClose}
          />

          <div
            className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <BellIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Notification Preferences
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                </div>
              ) : preferences ? (
                <div className="space-y-6">
                  {/* Channel Preferences */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Channels</h4>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MailIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Email</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.email}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              email: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <SmartphoneIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            Push Notifications
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.push}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              push: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BellIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">In-App</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.inApp}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              inApp: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Type Preferences */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Notification Types
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(typeLabels).map(([key, label]) => (
                        <label
                          key={key}
                          className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={
                              preferences.types[
                                key as keyof PreferencesType["types"]
                              ]
                            }
                            onChange={() =>
                              toggleType(key as keyof PreferencesType["types"])
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quiet Hours */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Quiet Hours</h4>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={preferences.quietHours.enabled}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              quietHours: {
                                ...preferences.quietHours,
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-600">Enable</span>
                      </label>
                    </div>
                    {preferences.quietHours.enabled && (
                      <div className="flex gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Start</label>
                          <input
                            type="time"
                            value={preferences.quietHours.start}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                quietHours: {
                                  ...preferences.quietHours,
                                  start: e.target.value,
                                },
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">End</label>
                          <input
                            type="time"
                            value={preferences.quietHours.end}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                quietHours: {
                                  ...preferences.quietHours,
                                  end: e.target.value,
                                },
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="px-4 py-3 bg-gray-50 sm:px-6 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
