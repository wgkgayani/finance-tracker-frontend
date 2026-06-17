// src/components/profile/AccountSettings.tsx

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Bell,
  Globe,
  Moon,
  DollarSign,
  Languages,
  Clock,
  Calendar,
  Trash,
  AlertTriangle,
} from "lucide-react";
import { UserProfile } from "@/types/profile.types";
import { profileService } from "@/services/profile/profile.service";
import toast from "react-hot-toast";

interface AccountSettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

// ✅ Define proper types for settings items
type SettingItem = {
  label: string;
  value: any;
  key: keyof UserProfile;
  type?: "toggle" | "select";
  options?: string[];
};

type SettingSection = {
  title: string;
  icon: any;
  items: SettingItem[];
};

export default function AccountSettings({
  profile,
  onUpdate,
}: AccountSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const handlePreferenceChange = async (key: keyof UserProfile, value: any) => {
    try {
      setIsLoading(true);
      const updatedProfile = await profileService.updatePreferences({
        [key]: value,
      });
      onUpdate(updatedProfile);
      toast.success("Preference updated");
    } catch (error) {
      toast.error("Failed to update preference");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setIsLoading(true);
      await profileService.deleteAccount(deletePassword);
      toast.success("Account deleted");
      window.location.href = "/login";
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"];
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Chinese",
  ];
  const timezones = [
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Singapore",
  ];
  const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

  // ✅ Properly typed settings sections with explicit type properties
  const settingsSections: SettingSection[] = [
    {
      title: "Preferences",
      icon: Globe,
      items: [
        {
          label: "Currency",
          value: profile.currency,
          options: currencies,
          key: "currency",
          type: "select", // ✅ Explicitly set type
        },
        {
          label: "Language",
          value: profile.language,
          options: languages,
          key: "language",
          type: "select", // ✅ Explicitly set type
        },
        {
          label: "Time Zone",
          value: profile.timezone,
          options: timezones,
          key: "timezone",
          type: "select", // ✅ Explicitly set type
        },
        {
          label: "Date Format",
          value: profile.dateFormat,
          options: dateFormats,
          key: "dateFormat",
          type: "select", // ✅ Explicitly set type
        },
      ],
    },
    {
      title: "Theme",
      icon: Moon,
      items: [
        {
          label: "Theme",
          value: profile.theme,
          options: ["light", "dark", "system"],
          key: "theme",
          type: "select", // ✅ Explicitly set type
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Email Notifications",
          value: profile.emailNotifications,
          key: "emailNotifications",
          type: "toggle", // ✅ Explicitly set type
        },
        {
          label: "Push Notifications",
          value: profile.pushNotifications,
          key: "pushNotifications",
          type: "toggle", // ✅ Explicitly set type
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Account Settings
        </h3>
        <p className="text-sm text-gray-500">
          Manage your preferences and account security
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Settings Sections */}
        {settingsSections.map((section, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-4">
              <section.icon className="w-4 h-4 text-primary-600" />
              <h4 className="font-medium text-gray-700">{section.title}</h4>
            </div>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  {/* ✅ TypeScript now knows 'type' exists */}
                  {item.type === "toggle" ? (
                    <button
                      onClick={() =>
                        handlePreferenceChange(item.key as any, !item.value)
                      }
                      disabled={isLoading}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        item.value ? "bg-primary-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          item.value ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  ) : (
                    // ✅ TypeScript now knows 'options' exists
                    <select
                      value={item.value as string}
                      onChange={(e) =>
                        handlePreferenceChange(item.key as any, e.target.value)
                      }
                      disabled={isLoading}
                      className="px-3 py-1 text-sm rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white"
                    >
                      {item.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Two-Factor Authentication */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Shield className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <button
              onClick={() => toast.success("2FA setup coming soon!")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                profile.twoFactorEnabled
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  : "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow"
              }`}
            >
              {profile.twoFactorEnabled ? "Manage" : "Enable"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-red-200">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-700">
                  Danger Zone
                </h4>
                <p className="text-sm text-red-600 mt-1">
                  Once you delete your account, all your data will be
                  permanently removed. This action cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm shadow-sm hover:shadow"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="mt-3 space-y-3">
                    <input
                      type="password"
                      placeholder="Enter your password to confirm"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 shadow-sm hover:shadow"
                      >
                        {isLoading ? "Deleting..." : "Confirm Delete"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword("");
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
