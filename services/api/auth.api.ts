import {
  AdminLoginResponse,
  CompleteProfileData,
  RegisterUserData,
} from "@/types/auth.types";
import api from "../api";
import { storage } from "../storage";

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post("auth/login", { username, password });
    return response.data;
  },

  signup: async (email: string, password: string) => {
    const response = await api.post("auth/signup", { email, password });
    return response.data;
  },

  sendOtp: async (phone: string) => {
    const response = await api.post("auth/request-otp", {
      phone_number: phone,
    });
    return response.data;
  },

  verifyOtp: async (phone: string, token: string) => {
    const response = await api.post("auth/login", {
      phone_number: phone,
      otp: token,
    });
    await storage.setToken(response.data.access_token, response.data.refresh_token);
    return response.data;
  },

  completeProfile: async (profileData: CompleteProfileData) => {
    const response = await api.post("users/profile/complete", profileData);
    return response.data;
  },

  adminLogin: async (
    phone: string,
    password: string
  ): Promise<AdminLoginResponse> => {
    const response = await api.post("auth/admin-login", { phone, password });

    if (response.data.session) {
      await storage.setToken(
        response.data.session.access_token,
        response.data.session.refresh_token
      );
    }

    return response.data;
  },

  registerUser: async (userData: RegisterUserData) => {
    const response = await api.post("users/register", userData);
    return response.data;
  },

   getProfile: async () => {
    const response = await api.get("auth/me");
    return response.data;
  },

  updateProfile: async (profileData: Partial<RegisterUserData>) => {
    const response = await api.put("users/profile", profileData);
    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
    await storage.clearTokens();
  },

  verifyToken: async () => {
    const response = await api.post("auth/verify-token");
    return response.data;
  },

  getTestOtpStatus: async () => {
    const response = await api.get("auth/test-otp-status");
    return response.data;
  },
};
