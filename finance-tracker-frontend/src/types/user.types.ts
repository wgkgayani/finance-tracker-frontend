// src/types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: "USER" | "ADMIN";
  currency: string;
  language: string;
  timezone: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: NotificationSettings;
  defaultView: "dashboard" | "transactions";
  weeklyReport: boolean;
  budgetAlerts: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  budgetAlerts: boolean;
  goalAlerts: boolean;
  weeklyReports: boolean;
  aiRecommendations: boolean;
}

export interface OnboardingData {
  incomeRange: string;
  financialGoals: string[];
  categories: string[];
  monthlyBudget: number;
  savingsTarget: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}
