// src/components/settings/SecuritySettings.tsx

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Shield,
  Clock,
  AlertCircle,
  Laptop,
  LogOut,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { SecuritySettings } from "@/types/settings.types";
import { settingsService } from "@/services/settings/settings.service";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface SecuritySettingsProps {
  settings: SecuritySettings;
  onUpdate: (settings: SecuritySettings) => void;
}

export default function SecuritySettings({
  settings,
  onUpdate,
}: SecuritySettingsProps) {
  const [formData, setFormData] = useState<SecuritySettings>(settings);
  const [isLoading, setIsLoading] = useState(false);
  const [showSessionConfirm, setShowSessionConfirm] = useState<string | null>(
    null,
  );

  const handleToggle = (key: keyof SecuritySettings) => {
    if (typeof formData[key] === "boolean") {
      setFormData({ ...formData, [key]: !formData[key] as any });
    }
  };

  const handleChange = (key: keyof SecuritySettings, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await settingsService.updateSecurity(formData);
      onUpdate(result.security);
      toast.success("Security settings updated");
    } catch (error) {
      toast.error("Failed to update security settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await settingsService.revokeSession(sessionId);
      toast.success("Session revoked successfully");
      const result = await settingsService.getSettings();
      onUpdate(result.security);
      setShowSessionConfirm(null);
    } catch (error) {
      toast.error("Failed to revoke session");
    }
  };

  const sessionTimeoutOptions = [15, 30, 60, 120, 240, 480];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Security Settings
          </h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account security
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-gray-500">
                {formData.twoFactorEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              toast.success("2FA setup coming soon!");
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              formData.twoFactorEnabled
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {formData.twoFactorEnabled ? "Disable" : "Enable"}
          </button>
        </div>

        {/* Session Timeout */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout
          </label>
          <div className="flex flex-wrap gap-2">
            {sessionTimeoutOptions.map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => handleChange("sessionTimeout", minutes)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  formData.sessionTimeout === minutes
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {minutes < 60 ? `${minutes}m` : `${minutes / 60}h`}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            After inactivity, you'll be logged out automatically
          </p>
        </div>

        {/* Toggle Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-700">Login Alerts</p>
                <p className="text-sm text-gray-500">
                  Get notified of new login attempts
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("loginAlerts")}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                formData.loginAlerts ? "bg-primary-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  formData.loginAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Laptop className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-700">Device Management</p>
                <p className="text-sm text-gray-500">
                  Track and manage active sessions
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("deviceManagement")}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                formData.deviceManagement ? "bg-primary-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  formData.deviceManagement ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        {formData.deviceManagement && formData.activeSessions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Active Sessions
            </h4>
            <div className="space-y-3">
              {formData.activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        session.current ? "bg-green-100" : "bg-gray-200"
                      }`}
                    >
                      <Laptop
                        className={`w-4 h-4 ${
                          session.current ? "text-green-600" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 text-xs text-green-600">
                            (Current)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.browser} • {session.location} • {session.ip}
                      </p>
                      <p className="text-xs text-gray-400">
                        Last active:{" "}
                        {format(new Date(session.lastActive), "MMM dd, h:mm a")}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <>
                      {showSessionConfirm === session.id ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleRevokeSession(session.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowSessionConfirm(null)}
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowSessionConfirm(session.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
