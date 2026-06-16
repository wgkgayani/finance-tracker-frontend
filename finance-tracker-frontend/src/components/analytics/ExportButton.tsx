// src/components/analytics/ExportButton.tsx

"use client";

import React, { useState } from "react";
import { DownloadIcon, FileIcon, FileSpreadsheetIcon } from "lucide-react";
import { analyticsService } from "@/services/analytics/analytics.service";
import toast from "react-hot-toast";

interface ExportButtonProps {
  format: "pdf" | "excel";
  label?: string;
  className?: string;
  onExportStart?: () => void;
  onExportComplete?: () => void;
}

export default function ExportButton({
  format,
  label,
  className = "",
  onExportStart,
  onExportComplete,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      onExportStart?.();

      const filename = `analytics-report-${new Date().toISOString().split("T")[0]}.${format}`;
      await analyticsService.downloadExport(format, filename);

      toast.success(`Report exported successfully as ${format.toUpperCase()}`);
      onExportComplete?.();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getIcon = () => {
    if (format === "pdf") {
      return <FileIcon className="w-4 h-4 mr-2" />;
    }
    return <FileSpreadsheetIcon className="w-4 h-4 mr-2" />;
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isExporting ? (
        <>
          <svg
            className="animate-spin w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Exporting...
        </>
      ) : (
        <>
          {getIcon()}
          {label || `Export ${format.toUpperCase()}`}
          <DownloadIcon className="w-4 h-4 ml-2" />
        </>
      )}
    </button>
  );
}
