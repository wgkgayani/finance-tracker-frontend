// src/app/(dashboard)/profile/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, // ✅ Changed from UserIcon
  Lock, // ✅ Changed from LockIcon
  Settings, // ✅ Changed from SettingsIcon
  RefreshCw, // ✅ Changed from RefreshCwIcon
  Shield, // ✅ Added Shield import
} from "lucide-react";
import { profileService } from "@/services/profile/profile.service";
import { UserProfile } from "@/types/profile.types";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileForm from "@/components/profile/ProfileForm";
import ChangePassword from "@/components/profile/ChangePassword";
import AccountSettings from "@/components/profile/AccountSettings";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

type TabType = "profile" | "settings" | "security";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [showEditForm, setShowEditForm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    // Update localStorage user data
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.name = updatedProfile.name;
    user.email = updatedProfile.email;
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    if (profile) {
      setProfile({ ...profile, avatar: avatarUrl });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div>Profile not found</div>;

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account settings
          </p>
        </div>
        <button
          onClick={fetchProfile}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <ProfileAvatar
            avatar={profile.avatar}
            name={profile.name}
            onAvatarUpdate={handleAvatarUpdate}
            size="xl"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-500">{profile.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded-full">
                {profile.currency} Currency
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                {profile.language}
              </span>
              {profile.twoFactorEnabled && (
                <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                  🔒 2FA Enabled
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
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
        {activeTab === "profile" && (
          <ProfileInfo profile={profile} onEdit={() => setShowEditForm(true)} />
        )}

        {activeTab === "settings" && (
          <AccountSettings profile={profile} onUpdate={handleUpdateProfile} />
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        Change Password
                      </p>
                      <p className="text-sm text-gray-500">
                        Update your account password
                      </p>
                    </div>
                  </div>
                  <span className="text-primary-600">→</span>
                </button>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-500" />{" "}
                      {/* ✅ Fixed: ShieldIcon → Shield */}
                      <div>
                        <p className="font-medium text-gray-900">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-500">
                          {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success("2FA setup coming soon!")}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        profile.twoFactorEnabled
                          ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                          : "text-primary-600 bg-primary-50 hover:bg-primary-100"
                      }`}
                    >
                      {profile.twoFactorEnabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <ProfileForm
        isOpen={showEditForm}
        profile={profile}
        onClose={() => setShowEditForm(false)}
        onUpdate={handleUpdateProfile}
      />

      <ChangePassword
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  );
}
