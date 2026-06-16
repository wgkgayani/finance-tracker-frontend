// src/app/(dashboard)/analytics/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DownloadIcon,
  FilterIcon,
  CalendarIcon,
  RefreshCwIcon,
} from "lucide-react";
import { analyticsService } from "@/services/analytics/analytics.service";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import SpendingChart from "@/components/analytics/SpendingChart";
import MonthlyTrends from "@/components/analytics/MonthlyTrends";
import CashFlowChart from "@/components/analytics/CashFlowChart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [cashFlow, setCashFlow] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(6);
  const [days, setDays] = useState(30);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [months, days]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        summaryData,
        categoryData,
        trendsData,
        cashFlowData,
        insightsData,
      ] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategorySpending(),
        analyticsService.getMonthlyTrends(months),
        analyticsService.getCashFlow(days),
        analyticsService.getInsights(),
      ]);

      setSummary(summaryData);
      setCategoryData(categoryData);
      setMonthlyTrends(trendsData);
      setCashFlow(cashFlowData);
      setInsights(insightsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "pdf" | "excel") => {
    try {
      setExporting(true);
      const filename = `analytics-report-${new Date().toISOString().split("T")[0]}.${format}`;
      await analyticsService.downloadExport(format, filename);
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export analytics. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Deep insights into your spending patterns and financial health
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
          </select>
          <button
            onClick={() => handleExport("pdf")}
            disabled={exporting}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            {exporting ? "Exporting..." : "Export"}
          </button>
          <button
            onClick={fetchAllData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary */}
      {summary && <AnalyticsSummary data={summary} />}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                insight.type === "warning"
                  ? "bg-yellow-50 border-yellow-200"
                  : insight.type === "success"
                    ? "bg-green-50 border-green-200"
                    : insight.type === "danger"
                      ? "bg-red-50 border-red-200"
                      : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`text-2xl ${
                    insight.type === "warning"
                      ? "text-yellow-600"
                      : insight.type === "success"
                        ? "text-green-600"
                        : insight.type === "danger"
                          ? "text-red-600"
                          : "text-blue-600"
                  }`}
                >
                  {insight.type === "warning"
                    ? "⚠️"
                    : insight.type === "success"
                      ? "✅"
                      : insight.type === "danger"
                        ? "🔴"
                        : "💡"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {insight.message}
                  </p>
                  {insight.recommendation && (
                    <p className="text-sm text-gray-700 mt-2">
                      💡 {insight.recommendation}
                    </p>
                  )}
                  {insight.metric && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            insight.type === "success"
                              ? "bg-green-500"
                              : insight.type === "warning"
                                ? "bg-yellow-500"
                                : insight.type === "danger"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                          }`}
                          style={{ width: `${Math.min(insight.metric, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {insight.metric}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart data={categoryData} />
        <MonthlyTrends data={monthlyTrends} />
      </div>

      {/* Cash Flow */}
      <CashFlowChart data={cashFlow} />

      {/* Quick Stats */}
      {summary && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">
            Financial Health Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-primary-200">Savings Rate</p>
              <p className="text-2xl font-bold">
                {summary.savingsRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-primary-200">Transactions</p>
              <p className="text-2xl font-bold">{summary.transactionCount}</p>
            </div>
            <div>
              <p className="text-sm text-primary-200">Highest Spending</p>
              <p className="text-2xl font-bold">
                ${summary.highestSpendingAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-primary-200">Avg Daily Spending</p>
              <p className="text-2xl font-bold">
                ${summary.averageDailySpending.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
