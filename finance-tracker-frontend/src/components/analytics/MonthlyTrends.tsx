// src/components/analytics/MonthlyTrends.tsx

"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { MonthlyTrend } from "@/types/analytics.types";

interface MonthlyTrendsProps {
  data: MonthlyTrend[];
  type?: "line" | "area";
}

export default function MonthlyTrends({
  data,
  type = "line",
}: MonthlyTrendsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Trends
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    month: `${item.month} ${item.year}`,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: ${item.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Income vs Expenses Trend
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={3}
                name="Income"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={3}
                name="Expense"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Savings"
                dot={{ r: 4 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stackId="1"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.3}
                name="Expense"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Avg Income</p>
          <p className="text-lg font-semibold text-green-600">
            $
            {(
              data.reduce((sum, d) => sum + d.income, 0) / data.length
            ).toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Avg Expense</p>
          <p className="text-lg font-semibold text-red-600">
            $
            {(
              data.reduce((sum, d) => sum + d.expense, 0) / data.length
            ).toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Avg Savings</p>
          <p className="text-lg font-semibold text-blue-600">
            $
            {(
              data.reduce((sum, d) => sum + d.savings, 0) / data.length
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
