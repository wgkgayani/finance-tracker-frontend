// src/components/budgets/BudgetList.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  PencilIcon,
  TrashIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from "lucide-react";
import { Budget } from "@/types/budget.types";

interface BudgetListProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: number) => void;
}

export default function BudgetList({
  budgets,
  onEdit,
  onDelete,
}: BudgetListProps) {
  const getStatusColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 90) return "bg-orange-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusIcon = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100)
      return <AlertTriangleIcon className="w-4 h-4 text-red-600" />;
    if (percentage >= 90)
      return <AlertTriangleIcon className="w-4 h-4 text-orange-600" />;
    return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
  };

  const getStatusMessage = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    const remaining = limit - spent;
    if (percentage >= 100)
      return `Over budget by $${Math.abs(remaining).toFixed(2)}`;
    if (percentage >= 90) return `Only $${remaining.toFixed(2)} left`;
    if (percentage >= 75) return `$${remaining.toFixed(2)} remaining`;
    return `$${remaining.toFixed(2)} left to spend`;
  };

  if (!budgets || budgets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No budgets set</h3>
          <p className="text-sm text-gray-500">
            Create your first budget to start tracking your spending
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map((budget, index) => {
        const percentage = (budget.spent / budget.limit) * 100;
        const statusColor = getStatusColor(budget.spent, budget.limit);

        return (
          <motion.div
            key={budget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-primary-600">
                      {budget.category.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {budget.category}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(budget.year, budget.month - 1).toLocaleString(
                        "default",
                        { month: "long" },
                      )}{" "}
                      {budget.year}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      console.log("Edit budget:", budget);
                      onEdit(budget);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit budget"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      console.log("Delete budget:", budget.id);
                      onDelete(budget.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete budget"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Spent</span>
                  <span className="font-medium text-gray-900">
                    ${budget.spent.toLocaleString()} / $
                    {budget.limit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`h-2.5 rounded-full ${statusColor}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  {getStatusIcon(budget.spent, budget.limit)}
                  <span className="text-gray-600">
                    {getStatusMessage(budget.spent, budget.limit)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {percentage.toFixed(1)}% used
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
