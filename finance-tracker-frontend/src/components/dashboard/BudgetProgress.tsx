"use client";

import Link from "next/link";

interface Budget {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
}

interface BudgetProgressProps {
  budgets?: Budget[];
}

function getProgressColor(percentage: number) {
  if (percentage >= 90) return "bg-danger-500";
  if (percentage >= 75) return "bg-warning-500";
  return "bg-primary-500";
}

export default function BudgetProgress({ budgets = [] }: BudgetProgressProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
        <Link
          href="/budgets"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Manage
        </Link>
      </div>

      {budgets.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No budgets set up yet
        </p>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = Math.min(
              Math.round((budget.spent / budget.limit) * 100),
              100,
            );

            return (
              <div key={budget.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {budget.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    ${budget.spent} / ${budget.limit}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  ${budget.remaining} remaining
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
