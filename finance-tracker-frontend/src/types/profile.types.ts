// src/types/profile.types.ts

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  currency: string;
  language: string;
  timezone: string;
  dateFormat: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePreferencesRequest {
  currency?: string;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  theme?: "light" | "dark" | "system";
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

export interface TwoFactorSetup {
  enabled: boolean;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
}
