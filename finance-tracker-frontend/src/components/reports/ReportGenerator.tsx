// src/components/reports/ReportGenerator.tsx

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  RefreshCwIcon,
  DownloadIcon,
  CalendarIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  AlertCircleIcon,
} from "lucide-react";
import {
  ReportFilters,
  ReportData,
  ReportFormat,
  ExportOptions,
} from "@/types/report.types";
import { reportService } from "@/services/reports/report.service";
import DateRangePicker from "./DateRangePicker";
import toast from "react-hot-toast";

interface ReportGeneratorProps {
  onReportGenerated: (report: ReportData) => void;
  onExport: (format: ReportFormat) => void;
  isGenerating?: boolean;
}

export default function ReportGenerator({
  onReportGenerated,
  onExport,
  isGenerating = false,
}: ReportGeneratorProps) {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    categories: [],
    type: "all",
    includeCharts: true,
    includeTransactions: true,
    includeBudgets: true,
    includeSavings: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [exportFormat, setExportFormat] = useState<ReportFormat>("pdf");
  const [generating, setGenerating] = useState(false);

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Housing",
    "Education",
    "Savings",
    "Investment",
  ];

  const handleGenerate = async () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error("Please select a date range");
      return;
    }

    try {
      setGenerating(true);
      const report = await reportService.generateReport(filters);
      onReportGenerated(report);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = () => {
    onExport(exportFormat);
  };

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    // Update filters based on preset
    const today = new Date();
    let startDate = "";
    let endDate = today.toISOString().split("T")[0];

    switch (preset) {
      case "today":
        startDate = endDate;
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday.toISOString().split("T")[0];
        endDate = startDate;
        break;
      case "last7days":
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        startDate = last7.toISOString().split("T")[0];
        break;
      case "last30days":
        const last30 = new Date(today);
        last30.setDate(last30.getDate() - 30);
        startDate = last30.toISOString().split("T")[0];
        break;
      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        break;
      case "lastMonth":
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
        );
        startDate = lastMonth.toISOString().split("T")[0];
        endDate = new Date(today.getFullYear(), today.getMonth(), 0)
          .toISOString()
          .split("T")[0];
        break;
      case "thisYear":
        startDate = new Date(today.getFullYear(), 0, 1)
          .toISOString()
          .split("T")[0];
        break;
      default:
        break;
    }

    setFilters({ ...filters, startDate, endDate });
  };

  const toggleCategory = (category: string) => {
    const current = filters.categories || [];
    const newCategories = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const presets = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last 30 Days", value: "last30days" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "This Year", value: "thisYear" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileTextIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Report Generator
            </h3>
            <p className="text-sm text-gray-500">
              Create detailed financial reports
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              filters.startDate && filters.endDate
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {filters.startDate && filters.endDate
              ? "✓ Ready"
              : "⚠️ Select dates"}
          </span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Select
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetSelect(preset.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedPreset === preset.value
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date Range
        </label>
        <DateRangePicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          onChange={(start, end) => {
            setFilters({ ...filters, startDate: start, endDate: end });
            setSelectedPreset("");
          }}
        />
      </div>

      {/* Basic Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          <select
            value={filters.type || "all"}
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value as any })
            }
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Export Format
          </label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ReportFormat)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>
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
        {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 mb-4"
        >
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filters.categories?.includes(category)
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include in Report
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.includeCharts}
                  onChange={(e) =>
                    setFilters({ ...filters, includeCharts: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Charts</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.includeTransactions}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      includeTransactions: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Transactions</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.includeBudgets}
                  onChange={(e) =>
                    setFilters({ ...filters, includeBudgets: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Budgets</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.includeSavings}
                  onChange={(e) =>
                    setFilters({ ...filters, includeSavings: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Savings</span>
              </label>
            </div>
          </div>

          {/* AI Insights Option */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={true}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                disabled
              />
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-700">
                  Include AI-powered insights
                </span>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
            </label>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={handleGenerate}
          disabled={generating || isGenerating}
          className="flex-1 min-w-[120px] px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {generating || isGenerating ? (
            <>
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
              Generating...
            </>
          ) : (
            <>
              <RefreshCwIcon className="w-4 h-4" />
              Generate Report
            </>
          )}
        </button>

        <button
          onClick={handleExport}
          disabled={!filters.startDate || !filters.endDate}
          className="flex-1 min-w-[120px] px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <DownloadIcon className="w-4 h-4" />
          Export {exportFormat.toUpperCase()}
        </button>
      </div>

      {/* Info Message */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
        <AlertCircleIcon className="w-4 h-4 text-blue-600 mt-0.5" />
        <p className="text-sm text-blue-700">
          Reports include all transactions within the selected date range. You
          can filter by category and transaction type for more specific
          analysis.
        </p>
      </div>
    </div>
  );
}
