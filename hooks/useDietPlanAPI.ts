import { useState } from "react";
import { DietPlanData, DietUser } from "@/types/user.types";
import { dietPlanAPI } from "@/services/api/dietPlan.api";

export const useDietPlanAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dietUsers, setDietUsers] = useState<DietUser[]>([]);
  const [userDietPlan, setUserDietPlan] = useState<any>(null);

  const listDietUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dietPlanAPI.listDietUsers();
      const users = Array.isArray(data) ? data : data?.data ?? [];
      setDietUsers(users);
      return users;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail?.message ||
        err?.message ||
        "Failed to fetch diet users";
      setError(errorMsg);
      console.log("List diet users error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserDietPlan = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dietPlanAPI.getUserDietPlan(userId);
      setUserDietPlan(data);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setUserDietPlan(null);
        return null;
      }

      const errorMsg =
        err?.response?.data?.detail?.message ||
        err?.message ||
        "Failed to fetch user diet plan";
      setError(errorMsg);
      console.log("Get user diet plan error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createDietPlan = async (userId: string, planData: DietPlanData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dietPlanAPI.createDietPlan(userId, planData);
      setUserDietPlan(data);
      return data;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail?.message ||
        err?.message ||
        "Failed to create diet plan";
      setError(errorMsg);
      console.log("Create diet plan error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDietPlan = async (
    userId: string,
    updates: Partial<DietPlanData>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dietPlanAPI.updateDietPlan(userId, updates);
      setUserDietPlan(data);
      return data;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail?.message ||
        err?.message ||
        "Failed to update diet plan";
      setError(errorMsg);
      console.log("Update diet plan error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDietPlan = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await dietPlanAPI.deleteDietPlan(userId);
      setUserDietPlan(null);
      return true;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail?.message ||
        err?.message ||
        "Failed to delete diet plan";
      setError(errorMsg);
      console.log("Delete diet plan error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    dietUsers,
    userDietPlan,
    listDietUsers,
    getUserDietPlan,
    createDietPlan,
    updateDietPlan,
    deleteDietPlan,
    clearError,
  };
};
