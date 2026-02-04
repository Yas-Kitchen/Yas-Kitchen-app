import { registerAPI } from "@/services/api/register.api";
import { useState } from "react";
import { useUserAPI } from "./useUserAPI";

export const useRegisterAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUserStatus } = useUserAPI();
  const startOnboarding = async () => {
    try {
      setLoading(true);
      console.log("Calling startOnboarding...");
      const data = await registerAPI.startOnboarding();
      console.log("startOnboarding Response:", data);
      setError(null);
      return data;
    } catch (err: any) {
      console.log(" startOnboarding FAILED:", err?.response?.data || err);
      setError(err?.message || "Failed to start onboarding");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = async (name: string, address: string) => {
    try {
      setLoading(true);
      const data = await registerAPI.profileCompletion(name, address);
      setError(null);
      return data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Profile completion failed";
      console.error("Profile completion error:", errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectCuisine = async (cuisineId: string) => {
    try {
      setLoading(true);
      const data = await registerAPI.selectCuisine(cuisineId);
      setError(null);
      return data;
    } catch (err: any) {
      setError(err?.message || "Failed to fetch cuisine details");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectPlan = async (planId: string | string[]) => {
    try {
      setLoading(true);
      const data = await registerAPI.selectPlan(planId);
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Failed to select plan");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (planId: string | string[]) => {
    try {
      setLoading(true);
      const data = await registerAPI.updatePlan(planId);
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  const confirmPrice = async (id: string) => {
    try {
      setLoading(true);
      await updateUserStatus(id!, "pending");
      const data = await registerAPI.confirmPrice();
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Failed to calculate the price");
    }
  };

  const updateProfile = async (
    name: string,
    address: string,
    cuisineId: string | undefined
  ) => {
    try {
      setLoading(true);
      const data = await registerAPI.updateProfile(name, address, cuisineId);
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getOnboardingUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerAPI.getOnboardingUserData();
      return data;
    } catch (err: any) {
      console.error("failed to get onboarding user data :", err);
      setError(err?.message || "Failed to get onboarding data");
    } finally {
      setLoading(false);
    }
  };

  const getOnboardingSession = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await registerAPI.getOnboardingSession();
      return data;
    } catch (err: any) {
      const code = err?.response?.data?.detail?.error_code;

      if (code === "ONBOARDING_004") {
        console.debug("No active session, creating one...");

        await registerAPI.startOnboarding();

        await new Promise((res) => setTimeout(res, 300));

        const newSession = await registerAPI
          .getOnboardingSession()
          .catch((e: any) => {
            console.log(
              "Even after creating, session fetch failed:",
              e?.response?.data || e
            );
            throw e;
          });

        return newSession;
      }

      setError(err?.message || "Failed to fetch onboarding session");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getReviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerAPI.getReviewData();
      return data;
    } catch (err: any) {
      console.log("Failed to get Review data", err);
      setError(err?.message || "Failed to get review data");
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmPrice,
    selectPlan,
    selectCuisine,
    startOnboarding,
    profileCompletion,
    error,
    loading,
    setLoading,
    getOnboardingUserData,
    setError,
    updateProfile,
    getOnboardingSession,
    getReviewData,
    updatePlan,
  };
};
