// src/components/profile/ChangePassword.tsx

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react"; // ✅ Changed EyeSlashIcon to EyeOffIcon
import { profileService } from "@/services/profile/profile.service";
import toast from "react-hot-toast";

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePassword({
  isOpen,
  onClose,
}: ChangePasswordProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await profileService.changePassword(formData);
      toast.success("Password changed successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
            className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <LockIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Change Password
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.current ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-400" /> // ✅ Changed to EyeOffIcon
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.new ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-400" /> // ✅ Changed to EyeOffIcon
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.newPassword}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirm ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-400" /> // ✅ Changed to EyeOffIcon
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="mt-5 sm:mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Changing...
                      </div>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
