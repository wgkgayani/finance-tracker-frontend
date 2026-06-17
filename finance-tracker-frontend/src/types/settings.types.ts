// src/types/settings.types.ts

export interface GeneralSettings {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  compactView: boolean;
  showAnimations: boolean;
  sidebarCollapsed: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  budgetAlerts: boolean;
  transactionAlerts: boolean;
  savingsGoalAlerts: boolean;
  aiInsights: boolean;
  weeklyReports: boolean;
  marketingEmails: boolean;
}

export interface CurrencySettings {
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  language: string;
  timezone: string;
  firstDayOfWeek: "sunday" | "monday";
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
  deviceManagement: boolean;
  lastPasswordChange?: string;
  activeSessions: Array<{
    id: string;
    device: string;
    browser: string;
    location: string;
    ip: string;
    lastActive: string;
    current: boolean;
  }>;
}

export interface SettingsData {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  currency: CurrencySettings;
  security: SecuritySettings;
}
