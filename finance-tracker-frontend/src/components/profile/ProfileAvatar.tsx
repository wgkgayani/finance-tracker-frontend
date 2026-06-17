// src/components/profile/ProfileAvatar.tsx

"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CameraIcon, XIcon } from "lucide-react"; // ✅ No changes needed here
import { profileService } from "@/services/profile/profile.service";
import toast from "react-hot-toast";

interface ProfileAvatarProps {
  avatar?: string;
  name: string;
  onAvatarUpdate: (avatarUrl: string) => void;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function ProfileAvatar({
  avatar,
  name,
  onAvatarUpdate,
  size = "lg",
}: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
    xl: "w-32 h-32 text-3xl",
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setIsUploading(true);
      const result = await profileService.uploadAvatar(file);
      onAvatarUpdate(result.avatarUrl);
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);
      // For demo, we just clear the avatar
      onAvatarUpdate("");
      toast.success("Avatar removed");
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error("Failed to remove avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = previewUrl || avatar;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        {/* Avatar Image */}
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg`}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold">
              {name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Change avatar"
          >
            <CameraIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Uploading Spinner */}
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
          </div>
        )}

        {/* Remove Button */}
        {displayUrl && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
            title="Remove avatar"
          >
            <XIcon className="w-3 h-3 text-white" />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <p className="text-xs text-gray-500">
        {isUploading ? "Uploading..." : "Click the camera icon to change"}
      </p>
    </div>
  );
}
