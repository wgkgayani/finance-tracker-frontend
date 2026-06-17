// src/components/settings/AppearanceSettings.tsx

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Sun, Moon, Monitor, Type, Layout, Sparkles } from "lucide-react";
import { AppearanceSettings } from "@/types/settings.types";
import { settingsService } from "@/services/settings/settings.service";
import toast from "react-hot-toast";

interface AppearanceSettingsProps {
  settings: AppearanceSettings;
  onUpdate: (settings: AppearanceSettings) => void;
}

export default function AppearanceSettings({
  settings,
  onUpdate,
}: AppearanceSettingsProps) {
  const [formData, setFormData] = useState<AppearanceSettings>(settings);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K],
  ) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await settingsService.updateAppearance(formData);
      onUpdate(result.appearance);
      toast.success("Appearance settings updated");
    } catch (error) {
      toast.error("Failed to update appearance settings");
    } finally {
      setIsLoading(false);
    }
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const fontSizeOptions = [
    { value: "small", label: "Small", size: "text-sm" },
    { value: "medium", label: "Medium", size: "text-base" },
    { value: "large", label: "Large", size: "text-lg" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Appearance Settings
        </h3>
        <p className="text-sm text-gray-500">Customize how the app looks</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.theme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange("theme", option.value as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${
                      isSelected ? "text-primary-600" : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? "text-primary-700" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Font Size
          </label>
          <div className="grid grid-cols-3 gap-3">
            {fontSizeOptions.map((option) => {
              const isSelected = formData.fontSize === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange("fontSize", option.value as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Type
                    className={`w-6 h-6 mx-auto mb-2 ${
                      isSelected ? "text-primary-600" : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? "text-primary-700" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className={`${option.size} text-gray-500 mt-1`}>Aa</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Layout className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-700">Compact View</p>
                <p className="text-sm text-gray-500">
                  Reduce spacing between elements
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange("compactView", !formData.compactView)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                formData.compactView ? "bg-primary-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  formData.compactView ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-700">Show Animations</p>
                <p className="text-sm text-gray-500">
                  Enable smooth transitions and effects
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleChange("showAnimations", !formData.showAnimations)
              }
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                formData.showAnimations ? "bg-primary-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  formData.showAnimations ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

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
