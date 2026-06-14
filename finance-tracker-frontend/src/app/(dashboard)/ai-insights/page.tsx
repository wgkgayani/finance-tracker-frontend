"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import { aiService } from "@/services/ai/ai.service";
import {
  AIInsight,
  FinancialHealthScore,
  MonthlyForecast,
} from "@/types/ai.types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [healthScore, setHealthScore] = useState<FinancialHealthScore | null>(
    null,
  );
  const [forecast, setForecast] = useState<MonthlyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "ai"; content: string }>
  >([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [insightsData, healthData, forecastData] = await Promise.all([
        aiService.getInsights(),
        aiService.getFinancialHealthScore(),
        aiService.getMonthlyForecast(),
      ]);
      setInsights(insightsData);
      setHealthScore(healthData);
      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching AI data:", error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateInsights = async () => {
    setRegenerating(true);
    await fetchAllData();
    setRegenerating(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }]);
    const userMessage = chatInput;
    setChatInput("");

    try {
      const response = await aiService.chatWithAI(userMessage);
      setChatMessages((prev) => [...prev, { role: "ai", content: response }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const insightIcons = {
    success: <CheckCircle className="w-6 h-6 text-success-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-warning-500" />,
    info: <Lightbulb className="w-6 h-6 text-info-500" />,
    critical: <AlertTriangle className="w-6 h-6 text-danger-500" />,
  };

  const insightColors = {
    success: "bg-success-50 border-success-200",
    warning: "bg-warning-50 border-warning-200",
    info: "bg-info-50 border-info-200",
    critical: "bg-danger-50 border-danger-200",
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            AI Financial Insights
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Personalized recommendations powered by artificial intelligence
          </p>
        </div>
        <button
          type="button"
          onClick={regenerateInsights}
          disabled={regenerating}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
        >
          <RefreshCw
            className={`w-5 h-5 mr-2 ${regenerating ? "animate-spin" : ""}`}
          />
          Regenerate Insights
        </button>
      </div>

      {healthScore && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl shadow-lg p-6 text-white animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">
                Your Financial Health Score
              </h2>
              <p className="text-primary-100">
                {healthScore.recommendations[0] ||
                  "You're doing great! Keep it up!"}
              </p>
            </div>
            <div className="text-center">
              <div className="relative">
                <svg className="w-32 h-32">
                  <circle
                    className="text-white/20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-white"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={
                      2 * Math.PI * 56 * (1 - healthScore.overall / 100)
                    }
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {healthScore.overall}
                  </span>
                </div>
              </div>
              <p className="text-sm mt-2">Out of 100</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {Object.entries(healthScore.categories).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-sm text-primary-100 capitalize">{key}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Today&apos;s Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={insight.id}
              className={`border rounded-xl p-5 ${insightColors[insight.severity]} transition-all cursor-pointer hover:scale-[1.02] animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {insightIcons[insight.severity]}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {insight.message}
                  </p>
                  <div className="bg-white/50 rounded-lg p-3 mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      💡 Recommendation:
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {insight.recommendation}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Impact: {insight.impact}
                    </p>
                  </div>
                  {insight.actionUrl && (
                    <button
                      type="button"
                      className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Take Action →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {forecast.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI-Powered Forecast
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="predictedIncome"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Predicted Income"
                />
                <Line
                  type="monotone"
                  dataKey="predictedExpenses"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Predicted Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="predictedSavings"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Predicted Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {forecast[0]?.riskFactors && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Risk Factors: {forecast[0].riskFactors.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-slide-up">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              AI Financial Assistant
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Ask me anything about your finances - I&apos;m here to help!
          </p>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.role === "ai" && (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === "user" ? "You" : "AI Assistant"}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {chatMessages.length === 0 && (
            <div className="text-center text-gray-500 mt-32">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>
                Ask me about your spending patterns, savings tips, or investment
                advice!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                >
                  How can I save more?
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                >
                  Review my budget
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                >
                  Investment tips?
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={sendChatMessage}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
