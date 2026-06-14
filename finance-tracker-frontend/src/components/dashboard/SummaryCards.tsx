"use client";

import {
  ArrowDown,
  ArrowUp,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { DashboardData } from "@/services/dashboard/dashboard.service";

interface SummaryCardsProps {
  data: DashboardData | null;
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Income",
      value: `$${data?.totalIncome?.toLocaleString() || "0"}`,
      icon: TrendingUp,
      color: "text-success-600",
      bgColor: "bg-success-50",
      trend: "+12%",
      trendUp: true,
      description: "vs last month",
    },
    {
      title: "Total Expenses",
      value: `$${data?.totalExpense?.toLocaleString() || "0"}`,
      icon: TrendingDown,
      color: "text-danger-600",
      bgColor: "bg-danger-50",
      trend: "+5%",
      trendUp: false,
      description: "vs last month",
    },
    {
      title: "Net Savings",
      value: `$${data?.savings?.toLocaleString() || "0"}`,
      icon: PiggyBank,
      color: "text-info-600",
      bgColor: "bg-info-50",
      trend: `${data?.savingsRate?.toFixed(1) || 0}%`,
      trendUp: true,
      description: "of income",
    },
    {
      title: "Budget Left",
      value: `$${data?.remainingBudget?.toLocaleString() || "0"}`,
      icon: Wallet,
      color: "text-warning-600",
      bgColor: "bg-warning-50",
      trend: `${data?.budgetUsage || 0}%`,
      trendUp: false,
      description: "used",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 overflow-hidden border border-gray-100 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    card.trendUp ? "text-success-600" : "text-danger-600"
                  }`}
                >
                  {card.trendUp ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">{card.trend}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-400 mt-2">{card.description}</p>
              </div>
            </div>

            {card.title === "Budget Left" && data?.budgetUsage && (
              <div className="h-1 bg-gray-100">
                <div
                  className="h-full bg-warning-500 transition-all duration-500"
                  style={{ width: `${data.budgetUsage}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
