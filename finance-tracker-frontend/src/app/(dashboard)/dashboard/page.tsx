"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  dashboardService,
  DashboardData,
} from "@/services/dashboard/dashboard.service";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import AIInsightsWidget from "@/components/dashboard/AIInsightsWidget";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-primary-100">
              Here&apos;s your financial summary for{" "}
              {mounted
                ? new Date().toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })
                : "\u00A0"}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-sm font-medium">Financial Health Score</p>
            <p className="text-2xl font-bold">
              {dashboardData?.healthScore || 78}/100
            </p>
          </div>
        </div>
      </div>

      <div className="animate-slide-up">
        <SummaryCards data={dashboardData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-slide-up">
            <ExpenseChart data={dashboardData?.categorySpending} />
          </div>

          <div className="animate-slide-up">
            <RecentTransactions
              transactions={dashboardData?.recentTransactions}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="animate-slide-up">
            <BudgetProgress budgets={dashboardData?.budgets} />
          </div>

          <div className="animate-slide-up">
            <AIInsightsWidget insights={dashboardData?.insights} />
          </div>
        </div>
      </div>
    </div>
  );
}
