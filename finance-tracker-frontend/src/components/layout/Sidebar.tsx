"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Lightbulb,
  LogOut,
  Settings,
  Target,
  User,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Budgets", href: "/budgets", icon: Wallet },
  { name: "Savings Goals", href: "/savings-goals", icon: Target },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Insights", href: "/ai-insights", icon: Lightbulb },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-gray-200 shadow-lg h-screen overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-[280px]"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 animate-fade-in overflow-hidden">
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">FT</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent whitespace-nowrap">
              FinanceTracker
            </h1>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1 rounded-lg hover:bg-gray-100 transition-colors ${
            isCollapsed ? "mx-auto" : ""
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${isCollapsed ? "mx-auto" : "mr-3"} ${
                  isActive
                    ? "text-primary-500"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              {!isCollapsed && (
                <span className="truncate animate-fade-in">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 p-4 border-t border-gray-200 bg-white">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}
        >
          <div className="relative shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
              <span className="text-white font-medium text-sm">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
          </div>

          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
