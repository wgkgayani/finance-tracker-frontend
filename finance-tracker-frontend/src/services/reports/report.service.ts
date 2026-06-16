// src/services/reports/report.service.ts

import api from "@/lib/api/axios.config";
import {
  ReportData,
  ReportFilters,
  ReportFormat,
  ReportType,
  ReportTemplate,
  ExportOptions,
} from "@/types/report.types";

// Mock data for development
const mockTemplates: ReportTemplate[] = [
  {
    id: "1",
    name: "Monthly Financial Summary",
    description: "Complete overview of your monthly finances",
    type: "monthly",
    isDefault: true,
    defaultFilters: {
      startDate: "",
      endDate: "",
      includeCharts: true,
      includeTransactions: true,
      includeBudgets: true,
      includeSavings: false,
    },
  },
  {
    id: "2",
    name: "Quarterly Report",
    description: "Quarterly financial performance review",
    type: "quarterly",
    isDefault: false,
    defaultFilters: {
      startDate: "",
      endDate: "",
      includeCharts: true,
      includeTransactions: true,
      includeBudgets: true,
      includeSavings: true,
    },
  },
  {
    id: "3",
    name: "Annual Review",
    description: "Comprehensive yearly financial report",
    type: "yearly",
    isDefault: false,
    defaultFilters: {
      startDate: "",
      endDate: "",
      includeCharts: true,
      includeTransactions: true,
      includeBudgets: true,
      includeSavings: true,
    },
  },
];

export const reportService = {
  // Get report templates
  getTemplates: async (): Promise<ReportTemplate[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockTemplates;
      }
      const response = await api.get("/reports/templates");
      return response.data;
    } catch (error) {
      console.error("Error fetching templates:", error);
      return mockTemplates;
    }
  },

  // Generate a new report
  generateReport: async (
    filters: ReportFilters,
    templateId?: string,
  ): Promise<ReportData> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return generateMockReport(filters);
      }

      const response = await api.post("/reports/generate", {
        filters,
        templateId,
      });
      return response.data;
    } catch (error) {
      console.error("Error generating report:", error);
      return generateMockReport(filters);
    }
  },

  // Export report to file
  exportReport: async (
    reportId: string,
    options: ExportOptions,
  ): Promise<Blob> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Generate mock report data
        const mockData = {
          title: "Financial Report",
          generatedAt: new Date().toISOString(),
          summary: {
            totalIncome: 10000,
            totalExpense: 3250,
            netSavings: 6750,
            savingsRate: 67.5,
            averageDailySpending: 108.33,
            transactionCount: 45,
            topCategory: "Food",
            topCategoryAmount: 1200,
          },
        };

        const content = JSON.stringify(mockData, null, 2);
        return new Blob([content], {
          type:
            options.format === "pdf"
              ? "application/pdf"
              : options.format === "excel"
                ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : "text/csv",
        });
      }

      const response = await api.post(`/reports/${reportId}/export`, options, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error exporting report:", error);
      throw error;
    }
  },

  // Get saved reports
  getSavedReports: async (): Promise<ReportData[]> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [
          {
            id: "1",
            title: "January 2024 Report",
            type: "monthly",
            format: "pdf",
            generatedAt: "2024-02-01T10:00:00Z",
            status: "ready",
            filters: {
              startDate: "2024-01-01",
              endDate: "2024-01-31",
              includeCharts: true,
              includeTransactions: true,
            },
            summary: {
              totalIncome: 8500,
              totalExpense: 2800,
              netSavings: 5700,
              savingsRate: 67.1,
              averageDailySpending: 90.32,
              transactionCount: 35,
              topCategory: "Food",
              topCategoryAmount: 1100,
            },
            charts: [],
            transactions: [],
            budgets: [],
            savings: [],
            insights: [],
          },
        ];
      }
      const response = await api.get("/reports/saved");
      return response.data;
    } catch (error) {
      console.error("Error fetching saved reports:", error);
      return [];
    }
  },

  // Download report as file
  downloadReport: async (reportData: ReportData, format: ReportFormat) => {
    try {
      const blob = await reportService.exportReport(reportData.id, {
        format,
        includeCharts: true,
        includeSummary: true,
        includeTransactions: true,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      throw error;
    }
  },

  // Delete saved report
  deleteReport: async (reportId: string): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return;
      }
      await api.delete(`/reports/${reportId}`);
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  },
};

// Mock report generator
function generateMockReport(filters: ReportFilters): ReportData {
  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
  ];
  const mockTransactions: ReportTransaction[] = [];

  for (let i = 0; i < 20; i++) {
    const date = new Date(filters.startDate);
    date.setDate(date.getDate() + i);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const isExpense = Math.random() > 0.2;
    mockTransactions.push({
      id: i + 1,
      date: date.toISOString().split("T")[0],
      description: `${category} ${isExpense ? "Purchase" : "Income"}`,
      category: isExpense ? category : "Salary",
      amount: isExpense
        ? Math.floor(Math.random() * 400) + 10
        : Math.floor(Math.random() * 5000) + 1000,
      type: isExpense ? "EXPENSE" : "INCOME",
    });
  }

  const totalIncome = mockTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = mockTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  // Category spending
  const categorySpending: Record<string, number> = {};
  mockTransactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      categorySpending[t.category] =
        (categorySpending[t.category] || 0) + t.amount;
    });

  const topCategory = Object.entries(categorySpending).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return {
    id: Date.now().toString(),
    title: `Financial Report ${new Date().toLocaleDateString()}`,
    type: "custom",
    format: "pdf",
    generatedAt: new Date().toISOString(),
    status: "ready",
    filters,
    summary: {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      savingsRate:
        totalIncome > 0
          ? ((totalIncome - totalExpense) / totalIncome) * 100
          : 0,
      averageDailySpending: totalExpense / 30,
      transactionCount: mockTransactions.length,
      topCategory: topCategory?.[0] || "N/A",
      topCategoryAmount: topCategory?.[1] || 0,
    },
    charts: [
      {
        type: "pie",
        title: "Spending by Category",
        data: Object.entries(categorySpending).map(([label, value]) => ({
          label,
          value,
        })),
      },
    ],
    transactions: mockTransactions,
    budgets: [
      {
        category: "Food",
        limit: 800,
        spent: 650,
        remaining: 150,
        percentage: 81.25,
      },
      {
        category: "Transport",
        limit: 300,
        spent: 245,
        remaining: 55,
        percentage: 81.67,
      },
      {
        category: "Shopping",
        limit: 400,
        spent: 380,
        remaining: 20,
        percentage: 95,
      },
    ],
    savings: [
      {
        goalName: "Emergency Fund",
        target: 10000,
        saved: 6500,
        percentage: 65,
        deadline: "2024-12-31",
      },
      {
        goalName: "Vacation",
        target: 3000,
        saved: 1200,
        percentage: 40,
        deadline: "2024-08-15",
      },
    ],
    insights: [
      "Your food spending is 40% of total expenses - consider reducing dining out",
      "You're on track with your emergency fund goal",
      "Transportation costs have decreased by 15% compared to last month",
    ],
  };
}
