// src/components/settings/GeneralSettings.tsx

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Building,
  FileText,
} from "lucide-react";
import { GeneralSettings } from "@/types/settings.types";
import { settingsService } from "@/services/settings/settings.service";
import toast from "react-hot-toast";

interface GeneralSettingsProps {
  settings: GeneralSettings;
  onUpdate: (settings: GeneralSettings) => void;
}

export default function GeneralSettings({
  settings,
  onUpdate,
}: GeneralSettingsProps) {
  const [formData, setFormData] = useState<GeneralSettings>(settings);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: keyof GeneralSettings, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await settingsService.updateGeneral(formData);
      onUpdate(result.general);
      toast.success("General settings updated successfully");
    } catch (error) {
      toast.error("Failed to update general settings");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      key: "name",
      label: "Full Name",
      icon: User,
      placeholder: "John Doe",
      type: "text",
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      placeholder: "john@example.com",
      type: "email",
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      placeholder: "+1 (555) 123-4567",
      type: "tel",
    },
    {
      key: "bio",
      label: "Bio",
      icon: FileText,
      placeholder: "Tell us about yourself...",
      type: "textarea",
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      placeholder: "San Francisco, CA",
      type: "text",
    },
    {
      key: "website",
      label: "Website",
      icon: Globe,
      placeholder: "https://example.com",
      type: "url",
    },
    {
      key: "company",
      label: "Company",
      icon: Building,
      placeholder: "Company Name",
      type: "text",
    },
    {
      key: "jobTitle",
      label: "Job Title",
      icon: Briefcase,
      placeholder: "Product Manager",
      type: "text",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          General Settings
        </h3>
        <p className="text-sm text-gray-500">
          Manage your personal information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => {
            const Icon = field.icon;
            const value = formData[field.key as keyof GeneralSettings] || "";

            return (
              <div
                key={field.key}
                className={field.key === "bio" ? "md:col-span-2" : ""}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-gray-400" />
                  </div>
                  {field.type === "textarea" ? (
                    <textarea
                      value={value}
                      onChange={(e) =>
                        handleChange(
                          field.key as keyof GeneralSettings,
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={value}
                      onChange={(e) =>
                        handleChange(
                          field.key as keyof GeneralSettings,
                          e.target.value,
                        )
                      }
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              </div>
            );
          })}
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
