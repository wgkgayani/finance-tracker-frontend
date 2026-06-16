// src/components/budgets/BudgetForm.tsx

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Budget } from "@/types/budget.types";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Education",
  "Housing",
  "Savings",
  "Personal Care",
  "Gifts",
  "Travel",
  "Insurance",
  "Taxes",
  "Other",
];

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  editingBudget?: Budget | null;
}

export default function BudgetForm({
  isOpen,
  onClose,
  onSubmit,
  editingBudget,
}: BudgetFormProps) {
  // Get current date once when component mounts
  const currentDate = useMemo(() => new Date(), []);

  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    alertsEnabled: true,
    alertThreshold: 80,
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when editingBudget changes or modal opens
  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category,
        limit: editingBudget.limit.toString(),
        month: editingBudget.month,
        year: editingBudget.year,
        alertsEnabled: editingBudget.alertsEnabled,
        alertThreshold: editingBudget.alertThreshold,
        notes: editingBudget.notes || "",
      });
    } else if (isOpen) {
      // Reset to default when opening new budget form
      setFormData({
        category: "",
        limit: "",
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        alertsEnabled: true,
        alertThreshold: 80,
        notes: "",
      });
      setErrors({});
    }
  }, [editingBudget, isOpen, currentDate]); // Added proper dependencies

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.limit) newErrors.limit = "Budget limit is required";
    if (parseFloat(formData.limit) <= 0)
      newErrors.limit = "Limit must be greater than 0";
    if (formData.alertThreshold < 0 || formData.alertThreshold > 100) {
      newErrors.alertThreshold = "Alert threshold must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        limit: parseFloat(formData.limit),
      });
    } catch (error) {
      console.error("Error saving budget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      category: "",
      limit: "",
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      alertsEnabled: true,
      alertThreshold: 80,
      notes: "",
    });
    setErrors({});
  }, [currentDate]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(2024, i, 1).toLocaleString("default", {
          month: "long",
        }),
      })),
    [],
  );

  const years = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i),
    [currentDate],
  );

  // If modal is not open, don't render
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={handleClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={handleClose}
          />

          {/* Modal panel */}
          <div
            className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {editingBudget ? "Edit Budget" : "Create New Budget"}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Limit ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.limit}
                    onChange={(e) =>
                      setFormData({ ...formData, limit: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0.00"
                  />
                  {errors.limit && (
                    <p className="mt-1 text-sm text-red-600">{errors.limit}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month
                    </label>
                    <select
                      value={formData.month}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          month: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.alertsEnabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alertsEnabled: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Enable budget alerts
                    </span>
                  </label>
                </div>

                {formData.alertsEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alert when spending reaches (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.alertThreshold}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alertThreshold: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.alertThreshold && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.alertThreshold}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="mt-5 sm:mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingBudget
                        ? "Update Budget"
                        : "Create Budget"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
