// src/services/auth/auth.service.ts

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types/user.types";
// ✅ Only ONE import - remove the duplicate
import api from "@/lib/api/axios.config";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log("Auth service login called with:", credentials);

    // ✅ Demo login (for testing without backend)
    if (
      credentials.email === "demo@example.com" &&
      credentials.password === "password"
    ) {
      console.log("Demo login successful");
      return {
        token: "mock-jwt-token-12345-" + Date.now(),
        user: {
          id: 1,
          name: "Demo User",
          email: "demo@example.com",
          role: "USER",
        },
      };
    }

    // ✅ Real API call (uncomment when backend is ready)
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    console.log("Auth service register called with:", userData);

    // ✅ Demo register
    if (userData.email === "demo@example.com") {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        token: "mock-jwt-token-12345-" + Date.now(),
        user: {
          id: 2,
          name: userData.name,
          email: userData.email,
          role: "USER",
        },
      };
    }

    // ✅ Real API call (uncomment when backend is ready)
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    console.log("Auth service logout called");
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    }
  },
};
