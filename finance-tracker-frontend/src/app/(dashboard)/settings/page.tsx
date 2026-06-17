// src/app/(dashboard)/settings/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Palette,
  Bell,
  Shield,
  RefreshCw,
  Globe,
} from "lucide-react";
import { settingsService } from "@/services/settings/settings.service";
import { SettingsData } from "@/types/settings.types";
import GeneralSettings from "@/components/settings/GeneralSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

type SettingsTab = "general" | "appearance" | "notifications" | "security";

const tabs: { id: SettingsTab; label: string; icon: any }[] = [
  { id: "general", label: "General", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (updatedSettings: Partial<SettingsData>) => {
    if (settings) {
      setSettings({ ...settings, ...updatedSettings });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!settings) return <div>Settings not found</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "general" && (
          <GeneralSettings
            settings={settings.general}
            onUpdate={(general) => updateSettings({ general })}
          />
        )}

        {activeTab === "appearance" && (
          <AppearanceSettings
            settings={settings.appearance}
            onUpdate={(appearance) => updateSettings({ appearance })}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationSettings
            settings={settings.notifications}
            onUpdate={(notifications) => updateSettings({ notifications })}
          />
        )}

        {activeTab === "security" && (
          <SecuritySettings
            settings={settings.security}
            onUpdate={(security) => updateSettings({ security })}
          />
        )}
      </motion.div>
    </div>
  );
}
