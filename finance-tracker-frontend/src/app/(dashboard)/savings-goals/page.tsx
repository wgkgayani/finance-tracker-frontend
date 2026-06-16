// src/app/(dashboard)/savings-goals/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  TargetIcon,
  TrendingUpIcon,
  CheckCircleIcon,
} from "lucide-react";
import { savingsService } from "@/services/savings/savings.service";
import SavingsGoalForm from "@/components/savings/SavingsGoalForm";
import SavingsGoalList from "@/components/savings/SavingsGoalList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SavingsGoal } from "@/types/savings.types";
import toast from "react-hot-toast";

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [goalsData, summaryData] = await Promise.all([
        savingsService.getAll(filter === "all" ? undefined : filter),
        savingsService.getSummary(),
      ]);
      setGoals(Array.isArray(goalsData) ? goalsData : []);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching savings data:", error);
      toast.error("Failed to load savings goals");
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (data: any) => {
    try {
      await savingsService.create(data);
      toast.success("Savings goal created successfully");
      await fetchData();
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create goal");
      throw error;
    }
  };

  const handleUpdateGoal = async (data: any) => {
    if (!editingGoal) return;
    try {
      await savingsService.update(editingGoal.id, data);
      toast.success("Savings goal updated successfully");
      await fetchData();
      setShowForm(false);
      setEditingGoal(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update goal");
      throw error;
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this savings goal?")) {
      try {
        await savingsService.delete(id);
        toast.success("Savings goal deleted");
        await fetchData();
      } catch (error) {
        toast.error("Failed to delete goal");
      }
    }
  };

  const handleAddContribution = async (id: number, amount: number) => {
    try {
      await savingsService.addContribution(id, amount);
      toast.success(`Added $${amount.toLocaleString()} to goal`);
      await fetchData();
    } catch (error) {
      toast.error("Failed to add contribution");
      throw error;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Savings Goals
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your progress towards your financial goals
          </p>
        </div>
        <button
          onClick={() => {
            setEditingGoal(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Goal
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-500">Total Goals</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary.totalGoals}
            </p>
            <p className="text-xs text-gray-400">
              {summary.activeGoals} active
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-500">Total Saved</p>
            <p className="text-2xl font-bold text-green-600">
              ${summary.totalSavedAmount?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-400">
              of ${summary.totalTargetAmount?.toLocaleString() || 0}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-500">Overall Progress</p>
            <p className="text-2xl font-bold text-primary-600">
              {summary.overallProgress?.toFixed(1) || 0}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(summary.overallProgress || 0, 100)}%`,
                }}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-blue-600">
              {summary.completedGoals}
            </p>
            <p className="text-xs text-gray-400">🎉 Goals achieved</p>
          </motion.div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "active", "completed", "archived"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <SavingsGoalList
        goals={goals}
        onEdit={(goal) => {
          setEditingGoal(goal);
          setShowForm(true);
        }}
        onDelete={handleDeleteGoal}
        onAddContribution={handleAddContribution}
      />

      {/* Savings Goal Form Modal */}
      {showForm && (
        <SavingsGoalForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingGoal(null);
          }}
          onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
          editingGoal={editingGoal}
        />
      )}
    </div>
  );
}
