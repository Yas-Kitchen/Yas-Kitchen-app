import { supabase } from "../../lib/supabase";
import { storage } from "../storage";

const authAPI = {
  checkUserExists: async (phone: string) => {
    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, "");

    try {
      // Use RPC to bypass RLS securely
      const { data, error } = await supabase.rpc("check_user_exists", {
        p_phone: cleanPhone,
      });

      if (error) {
        console.warn("Error checking user existence:", error);
        return { exists: false };
      }

      return data;
    } catch (e) {
      console.error("Check user exception:", e);
      return { exists: false };
    }
  },

  register: async (phone: string, password: string) => {
    // Pattern: 10 digit phone @yaskitchen.app
    const cleanPhone = phone.replace(/\D/g, "");
    const email = `${cleanPhone}@yaskitchen.app`;

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          phone_number: phone,
        },
      },
    });

    if (error) throw error;

    // 2. Persist Tokens
    if (data.session) {
      await storage.setToken(
        data.session.access_token,
        data.session.refresh_token,
      );
    }

    // 3. Fetch public profile to return "role" and "status"
    let userProfile: any = null;
    if (data.user) {
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", data.user.id)
        .maybeSingle(); // might request creation via trigger?
      userProfile = profile;
    }

    // Merge auth user with profile data
    const mergedUser = data.user
      ? {
          ...data.user,
          role: userProfile?.role || "user",
          status: userProfile?.status || "initiated", // Default to initiated for new users
        }
      : null;

    return {
      user: mergedUser,
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      message: "User registered successfully",
    };
  },

  setPassword: async (phone: string, password: string) => {
    const cleanPhone = phone.replace(/\D/g, "");

    // Create auth credentials
    const result = await authAPI.register(phone, password);

    // Update users table using RPC to bypass RLS
    if (result.user) {
      const { data, error } = await supabase.rpc("set_user_password_status", {
        p_phone: cleanPhone,
        p_auth_user_id: result.user.id,
      });

      if (error) {
        console.error("Failed to update user password status:", error);
      } else {
        console.log("Password status updated:", data);
      }
    }

    return result;
  },

  loginWithPassword: async (phone: string, password: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const email = `${cleanPhone}@yaskitchen.app`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    if (data.session) {
      await storage.setToken(
        data.session.access_token,
        data.session.refresh_token,
      );
    }

    // Fetch public profile
    let userProfile: any = null;
    if (data.user) {
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", data.user.id)
        .single();
      userProfile = profile;
    }

    const mergedUser = data.user
      ? {
          ...data.user,
          role: userProfile?.role || "user",
          status: userProfile?.status || "active",
        }
      : null;

    return {
      user: mergedUser,
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    };
  },

  initiateRegistration: async (phone: string) => {
    // Just return success to proceed to password screen
    // We don't create the user here in the "Serverless" flow because
    // we need the password to create the Supabase Auth user.
    return {
      user: { id: "temp_" + phone },
      message: "Registration Initiated",
    };
  },

  sendOtp: async (phone: string) => {
    // Verify using Supabase Mobile OTP
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });
    if (error) throw error;
    return { message: "OTP sent successfully" };
  },

  verifyOtp: async (phone: string, otp: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp,
      type: "sms",
    });

    if (error) throw error;

    if (data.session) {
      await storage.setToken(
        data.session.access_token,
        data.session.refresh_token,
      );
    }

    return data;
  },

  completeProfile: async (userId: string, profileData: any) => {
    // Update public.users table
    // We assume the user is logged in and RLS allows updating their own profile
    const { data, error } = await supabase
      .from("users")
      .update(profileData)
      .eq("auth_user_id", userId) // Ensure we use auth_user_id if that's the key
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  adminLogin: async (phone: string, pin: string) => {
    // For Admin PIN login, we usually need a secure Backend verification.
    // If "Serverless", we can try logging in with Password where Password = PIN?
    // Or check a specific implementation.
    // Since the request is to "fix frontend", we will assume standard password login
    // or maybe the admin uses the same flow.
    // Let's reuse loginWithPassword for now assuming PIN is the Password.
    return authAPI.loginWithPassword(phone, pin);
  },

  getProfile: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (error) throw error;
    return data;
  },

  updateProfile: async (updates: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("auth_user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  logout: async () => {
    await storage.clearAll();
    await supabase.auth.signOut();
  },

  verifyToken: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error("Invalid token");
    return data.user;
  },
};

export default authAPI;
