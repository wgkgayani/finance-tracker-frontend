// src/components/profile/ProfileInfo.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  EditIcon,
} from "lucide-react";
import { UserProfile } from "@/types/profile.types";
import { format } from "date-fns";

interface ProfileInfoProps {
  profile: UserProfile;
  onEdit: () => void;
}

export default function ProfileInfo({ profile, onEdit }: ProfileInfoProps) {
  const infoItems = [
    { icon: MailIcon, label: "Email", value: profile.email },
    { icon: PhoneIcon, label: "Phone", value: profile.phone || "Not set" },
    {
      icon: MapPinIcon,
      label: "Location",
      value: profile.location || "Not set",
    },
    { icon: GlobeIcon, label: "Website", value: profile.website || "Not set" },
    {
      icon: BriefcaseIcon,
      label: "Job Title",
      value: profile.jobTitle || "Not set",
    },
    {
      icon: BuildingIcon,
      label: "Company",
      value: profile.company || "Not set",
    },
    {
      icon: CalendarIcon,
      label: "Member Since",
      value: format(new Date(profile.createdAt), "MMM dd, yyyy"),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Profile Information
          </h3>
          <p className="text-sm text-gray-500">
            Your personal information and contact details
          </p>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
        >
          <EditIcon className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                <item.icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Bio
          </p>
          <p className="text-sm text-gray-700">
            {profile.bio || "No bio provided yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
