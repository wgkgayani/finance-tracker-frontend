"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react";

interface Insight {
  type: string;
  message: string;
  action: string;
}

interface AIInsightsWidgetProps {
  insights?: Insight[];
}

const insightStyles = {
  success: {
    icon: CheckCircle,
    bg: "bg-success-50",
    border: "border-success-200",
    iconColor: "text-success-600",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning-50",
    border: "border-warning-200",
    iconColor: "text-warning-600",
  },
  info: {
    icon: Info,
    bg: "bg-info-50",
    border: "border-info-200",
    iconColor: "text-info-600",
  },
} as const;

export default function AIInsightsWidget({
  insights = [],
}: AIInsightsWidgetProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <Link
          href="/ai-insights"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all
        </Link>
      </div>

      {insights.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No insights available yet
        </p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const style =
              insightStyles[insight.type as keyof typeof insightStyles] ??
              insightStyles.info;
            const Icon = style.icon;

            return (
              <div
                key={index}
                className={`rounded-lg border p-3 ${style.bg} ${style.border}`}
              >
                <div className="flex items-start gap-2">
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.iconColor}`} />
                  <div>
                    <p className="text-sm text-gray-800">{insight.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{insight.action}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
