// src/components/dashboard/BudgetProgress.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp } from "lucide-react";

interface Budget {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
}

interface BudgetProgressProps {
  budgets?: Budget[];
}

export default function BudgetProgress({ budgets = [] }: BudgetProgressProps) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Budget Progress
        </h3>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">No budgets set</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
        <Wallet className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {budgets.map((budget, index) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isOverBudget = percentage >= 100;
          const isWarning = percentage >= 80 && !isOverBudget;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">
                  {budget.category}
                </span>
                <span className="text-gray-600">
                  ${budget.spent.toLocaleString()} / $
                  {budget.limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    isOverBudget
                      ? "bg-red-500"
                      : isWarning
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">
                  {isOverBudget
                    ? "Over budget"
                    : `${Math.round(percentage)}% used`}
                </span>
                <span className="text-xs text-gray-400">
                  ${budget.remaining.toLocaleString()} remaining
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
