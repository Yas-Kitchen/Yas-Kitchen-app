import { registerAPI } from "@/services/api/register.api";
import { useState } from "react";

export const useRegisterAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOnboarding = async () => {
    try {
      setLoading(true);
      const data = await registerAPI.startOnboarding();
      setError(null);
      return data;
    } catch (err: any) {
      setError(err?.message || "Failed to start onboarding");
    } finally {
      setLoading(false);
    }
  };

  const fetchCuisineDetails = async () => {
    try {
      setLoading(true);
      const data = await registerAPI.getCuisineDetails();
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Failed to fetch cuisine details");
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = async (name : string,address : string) => {
    try {
      setLoading(true);
      const data = await registerAPI.profileCompletion(name,address);
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Profile completion not working");
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
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const data = await registerAPI.getPlanDetails();
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Failed to fetch plan details");
    } finally {
      setLoading(false);
    }
  };

  const selectPlan = async (planId: string) => {
    try {
      setLoading(true);
      const data = await registerAPI.selectPlan(planId);
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Failed to select plan");
    } finally {
      setLoading(false);
    }
  };

  const confirmPrice = async () => {
    try {
      setLoading(true);
      const data = await registerAPI.confirmPrice();
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Failed to calculate the price");
    }
  };

  return {
    confirmPrice,
    selectPlan,
    selectCuisine,
    fetchCuisineDetails,
    fetchPlanDetails,
    startOnboarding,
    profileCompletion,
    error,
    loading,
    setLoading,
    setError,
  };
};
