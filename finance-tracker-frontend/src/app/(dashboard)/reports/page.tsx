// src/app/(dashboard)/reports/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  SparklesIcon,
} from "lucide-react";

// 👇 ALL IMPORTS GO HERE
import ReportGenerator from "@/components/reports/ReportGenerator";
import ReportTemplates from "@/components/reports/ReportTemplates";
import ExportOptions from "@/components/reports/ExportOptions";
import ReportPreview from "@/components/reports/ReportPreview";

import { reportService } from "@/services/reports/report.service";
import {
  ReportData,
  ReportFormat,
  ReportTemplate,
  ExportOptions as ExportOptionsType,
} from "@/types/report.types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

export default function ReportsPage() {
  // State variables
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
  const [savedReports, setSavedReports] = useState<ReportData[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"generate" | "templates">(
    "generate",
  );

  // Load saved reports on mount
  useEffect(() => {
    fetchSavedReports();
  }, []);

  const fetchSavedReports = async () => {
    try {
      const data = await reportService.getSavedReports();
      setSavedReports(data);
    } catch (error) {
      console.error("Error fetching saved reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 HANDLER FUNCTIONS (these are what you reference in the imports)
  const handleReportGenerated = (report: ReportData) => {
    setCurrentReport(report);
    toast.success("Report generated successfully!");
  };

  const handleExport = async (
    format: ReportFormat,
    options?: ExportOptionsType,
  ) => {
    if (!currentReport) {
      toast.error("No report to export");
      return;
    }

    try {
      setIsExporting(true);
      await reportService.downloadReport(currentReport, format);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    toast.success(`Template "${template.name}" selected`);
  };

  const handleSaveTemplate = (template: ReportTemplate) => {
    toast.success(`Template "${template.name}" saved`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Share functionality
    toast.success("Share link copied to clipboard");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate and download detailed financial reports
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ClockIcon className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("generate")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "generate"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Generate Report
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "templates"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Templates
        </button>
        {savedReports.length > 0 && (
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "saved"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Saved ({savedReports.length})
          </button>
        )}
      </div>

      {/* 👇 USAGE OF IMPORTED COMPONENTS */}
      {activeTab === "generate" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Report Generator */}
          <div className="lg:col-span-2">
            <ReportGenerator
              onReportGenerated={handleReportGenerated}
              onExport={handleExport}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column - Export Options */}
          <div>
            <ExportOptions
              onExport={handleExport}
              onPrint={handlePrint}
              onShare={handleShare}
              isExporting={isExporting}
            />
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportTemplates
            onSelectTemplate={handleSelectTemplate}
            onSaveTemplate={handleSaveTemplate}
            selectedTemplateId={selectedTemplate?.id}
          />

          {/* Template Preview */}
          {selectedTemplate && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">
                  Template Preview
                </h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  {selectedTemplate.description}
                </p>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Includes:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTemplate.defaultFilters.includeCharts && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        📊 Charts
                      </span>
                    )}
                    {selectedTemplate.defaultFilters.includeTransactions && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        📋 Transactions
                      </span>
                    )}
                    {selectedTemplate.defaultFilters.includeBudgets && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        💰 Budgets
                      </span>
                    )}
                    {selectedTemplate.defaultFilters.includeSavings && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        🏦 Savings
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    toast.success(`Template "${selectedTemplate.name}" loaded`);
                  }}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setCurrentReport(report)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <FileTextIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {report.status === "ready" ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircleIcon className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <span>
                  ${report.summary.totalIncome.toLocaleString()} income
                </span>
                <span>
                  ${report.summary.totalExpense.toLocaleString()} expenses
                </span>
                <span className="text-green-600">
                  ${report.summary.netSavings.toLocaleString()} saved
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Report Preview Section */}
      {currentReport && activeTab === "generate" && (
        <div className="mt-6">
          <ReportPreview
            report={currentReport}
            onDownload={(format) => handleExport(format)}
            onPrint={handlePrint}
          />
        </div>
      )}
    </div>
  );
}
