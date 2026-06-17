// src/services/settings/settings.service.ts

import api from "@/lib/api/axios.config";
import {
  SettingsData,
  GeneralSettings,
  AppearanceSettings,
  NotificationSettings,
  CurrencySettings,
  SecuritySettings,
} from "@/types/settings.types";

// Mock data for development
let mockSettings: SettingsData = {
  general: {
    name: "Demo User",
    email: "demo@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Financial enthusiast and tech lover",
    location: "San Francisco, CA",
    website: "https://demouser.com",
    company: "Finance Tracker Inc.",
    jobTitle: "Product Manager",
  },
  appearance: {
    theme: "system",
    fontSize: "medium",
    compactView: false,
    showAnimations: true,
    sidebarCollapsed: false,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    transactionAlerts: true,
    savingsGoalAlerts: true,
    aiInsights: true,
    weeklyReports: true,
    marketingEmails: false,
  },
  currency: {
    currency: "USD",
    currencySymbol: "$",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    language: "English",
    timezone: "America/Los_Angeles",
    firstDayOfWeek: "sunday",
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceManagement: true,
    lastPasswordChange: new Date().toISOString(),
    activeSessions: [
      {
        id: "1",
        device: "MacBook Pro",
        browser: "Chrome 120",
        location: "San Francisco, CA",
        ip: "192.168.1.1",
        lastActive: new Date().toISOString(),
        current: true,
      },
    ],
  },
};

export const settingsService = {
  // Get all settings
  getSettings: async (): Promise<SettingsData> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { ...mockSettings };
      }
      const response = await api.get("/settings");
      return response.data;
    } catch (error) {
      console.error("Error fetching settings:", error);
      return { ...mockSettings };
    }
  },

  // Update general settings
  updateGeneral: async (
    data: Partial<GeneralSettings>,
  ): Promise<SettingsData> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockSettings.general = { ...mockSettings.general, ...data };
        return { ...mockSettings };
      }
      const response = await api.put("/settings/general", data);
      return response.data;
    } catch (error) {
      console.error("Error updating general settings:", error);
      throw error;
    }
  },

  // Update appearance settings
  updateAppearance: async (
    data: Partial<AppearanceSettings>,
  ): Promise<SettingsData> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockSettings.appearance = { ...mockSettings.appearance, ...data };
        return { ...mockSettings };
      }
      const response = await api.put("/settings/appearance", data);
      return response.data;
    } catch (error) {
      console.error("Error updating appearance settings:", error);
      throw error;
    }
  },

  // Update notification settings
  updateNotifications: async (
    data: Partial<NotificationSettings>,
  ): Promise<SettingsData> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockSettings.notifications = { ...mockSettings.notifications, ...data };
        return { ...mockSettings };
      }
      const response = await api.put("/settings/notifications", data);
      return response.data;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw error;
    }
  },

  // Update currency settings
  updateCurrency: async (
    data: Partial<CurrencySettings>,
  ): Promise<SettingsData> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockSettings.currency = { ...mockSettings.currency, ...data };
        return { ...mockSettings };
      }
      const response = await api.put("/settings/currency", data);
      return response.data;
    } catch (error) {
      console.error("Error updating currency settings:", error);
      throw error;
    }
  },

  // Update security settings
  updateSecurity: async (
    data: Partial<SecuritySettings>,
  ): Promise<SettingsData> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockSettings.security = { ...mockSettings.security, ...data };
        return { ...mockSettings };
      }
      const response = await api.put("/settings/security", data);
      return response.data;
    } catch (error) {
      console.error("Error updating security settings:", error);
      throw error;
    }
  },

  // Revoke session
  revokeSession: async (sessionId: string): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        mockSettings.security.activeSessions =
          mockSettings.security.activeSessions.filter(
            (s) => s.id !== sessionId,
          );
        return;
      }
      await api.delete(`/settings/sessions/${sessionId}`);
    } catch (error) {
      console.error("Error revoking session:", error);
      throw error;
    }
  },

  // Save all settings at once
  saveAll: async (data: SettingsData): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        mockSettings = { ...data };
        return;
      }
      await api.put("/settings", data);
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  },
};
