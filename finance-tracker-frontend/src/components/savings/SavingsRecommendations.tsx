// src/components/savings/SavingsRecommendations.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LightBulbIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  TargetIcon,
} from "lucide-react";
import { SavingsGoal } from "@/types/savings.types";

interface Recommendation {
  id: number;
  goalName: string;
  message: string;
  recommendation: string;
  impact: string;
  priority?: "high" | "medium" | "low";
}

interface SavingsRecommendationsProps {
  recommendations: Recommendation[];
  goals: SavingsGoal[];
  onApplyRecommendation?: (goalId: number, action: string) => void;
  onViewGoal?: (goalId: number) => void;
}

export default function SavingsRecommendations({
  recommendations,
  goals,
  onApplyRecommendation,
  onViewGoal,
}: SavingsRecommendationsProps) {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  if (recommendations.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              All Goals On Track! 🎉
            </h3>
            <p className="text-sm text-gray-600">
              Your savings goals are progressing well. Keep up the great work!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangleIcon className="w-5 h-5 text-red-600" />;
      case "medium":
        return <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return <LightBulbIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
            High Priority
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
            Suggestion
          </span>
        );
    }
  };

  const getGoalProgress = (goalName: string) => {
    const goal = goals.find((g) => g.name === goalName);
    return goal ? goal.progress : 0;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <LightBulbIcon className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          AI-Powered Recommendations
        </h3>
        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
          {recommendations.length} suggestions
        </span>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-xl p-5 ${getPriorityColor(rec.priority)} hover:shadow-md transition-all cursor-pointer`}
            onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getPriorityIcon(rec.priority)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">
                      {rec.goalName}
                    </h4>
                    {getPriorityBadge(rec.priority)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                      <div
                        className="h-1.5 bg-primary-600 rounded-full transition-all duration-500"
                        style={{ width: `${getGoalProgress(rec.goalName)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {getGoalProgress(rec.goalName)}%
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">{rec.message}</p>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedId === rec.id ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="pt-3 space-y-3">
                    <div className="p-3 bg-white/60 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">
                        💡 Recommendation:
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {rec.recommendation}
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-700">
                        📈 Impact:
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {rec.impact}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const goal = goals.find(
                            (g) => g.name === rec.goalName,
                          );
                          if (goal) onViewGoal?.(goal.id);
                        }}
                        className="flex-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <TargetIcon className="w-4 h-4" />
                        View Goal
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyRecommendation?.(rec.id, rec.recommendation);
                        }}
                        className="flex-1 px-3 py-1.5 border border-primary-600 text-primary-600 rounded-lg text-sm hover:bg-primary-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <ArrowRightIcon className="w-4 h-4" />
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(expandedId === rec.id ? null : rec.id);
                  }}
                >
                  {expandedId === rec.id ? "Show less" : "Show more"}
                  <ArrowRightIcon
                    className={`w-3 h-3 transition-transform ${
                      expandedId === rec.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {recommendations.filter((r) => r.priority === "high").length}
          </p>
          <p className="text-xs text-gray-600">High Priority</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {recommendations.filter((r) => r.priority === "medium").length}
          </p>
          <p className="text-xs text-gray-600">Medium Priority</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">
            {
              recommendations.filter(
                (r) => r.priority !== "high" && r.priority !== "medium",
              ).length
            }
          </p>
          <p className="text-xs text-gray-600">Improvements</p>
        </div>
      </div>
    </div>
  );
}
