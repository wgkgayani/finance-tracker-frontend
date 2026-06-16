// src/components/savings/SavingsGoalForm.tsx

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SavingsGoal } from "@/types/savings.types";

const categories = [
  "Savings",
  "Emergency",
  "Travel",
  "Electronics",
  "Education",
  "Home",
  "Vehicle",
  "Investment",
  "Health",
  "Wedding",
  "Birthday",
  "Holiday",
  "Other",
];

const priorities = [
  { value: "low", label: "Low", color: "text-blue-600" },
  { value: "medium", label: "Medium", color: "text-yellow-600" },
  { value: "high", label: "High", color: "text-red-600" },
];

interface SavingsGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  editingGoal?: SavingsGoal | null;
}

export default function SavingsGoalForm({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}: SavingsGoalFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
    notes: "",
    automaticSaving: false,
    monthlyContribution: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        name: editingGoal.name,
        targetAmount: editingGoal.targetAmount.toString(),
        deadline: editingGoal.deadline,
        category: editingGoal.category || "",
        priority: editingGoal.priority,
        notes: editingGoal.notes || "",
        automaticSaving: editingGoal.automaticSaving || false,
        monthlyContribution: editingGoal.monthlyContribution?.toString() || "",
      });
    } else if (isOpen) {
      // Reset form when opening new goal
      setFormData({
        name: "",
        targetAmount: "",
        deadline: "",
        category: "",
        priority: "medium",
        notes: "",
        automaticSaving: false,
        monthlyContribution: "",
      });
      setErrors({});
    }
  }, [editingGoal, isOpen]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Goal name is required";
    if (!formData.targetAmount)
      newErrors.targetAmount = "Target amount is required";
    if (parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0";
    }
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    if (new Date(formData.deadline) < new Date()) {
      newErrors.deadline = "Deadline must be in the future";
    }
    if (
      formData.monthlyContribution &&
      parseFloat(formData.monthlyContribution) < 0
    ) {
      newErrors.monthlyContribution =
        "Monthly contribution must be greater than 0";
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
        targetAmount: parseFloat(formData.targetAmount),
        monthlyContribution: formData.monthlyContribution
          ? parseFloat(formData.monthlyContribution)
          : undefined,
      });
    } catch (error) {
      console.error("Error saving goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setFormData({
      name: "",
      targetAmount: "",
      deadline: "",
      category: "",
      priority: "medium",
      notes: "",
      automaticSaving: false,
      monthlyContribution: "",
    });
    setErrors({});
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  const minDate = new Date().toISOString().split("T")[0];

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
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={handleClose}
          />

          <div
            className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {editingGoal
                    ? "Edit Savings Goal"
                    : "Create New Savings Goal"}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="e.g., Emergency Fund, Vacation..."
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.targetAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAmount: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0.00"
                  />
                  {errors.targetAmount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.targetAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                  {errors.deadline && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.deadline}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <div className="flex gap-4">
                    {priorities.map((p) => (
                      <label key={p.value} className="inline-flex items-center">
                        <input
                          type="radio"
                          value={p.value}
                          checked={formData.priority === p.value}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              priority: e.target.value as any,
                            })
                          }
                          className="form-radio text-primary-600"
                        />
                        <span className={`ml-2 text-sm ${p.color}`}>
                          {p.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.automaticSaving}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          automaticSaving: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Enable automatic monthly saving
                    </span>
                  </label>
                </div>

                {formData.automaticSaving && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Contribution ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.monthlyContribution}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monthlyContribution: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="0.00"
                    />
                    {errors.monthlyContribution && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.monthlyContribution}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingGoal
                        ? "Update Goal"
                        : "Create Goal"}
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
