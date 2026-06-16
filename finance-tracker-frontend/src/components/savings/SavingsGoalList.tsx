// src/components/savings/SavingsGoalList.tsx

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PencilIcon,
  TrashIcon,
  TargetIcon,
  TrendingUpIcon,
  CalendarIcon,
  PlusIcon,
  CheckCircleIcon,
} from "lucide-react";
import { SavingsGoal } from "@/types/savings.types";
import { format, differenceInDays } from "date-fns";

interface SavingsGoalListProps {
  goals: SavingsGoal[];
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: number) => void;
  onAddContribution: (id: number, amount: number) => Promise<void>;
}

export default function SavingsGoalList({
  goals,
  onEdit,
  onDelete,
  onAddContribution,
}: SavingsGoalListProps) {
  const [contributingGoalId, setContributingGoalId] = useState<number | null>(
    null,
  );
  const [contributionAmount, setContributionAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            ✅ Completed
          </span>
        );
      case "archived":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            📦 Archived
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            🎯 Active
          </span>
        );
    }
  };

  const handleContribute = async (id: number) => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) return;

    setIsContributing(true);
    try {
      await onAddContribution(id, parseFloat(contributionAmount));
      setContributingGoalId(null);
      setContributionAmount("");
    } catch (error) {
      console.error("Error adding contribution:", error);
    } finally {
      setIsContributing(false);
    }
  };

  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <TargetIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No savings goals
          </h3>
          <p className="text-sm text-gray-500">
            Create your first savings goal to start building wealth
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal, index) => {
        const daysRemaining = differenceInDays(
          new Date(goal.deadline),
          new Date(),
        );
        const isUrgent = daysRemaining < 30 && goal.status === "active";
        const isOverdue = daysRemaining < 0 && goal.status === "active";

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all ${
              isOverdue
                ? "border-red-300"
                : isUrgent
                  ? "border-orange-300"
                  : "border-gray-200"
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full ${getPriorityColor(goal.priority)} flex items-center justify-center`}
                  >
                    <TargetIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-xs text-gray-500">
                      {goal.category || "Uncategorized"}
                    </p>
                  </div>
                </div>
                {getStatusBadge(goal.status)}
              </div>

              {/* Amount */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    ${goal.currentAmount.toLocaleString()} / $
                    {goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(goal.progress, 100)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`h-2.5 rounded-full ${
                      goal.progress >= 100
                        ? "bg-green-500"
                        : goal.progress >= 75
                          ? "bg-blue-500"
                          : goal.progress >= 50
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    {goal.progress.toFixed(1)}% complete
                  </span>
                  <span className="text-xs text-gray-400">
                    ${(goal.targetAmount - goal.currentAmount).toLocaleString()}{" "}
                    remaining
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    Due: {format(new Date(goal.deadline), "MMM dd, yyyy")}
                    {daysRemaining > 0 && ` (${daysRemaining} days left)`}
                    {daysRemaining === 0 && " (Today!)"}
                    {daysRemaining < 0 &&
                      ` (Overdue by ${Math.abs(daysRemaining)} days)`}
                  </span>
                </div>
                {goal.monthlyContribution && goal.monthlyContribution > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUpIcon className="w-4 h-4" />
                    <span>
                      Monthly: ${goal.monthlyContribution.toLocaleString()}
                    </span>
                  </div>
                )}
                {goal.notes && (
                  <p className="text-sm text-gray-500 mt-2">{goal.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                {goal.status === "active" && (
                  <button
                    onClick={() => setContributingGoalId(goal.id)}
                    className="flex-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Funds
                  </button>
                )}

                {contributingGoalId === goal.id && (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => handleContribute(goal.id)}
                      disabled={isContributing}
                      className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {isContributing ? "..." : "Add"}
                    </button>
                    <button
                      onClick={() => setContributingGoalId(null)}
                      className="px-2 py-1 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {goal.status === "active" && (
                  <>
                    <button
                      onClick={() => onEdit(goal)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(goal.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
