// src/components/reports/ReportPreview.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DownloadIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  PrinterIcon,
  Share2Icon,
} from "lucide-react";
import { ReportData, ReportFormat } from "@/types/report.types";
import { format } from "date-fns";

interface ReportPreviewProps {
  report: ReportData;
  onDownload: (format: ReportFormat) => void;
  onPrint: () => void;
}

export default function ReportPreview({
  report,
  onDownload,
  onPrint,
}: ReportPreviewProps) {
  const [selectedFormat, setSelectedFormat] =
    React.useState<ReportFormat>("pdf");

  const formats: { value: ReportFormat; label: string; icon: any }[] = [
    { value: "pdf", label: "PDF", icon: FileIcon },
    { value: "excel", label: "Excel", icon: FileSpreadsheetIcon },
    { value: "csv", label: "CSV", icon: FileTextIcon },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {report.title}
            </h3>
            <p className="text-sm text-gray-500">
              Generated{" "}
              {format(new Date(report.generatedAt), "MMM dd, yyyy h:mm a")}
            </p>
          </div>
          <div className="flex gap-2">
            {formats.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSelectedFormat(value)}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  selectedFormat === value
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {/* Summary Section */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Financial Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-lg font-bold text-green-600">
                ${report.summary.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-lg font-bold text-red-600">
                ${report.summary.totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Net Savings</p>
              <p className="text-lg font-bold text-blue-600">
                ${report.summary.netSavings.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Savings Rate</p>
              <p className="text-lg font-bold text-purple-600">
                {report.summary.savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Top Category */}
        {report.summary.topCategory && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Top Spending Category</p>
            <p className="font-semibold text-gray-900">
              {report.summary.topCategory} - $
              {report.summary.topCategoryAmount.toLocaleString()}
            </p>
          </div>
        )}

        {/* Transactions Preview */}
        {report.transactions.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Recent Transactions
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report.transactions.slice(0, 10).map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {tx.date}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {tx.description}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            tx.type === "INCOME"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-2 text-sm text-right font-medium ${
                          tx.type === "INCOME"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "INCOME" ? "+" : "-"}$
                        {tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Insights */}
        {report.insights.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">AI Insights</h4>
            <ul className="space-y-2">
              {report.insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="text-primary-600">💡</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => onDownload(selectedFormat)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download {selectedFormat.toUpperCase()}
          </button>
          <button
            onClick={onPrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </button>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Share2Icon className="w-4 h-4 mr-2" />
          Share
        </button>
      </div>
    </div>
  );
}
