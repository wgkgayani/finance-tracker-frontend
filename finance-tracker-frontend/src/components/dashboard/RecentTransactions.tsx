"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  type: string;
  date: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export default function RecentTransactions({
  transactions = [],
}: RecentTransactionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h3>
        <Link
          href="/transactions"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No recent transactions
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "INCOME";

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isIncome ? "bg-success-50" : "bg-danger-50"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4 text-success-600" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-danger-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.category} · {transaction.date}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm font-semibold shrink-0 ml-4 ${
                    isIncome ? "text-success-600" : "text-gray-900"
                  }`}
                >
                  {isIncome ? "+" : "-"}${transaction.amount.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
