import api from './api';
import { storage } from './storage';

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
  };
  token?: {
    access_token: string;
    token_type: string;
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
  meal_type: 'north_indian' | 'south_indian';
  meal_plan_id: string;
  has_diet_plan?: boolean;
}

export const authAPI = {
  sendOtp: async (phone: string): Promise<SendOtpResponse> => {
    const response = await api.post('/auth/request-otp', { 
      phone_number: phone
    });
    return response.data;
  },

  verifyOtp: async (phone: string, token: string): Promise<VerifyOtpResponse> => {
    const response = await api.post('/auth/login', { 
      phone_number: phone,
      otp: token
    });
    
    // Store tokens if they exist
    if (response.data.token) {
      await storage.setToken(
        response.data.token.access_token,
        response.data.token.access_token
      );
    }
    
    return response.data;
  },

  adminLogin: async (phone: string, password: string): Promise<AdminLoginResponse> => {
    const response = await api.post('/auth/admin-login', { phone, password });
    
    if (response.data.session) {
      await storage.setToken(
        response.data.session.access_token,
        response.data.session.refresh_token
      );
    }
    
    return response.data;
  },

  registerUser: async (userData: RegisterUserData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData: Partial<RegisterUserData>) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    await storage.clearTokens();
  },

  verifyToken: async () => {
    const response = await api.post('/auth/verify-token');
    return response.data;
  },

  getTestOtpStatus: async () => {
    const response = await api.get('/auth/test-otp-status');
    return response.data;
  },
};
