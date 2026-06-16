// src/app/(dashboard)/budgets/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusIcon, BellIcon } from "@heroicons/react/24/outline";
import { budgetService } from "@/services/budgets/budget.service";
import BudgetList from "@/components/budgets/BudgetList";
import BudgetForm from "@/components/budgets/BudgetForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Budget, BudgetAlert } from "@/types/budget.types";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    fetchBudgets();
    fetchAlerts();
  }, [selectedMonth, selectedYear]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await budgetService.getAll(selectedMonth, selectedYear);
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to load budgets");
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const data = await budgetService.getAlerts();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setAlerts([]);
    }
  };

  const handleCreateBudget = async (data: any) => {
    try {
      await budgetService.create(data);
      toast.success("Budget created successfully");
      await fetchBudgets();
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create budget");
      throw error;
    }
  };

  const handleUpdateBudget = async (data: any) => {
    if (!editingBudget) return;
    try {
      await budgetService.update(editingBudget.id, data);
      toast.success("Budget updated successfully");
      await fetchBudgets();
      setShowForm(false);
      setEditingBudget(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update budget");
      throw error;
    }
  };

  const handleDeleteBudget = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await budgetService.delete(id);
        toast.success("Budget deleted successfully");
        await fetchBudgets();
      } catch (error) {
        toast.error("Failed to delete budget");
      }
    }
  };

  const openBudgetForm = () => {
    console.log("Opening budget form..."); // Debug log
    setEditingBudget(null);
    setShowForm(true);
  };

  const closeBudgetForm = () => {
    console.log("Closing budget form..."); // Debug log
    setShowForm(false);
    setEditingBudget(null);
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Budgets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set monthly spending limits and track your progress
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Toggle alerts"
            >
              <BellIcon className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {showAlerts && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">Budget Alerts</h4>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No alerts at this time
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-2 h-2 mt-1.5 rounded-full ${
                              alert.severity === "critical"
                                ? "bg-red-500"
                                : alert.severity === "warning"
                                  ? "bg-orange-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                          <div>
                            <p className="text-sm text-gray-800">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {format(
                                new Date(alert.createdAt),
                                "MMM dd, h:mm a",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Set Budget Button */}
          <button
            onClick={openBudgetForm}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
            aria-label="Set new budget"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Set Budget
          </button>
        </div>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Period:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i, 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - 2 + i,
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Budget Summary Cards */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">
              ${budgets.reduce((sum, b) => sum + b.limit, 0).toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold text-red-600">
              ${budgets.reduce((sum, b) => sum + b.spent, 0).toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-500">Total Remaining</p>
            <p className="text-2xl font-bold text-green-600">
              $
              {budgets
                .reduce((sum, b) => sum + (b.limit - b.spent), 0)
                .toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-500">Active Budgets</p>
            <p className="text-2xl font-bold text-primary-600">
              {budgets.length}
            </p>
          </motion.div>
        </div>
      )}

      {/* Budget List */}
      <BudgetList
        budgets={budgets}
        onEdit={(budget) => {
          setEditingBudget(budget);
          setShowForm(true);
        }}
        onDelete={handleDeleteBudget}
      />

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm
          isOpen={showForm}
          onClose={closeBudgetForm}
          onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget}
          editingBudget={editingBudget}
        />
      )}
    </div>
  );
}
