// src/components/notifications/NotificationFilters.tsx

"use client";

import React from "react";
import { FilterIcon, XIcon, CalendarIcon } from "lucide-react";

interface NotificationFiltersProps {
  filters: {
    type: string;
    priority: string;
    startDate: string;
    endDate: string;
  };
  onChange: (filters: any) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function NotificationFilters({
  filters,
  onChange,
  onReset,
  isOpen,
  onToggle,
}: NotificationFiltersProps) {
  const types = [
    "all",
    "budget_alert",
    "transaction_alert",
    "savings_goal",
    "ai_insight",
    "system",
    "reminder",
    "achievement",
  ];
  const priorities = ["all", "low", "medium", "high", "critical"];

  const typeLabels: Record<string, string> = {
    all: "All Types",
    budget_alert: "Budget Alerts",
    transaction_alert: "Transaction Alerts",
    savings_goal: "Savings Goals",
    ai_insight: "AI Insights",
    system: "System",
    reminder: "Reminders",
    achievement: "Achievements",
  };

  const priorityLabels: Record<string, string> = {
    all: "All Priorities",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      >
        <FilterIcon className="w-4 h-4 mr-2" />
        Filters
        {(filters.type !== "all" || filters.priority !== "all") && (
          <span className="ml-2 w-2 h-2 bg-primary-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Filters</h4>
            <button
              onClick={onReset}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => onChange({ ...filters, type: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {typeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) =>
                  onChange({ ...filters, priority: e.target.value })
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priorityLabels[priority]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    onChange({ ...filters, startDate: e.target.value })
                  }
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Start"
                />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    onChange({ ...filters, endDate: e.target.value })
                  }
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="End"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
