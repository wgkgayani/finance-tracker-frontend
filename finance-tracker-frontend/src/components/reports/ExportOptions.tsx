// src/components/reports/ExportOptions.tsx

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DownloadIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  PrinterIcon,
  Share2Icon,
  SettingsIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import {
  ReportFormat,
  ExportOptions as ExportOptionsType,
} from "@/types/report.types";

interface ExportOptionsProps {
  onExport: (format: ReportFormat, options: ExportOptionsType) => void;
  onPrint: () => void;
  onShare?: () => void;
  isExporting?: boolean;
  formats?: ReportFormat[];
}

export default function ExportOptions({
  onExport,
  onPrint,
  onShare,
  isExporting = false,
  formats = ["pdf", "excel", "csv"],
}: ExportOptionsProps) {
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>("pdf");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState<ExportOptionsType>({
    format: "pdf",
    includeCharts: true,
    includeSummary: true,
    includeTransactions: true,
    pageSize: "A4",
    orientation: "portrait",
  });

  const formatConfigs = {
    pdf: {
      icon: FileIcon,
      label: "PDF",
      description: "Portable Document Format",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    excel: {
      icon: FileSpreadsheetIcon,
      label: "Excel",
      description: "Microsoft Excel Spreadsheet",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    csv: {
      icon: FileTextIcon,
      label: "CSV",
      description: "Comma Separated Values",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  };

  const handleExport = () => {
    onExport(selectedFormat, options);
  };

  const pageSizes = ["A4", "Letter", "A3"];
  const orientations = ["portrait", "landscape"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <DownloadIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Export Options
            </h3>
            <p className="text-sm text-gray-500">
              Choose format and export settings
            </p>
          </div>
        </div>
        {isExporting && (
          <div className="flex items-center gap-2 text-sm text-primary-600">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Exporting...
          </div>
        )}
      </div>

      {/* Format Selection */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {formats.map((format) => {
          const config = formatConfigs[format];
          const isSelected = selectedFormat === format;
          return (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${isSelected ? config.bgColor : "bg-gray-100"}`}
                >
                  <config.icon
                    className={`w-6 h-6 ${isSelected ? config.color : "text-gray-500"}`}
                  />
                </div>
                <div className="text-center">
                  <p
                    className={`font-medium ${isSelected ? "text-primary-700" : "text-gray-700"}`}
                  >
                    {config.label}
                  </p>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
                {isSelected && (
                  <CheckCircleIcon className="w-4 h-4 text-primary-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        {showAdvanced ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
        {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
      </button>

      {/* Advanced Options */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Page Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Size
                </label>
                <select
                  value={options.pageSize}
                  onChange={(e) =>
                    setOptions({ ...options, pageSize: e.target.value as any })
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orientation
                </label>
                <select
                  value={options.orientation}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      orientation: e.target.value as any,
                    })
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {orientations.map((orientation) => (
                    <option key={orientation} value={orientation}>
                      {orientation.charAt(0).toUpperCase() +
                        orientation.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Include Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include in Export
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeSummary}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        includeSummary: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Summary</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeCharts}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        includeCharts: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Charts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeTransactions}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        includeTransactions: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Transactions
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex-1 min-w-[120px] px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <DownloadIcon className="w-4 h-4" />
          {isExporting
            ? "Exporting..."
            : `Export ${selectedFormat.toUpperCase()}`}
        </button>

        <button
          onClick={onPrint}
          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <PrinterIcon className="w-4 h-4" />
          Print
        </button>

        {onShare && (
          <button
            onClick={onShare}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Share2Icon className="w-4 h-4" />
            Share
          </button>
        )}
      </div>

      {/* Info Message */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <AlertCircleIcon className="w-4 h-4" />
        <span>
          {selectedFormat === "pdf" &&
            "PDF reports include all charts and formatting"}
          {selectedFormat === "excel" &&
            "Excel exports include all data with multiple sheets"}
          {selectedFormat === "csv" &&
            "CSV exports are compatible with most spreadsheet applications"}
        </span>
      </div>
    </div>
  );
}
