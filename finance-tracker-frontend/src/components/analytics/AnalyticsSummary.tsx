// src/components/analytics/AnalyticsSummary.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
  PiggyBankIcon,
  CalendarIcon,
  CreditCardIcon,
} from "lucide-react";
import { AnalyticsSummary as AnalyticsSummaryType } from "@/types/analytics.types";

interface AnalyticsSummaryProps {
  data: AnalyticsSummaryType;
}

export default function AnalyticsSummary({ data }: AnalyticsSummaryProps) {
  const cards = [
    {
      title: "Total Income",
      value: `$${data.totalIncome.toLocaleString()}`,
      icon: TrendingUpIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
      subtitle: `${data.incomeCount} transactions`,
    },
    {
      title: "Total Expenses",
      value: `$${data.totalExpense.toLocaleString()}`,
      icon: TrendingDownIcon,
      color: "text-red-600",
      bgColor: "bg-red-100",
      subtitle: `${data.expenseCount} transactions`,
    },
    {
      title: "Net Savings",
      value: `$${data.netSavings.toLocaleString()}`,
      icon: PiggyBankIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      subtitle: `${data.savingsRate.toFixed(1)}% of income`,
    },
    {
      title: "Daily Average",
      value: `$${data.averageDailySpending.toFixed(2)}`,
      icon: WalletIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      subtitle: "Per day spending",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <span className="text-xs text-gray-400">{card.subtitle}</span>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
