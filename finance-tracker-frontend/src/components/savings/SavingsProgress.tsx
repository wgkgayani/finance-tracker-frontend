// src/components/savings/SavingsProgress.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TargetIcon,
  CalendarIcon,
  TrendingUpIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import {
  SavingsGoal,
  SavingsProgress as SavingsProgressType,
} from "@/types/savings.types";
import { format, differenceInDays, differenceInMonths } from "date-fns";

interface SavingsProgressProps {
  goal: SavingsGoal;
  progress: SavingsProgressType;
  onAddContribution?: (amount: number) => void;
  onEdit?: () => void;
}

export default function SavingsProgress({
  goal,
  progress,
  onAddContribution,
  onEdit,
}: SavingsProgressProps) {
  const [showContribution, setShowContribution] = React.useState(false);
  const [contributionAmount, setContributionAmount] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const daysRemaining = differenceInDays(new Date(goal.deadline), new Date());
  const monthsRemaining = differenceInMonths(
    new Date(goal.deadline),
    new Date(),
  );
  const isUrgent = daysRemaining < 30 && goal.status === "active";
  const isOverdue = daysRemaining < 0 && goal.status === "active";

  const getStatusColor = () => {
    if (goal.status === "completed") return "text-green-600 border-green-500";
    if (isOverdue) return "text-red-600 border-red-500";
    if (isUrgent) return "text-orange-600 border-orange-500";
    return "text-blue-600 border-blue-500";
  };

  const getProgressColor = () => {
    if (progress.percentageComplete >= 100) return "bg-green-500";
    if (progress.percentageComplete >= 75) return "bg-blue-500";
    if (progress.percentageComplete >= 50) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getStatusMessage = () => {
    if (goal.status === "completed") return "🎉 Goal completed! Great job!";
    if (isOverdue)
      return "⚠️ Goal is overdue! Consider adjusting your timeline.";
    if (isUrgent)
      return `🔥 ${daysRemaining} days remaining! Time to accelerate.`;
    if (progress.onTrack) return "✅ On track! Keep up the good work.";
    return "⚠️ You're falling behind. Consider increasing contributions.";
  };

  const handleSubmitContribution = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) return;

    setIsSubmitting(true);
    try {
      await onAddContribution?.(parseFloat(contributionAmount));
      setContributionAmount("");
      setShowContribution(false);
    } catch (error) {
      console.error("Error adding contribution:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`p-6 border-b ${getStatusColor()} border-opacity-20`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full ${getStatusColor()} bg-opacity-10 flex items-center justify-center`}
            >
              <TargetIcon className={`w-6 h-6 ${getStatusColor()}`} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {goal.name}
              </h3>
              <p className="text-sm text-gray-500">
                {goal.category || "Uncategorized"}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              goal.status === "completed"
                ? "bg-green-100 text-green-800"
                : goal.status === "archived"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              ${goal.currentAmount.toLocaleString()} / $
              {goal.targetAmount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(progress.percentageComplete, 100)}%`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-3 rounded-full ${getProgressColor()}`}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">
              {progress.percentageComplete.toFixed(1)}% complete
            </span>
            <span className="text-xs text-gray-400">
              ${progress.remainingAmount.toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Status Message */}
        <div
          className={`p-3 rounded-lg ${
            goal.status === "completed"
              ? "bg-green-50"
              : isOverdue
                ? "bg-red-50"
                : isUrgent
                  ? "bg-orange-50"
                  : progress.onTrack
                    ? "bg-blue-50"
                    : "bg-yellow-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {goal.status === "completed" ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            ) : isOverdue || isUrgent ? (
              <AlertCircleIcon className="w-5 h-5 text-red-600" />
            ) : progress.onTrack ? (
              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
            ) : (
              <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
            )}
            <p
              className={`text-sm ${
                goal.status === "completed"
                  ? "text-green-800"
                  : isOverdue
                    ? "text-red-800"
                    : isUrgent
                      ? "text-orange-800"
                      : progress.onTrack
                        ? "text-blue-800"
                        : "text-yellow-800"
              }`}
            >
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <TargetIcon className="w-4 h-4" />
              <span className="text-xs">Target</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              ${goal.targetAmount.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs">Deadline</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {format(new Date(goal.deadline), "MMM dd, yyyy")}
            </p>
            {daysRemaining > 0 && (
              <p className="text-xs text-gray-500">{daysRemaining} days left</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <TrendingUpIcon className="w-4 h-4" />
              <span className="text-xs">Monthly</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              ${goal.monthlyContribution?.toLocaleString() || "0"}
            </p>
            <p className="text-xs text-gray-500">
              Recommended: ${progress.monthlyRecommended.toFixed(0)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <ClockIcon className="w-4 h-4" />
              <span className="text-xs">Daily</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              ${progress.dailyRecommended.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">To reach on time</p>
          </div>
        </div>

        {/* Action Buttons */}
        {goal.status === "active" && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {!showContribution ? (
              <>
                <button
                  onClick={() => setShowContribution(true)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Contribution
                </button>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Edit Goal
                  </button>
                )}
              </>
            ) : (
              <div className="flex-1 flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSubmitContribution}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
                <button
                  onClick={() => setShowContribution(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
