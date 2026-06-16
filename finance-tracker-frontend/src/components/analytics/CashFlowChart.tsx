// src/components/analytics/CashFlowChart.tsx

"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { CashFlowData } from "@/types/analytics.types";

interface CashFlowChartProps {
  data: CashFlowData[];
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
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

  const minBalance = Math.min(...data.map((d) => d.balance));
  const maxBalance = Math.max(...data.map((d) => d.balance));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cash Flow Analysis
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => `$${value}`}
              domain={[minBalance - 100, maxBalance + 100]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="right"
              dataKey="income"
              fill="#10B981"
              name="Income"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="expense"
              fill="#EF4444"
              name="Expense"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="balance"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Balance"
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-lg font-semibold text-green-600">
            ${data.reduce((sum, d) => sum + d.income, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Total Expense</p>
          <p className="text-lg font-semibold text-red-600">
            ${data.reduce((sum, d) => sum + d.expense, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Ending Balance</p>
          <p className="text-lg font-semibold text-blue-600">
            ${data[data.length - 1]?.balance?.toLocaleString() || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
