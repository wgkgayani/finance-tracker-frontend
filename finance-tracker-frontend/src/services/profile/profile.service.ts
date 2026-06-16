// src/services/profile/profile.service.ts

import api from "@/lib/api/axios.config";
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UpdatePreferencesRequest,
  TwoFactorSetup,
} from "@/types/profile.types";

// Mock data for development
let mockProfile: UserProfile = {
  id: 1,
  name: "Demo User",
  email: "demo@example.com",
  phone: "+1 (555) 123-4567",
  bio: "Financial enthusiast and tech lover",
  location: "San Francisco, CA",
  website: "https://demouser.com",
  company: "Finance Tracker Inc.",
  jobTitle: "Product Manager",
  currency: "USD",
  language: "English",
  timezone: "America/Los_Angeles",
  dateFormat: "MM/DD/YYYY",
  theme: "system",
  emailNotifications: true,
  pushNotifications: true,
  twoFactorEnabled: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const profileService = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { ...mockProfile };
      }

      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return { ...mockProfile };
    }
  },

  // Update profile information
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 800));
        mockProfile = {
          ...mockProfile,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return { ...mockProfile };
      }

      const response = await api.put("/profile", data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Validate current password for demo
        if (data.currentPassword !== "password") {
          throw new Error("Current password is incorrect");
        }
        if (data.newPassword !== data.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (data.newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        return;
      }

      await api.post("/profile/change-password", data);
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Update preferences
  updatePreferences: async (
    data: UpdatePreferencesRequest,
  ): Promise<UserProfile> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockProfile = {
          ...mockProfile,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return { ...mockProfile };
      }

      const response = await api.put("/profile/preferences", data);
      return response.data;
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Create a fake URL for demo
        const fakeUrl = URL.createObjectURL(file);
        mockProfile = {
          ...mockProfile,
          avatar: fakeUrl,
          updatedAt: new Date().toISOString(),
        };
        return { avatarUrl: fakeUrl };
      }

      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  // Setup two-factor authentication
  setupTwoFactor: async (): Promise<TwoFactorSetup> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
          enabled: false,
          secret: "ABCDEFGHIJKLMNOP",
          qrCode: "data:image/png;base64,mockQRCode",
          backupCodes: ["123456", "789012", "345678", "901234", "567890"],
        };
      }

      const response = await api.post("/profile/two-factor/setup");
      return response.data;
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      throw error;
    }
  },

  // Enable two-factor authentication
  enableTwoFactor: async (code: string): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockProfile = {
          ...mockProfile,
          twoFactorEnabled: true,
          updatedAt: new Date().toISOString(),
        };
        return;
      }

      await api.post("/profile/two-factor/enable", { code });
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      throw error;
    }
  },

  // Disable two-factor authentication
  disableTwoFactor: async (code: string): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockProfile = {
          ...mockProfile,
          twoFactorEnabled: false,
          updatedAt: new Date().toISOString(),
        };
        return;
      }

      await api.post("/profile/two-factor/disable", { code });
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (password: string): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (password !== "password") {
          throw new Error("Invalid password");
        }
        return;
      }

      await api.delete("/profile/account", { data: { password } });
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },
};
