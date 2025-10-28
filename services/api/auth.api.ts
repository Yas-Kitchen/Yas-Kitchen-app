import api from "../api";
import { storage } from "../storage";

export interface SendOtpResponse {
  message: string;
  phone_number: string;
  expires_in_minutes: number;
  test_mode?: boolean;
  test_otp?: string;
}

export interface VerifyOtpResponse {
  user?: {
    id: string;
    phone_number: string;
    name?: string;
    address?: string;
    meal_type?: string;
    status: string;
    role: string;
    has_diet_plan?: boolean;
    meal_plan_id?: string;
    created_at: string;
    updated_at: string;
    profile_complete?: boolean;
  };
  token?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  profile_exists: boolean;
}


export interface AdminLoginResponse {
  message: string;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  user: {
    id: string;
    phone: string;
    role: string;
  };
}

export interface RegisterUserData {
  name: string;
  address: string;
  meal_type: "north_indian" | "south_indian";
  meal_plan_id: string;
  has_diet_plan?: boolean;
}

export interface CompleteProfileData {
  name: string;
  address: string;
  cuisine_type_id: string;
}

export interface UserProfileResponse {
  id: string;
  auth_user_id: string;
  phone_number: string;
  name: string;
  address: string;
  meal_type: string;
  status: string;
  role: string;
  has_diet_plan: boolean;
  meal_plan_id: string | null;
  profile_complete: boolean;
  missing_fields: string[] | null;
  created_at: string;
  updated_at: string;
}

export const authAPI = {
  sendOtp: async (phone: string): Promise<SendOtpResponse> => {
    const response = await api.post("/auth/request-otp", {
      phone_number: phone,
    });
    return response.data;
  },

  // services/auth.api.ts

verifyOtp: async (
  phone: string,
  token: string
): Promise<VerifyOtpResponse> => {
  try {
    const response = await api.post("/auth/login", {
      phone_number: phone,
      otp: token,
    });

    console.log("Backend response:", response.data);

    // Backend returns access_token and refresh_token at root level, NOT inside a 'token' object
    if (response.data.access_token) {
      console.log("Saving tokens...");
      
      await storage.setToken(
        response.data.access_token,
        response.data.refresh_token
      );
      
      // Verify tokens were saved
      const check = await storage.getTokens();
      console.log("Token save verification:", {
        accessToken: check.accessToken ? "✅ Saved" : "❌ Missing",
        refreshToken: check.refreshToken ? "✅ Saved" : "❌ Missing"
      });
    } else {
      console.warn("⚠️ No access_token in response");
    }

    // Return the response in the format your app expects
    return {
      user: response.data.user,
      token: {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_at: Date.now() + (response.data.expires_in * 1000)
      },
      profile_exists: response.data.user.profile_complete
    };
    
  } catch (error) {
    console.error("verifyOtp error:", error);
    throw error;
  }
},

  completeProfile: async (
    profileData: CompleteProfileData
  ): Promise<UserProfileResponse> => {
    const { accessToken } = await storage.getTokens();
    if (!accessToken) throw new Error("No access token found");

    const response = await api.post("/users/profile/complete", profileData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
  adminLogin: async (
    phone: string,
    password: string
  ): Promise<AdminLoginResponse> => {
    const response = await api.post("/auth/admin-login", { phone, password });

    if (response.data.session) {
      await storage.setToken(
        response.data.session.access_token,
        response.data.session.refresh_token
      );
    }

    return response.data;
  },

  registerUser: async (userData: RegisterUserData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (profileData: Partial<RegisterUserData>) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
    await storage.clearTokens();
  },

  verifyToken: async () => {
    const response = await api.post("/auth/verify-token");
    return response.data;
  },

  getTestOtpStatus: async () => {
    const response = await api.get("/auth/test-otp-status");
    return response.data;
  },
};
