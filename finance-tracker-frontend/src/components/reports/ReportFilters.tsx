// src/components/reports/ReportFilters.tsx

"use client";

import React from "react";
import { CalendarIcon, FilterIcon, XIcon } from "lucide-react";
import { ReportFilters } from "@/types/report.types";

interface ReportFiltersProps {
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  categories?: string[];
}

export default function ReportFilters({
  filters,
  onChange,
  onGenerate,
  isGenerating = false,
  categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Housing",
    "Education",
  ],
}: ReportFiltersProps) {
  const handleChange = (key: keyof ReportFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const current = filters.categories || [];
    const newCategories = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    handleChange("categories", newCategories);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Report Filters</h3>
        </div>
        <button
          onClick={() =>
            onChange({
              startDate: "",
              endDate: "",
              categories: [],
              type: "all",
              includeCharts: true,
              includeTransactions: true,
              includeBudgets: true,
              includeSavings: false,
            })
          }
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <XIcon className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          <select
            value={filters.type || "all"}
            onChange={(e) => handleChange("type", e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        {/* Include Options */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Include in Report
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.includeCharts}
                onChange={(e) =>
                  handleChange("includeCharts", e.target.checked)
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
                  handleChange("includeTransactions", e.target.checked)
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
                  handleChange("includeBudgets", e.target.checked)
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
                  handleChange("includeSavings", e.target.checked)
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Savings</span>
            </label>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-4">
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

      {/* Generate Button */}
      <div className="mt-6">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
              Generating Report...
            </div>
          ) : (
            "Generate Report"
          )}
        </button>
      </div>
    </div>
  );
}
