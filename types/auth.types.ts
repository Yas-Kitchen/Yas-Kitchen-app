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
