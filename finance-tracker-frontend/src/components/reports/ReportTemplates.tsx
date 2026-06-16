// src/components/reports/ReportTemplates.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  StarIcon,
  StarOffIcon,
  PlusIcon,
  TrashIcon,
  CopyIcon,
  EditIcon,
  FileSpreadsheetIcon,
  FileBarChartIcon,
  FilePieChartIcon,
} from "lucide-react";
import { ReportTemplate, ReportType } from "@/types/report.types";

interface ReportTemplatesProps {
  onSelectTemplate: (template: ReportTemplate) => void;
  onSaveTemplate?: (template: ReportTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
  selectedTemplateId?: string;
}

export default function ReportTemplates({
  onSelectTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  selectedTemplateId,
}: ReportTemplatesProps) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: "1",
      name: "Monthly Financial Summary",
      description:
        "Complete overview of your monthly finances with charts and trends",
      type: "monthly",
      isDefault: true,
      defaultFilters: {
        startDate: "",
        endDate: "",
        includeCharts: true,
        includeTransactions: true,
        includeBudgets: true,
        includeSavings: false,
      },
    },
    {
      id: "2",
      name: "Quarterly Business Report",
      description:
        "Detailed quarterly performance review with year-over-year comparison",
      type: "quarterly",
      isDefault: false,
      defaultFilters: {
        startDate: "",
        endDate: "",
        includeCharts: true,
        includeTransactions: true,
        includeBudgets: true,
        includeSavings: true,
      },
    },
    {
      id: "3",
      name: "Annual Financial Review",
      description:
        "Comprehensive yearly report with investment and savings analysis",
      type: "yearly",
      isDefault: false,
      defaultFilters: {
        startDate: "",
        endDate: "",
        includeCharts: true,
        includeTransactions: true,
        includeBudgets: true,
        includeSavings: true,
      },
    },
    {
      id: "4",
      name: "Budget Performance Report",
      description: "Track budget vs actual spending with variance analysis",
      type: "custom",
      isDefault: false,
      defaultFilters: {
        startDate: "",
        endDate: "",
        includeCharts: true,
        includeTransactions: false,
        includeBudgets: true,
        includeSavings: false,
      },
    },
    {
      id: "5",
      name: "Investment Portfolio Review",
      description: "Analyze investment performance and returns",
      type: "custom",
      isDefault: false,
      defaultFilters: {
        startDate: "",
        endDate: "",
        includeCharts: true,
        includeTransactions: true,
        includeBudgets: false,
        includeSavings: true,
      },
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<ReportTemplate>>({
    name: "",
    description: "",
    type: "custom",
    isDefault: false,
    defaultFilters: {
      startDate: "",
      endDate: "",
      includeCharts: true,
      includeTransactions: true,
      includeBudgets: true,
      includeSavings: false,
    },
  });

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case "monthly":
        return <ClockIcon className="w-4 h-4" />;
      case "quarterly":
        return <FileBarChartIcon className="w-4 h-4" />;
      case "yearly":
        return <FilePieChartIcon className="w-4 h-4" />;
      default:
        return <FileSpreadsheetIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: ReportType) => {
    switch (type) {
      case "monthly":
        return "bg-blue-100 text-blue-700";
      case "quarterly":
        return "bg-purple-100 text-purple-700";
      case "yearly":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name) {
      alert("Please enter a template name");
      return;
    }

    const template: ReportTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description || "",
      type: (newTemplate.type as ReportType) || "custom",
      isDefault: false,
      defaultFilters: newTemplate.defaultFilters || {
        startDate: "",
        endDate: "",
        includeCharts: true,
        includeTransactions: true,
        includeBudgets: true,
        includeSavings: false,
      },
    };

    setTemplates([...templates, template]);
    onSaveTemplate?.(template);
    setIsCreating(false);
    setNewTemplate({
      name: "",
      description: "",
      type: "custom",
      isDefault: false,
      defaultFilters: {
        startDate: "",
        endDate: "",
        includeCharts: true,
        includeTransactions: true,
        includeBudgets: true,
        includeSavings: false,
      },
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== templateId));
      onDeleteTemplate?.(templateId);
    }
  };

  const handleDuplicateTemplate = (template: ReportTemplate) => {
    const duplicated: ReportTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
    };
    setTemplates([...templates, duplicated]);
    onSaveTemplate?.(duplicated);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Report Templates
          </h3>
          <p className="text-sm text-gray-500">
            Save and reuse report configurations
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Create Template Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 border border-primary-200 rounded-lg bg-primary-50"
        >
          <h4 className="font-medium text-gray-900 mb-3">
            Create New Template
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Template Name"
              value={newTemplate.name}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTemplate.description}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={newTemplate.type}
              onChange={(e) =>
                setNewTemplate({
                  ...newTemplate,
                  type: e.target.value as ReportType,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Templates List */}
      <div className="space-y-3">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedTemplateId === template.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`p-2 rounded-lg ${getTypeColor(template.type)}`}
                >
                  {getTypeIcon(template.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">
                      {template.name}
                    </h4>
                    {template.isDefault && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        Default
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(template.type)}`}
                    >
                      {template.type.charAt(0).toUpperCase() +
                        template.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {template.defaultFilters.includeCharts && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        📊 Charts
                      </span>
                    )}
                    {template.defaultFilters.includeTransactions && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        📋 Transactions
                      </span>
                    )}
                    {template.defaultFilters.includeBudgets && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        💰 Budgets
                      </span>
                    )}
                    {template.defaultFilters.includeSavings && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        🏦 Savings
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateTemplate(template);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                  title="Duplicate template"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
                {!template.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(template.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                    title="Delete template"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
                {template.isDefault && (
                  <span className="text-xs text-gray-400 ml-1">
                    <StarIcon className="w-3 h-3 inline" />
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div className="text-center py-8">
          <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No templates saved yet</p>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-2 text-primary-600 hover:text-primary-700"
          >
            Create your first template
          </button>
        </div>
      )}

      {/* Template Stats */}
      {templates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>{templates.length} templates available</span>
          <div className="flex gap-4">
            <span>{templates.filter((t) => t.isDefault).length} default</span>
            <span>
              {templates.filter((t) => t.type === "monthly").length} monthly
            </span>
            <span>
              {templates.filter((t) => t.type === "yearly").length} yearly
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
