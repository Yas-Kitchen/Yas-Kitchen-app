import api from "../api";

import { DietPlanData } from "@/types/user.types";

export const dietPlanAPI = {
  /**
   * List all users with diet plans
   */
  listDietUsers: async () => {
    const response = await api.get("admin/diet-plans/");
    return response.data;
  },

  /**
   * Get diet plan for a specific user
   */
  getUserDietPlan: async (userId: string) => {
    const response = await api.get(`admin/diet-plans/user/${userId}`);
    return response.data;
  },

  /**
   * Create diet plan for a user
   */
  createDietPlan: async (userId: string, planData: DietPlanData) => {
    const response = await api.post(
      `admin/diet-plans/user/${userId}`,
      planData
    );
    return response.data;
  },

  /**
   * Update user's diet plan
   */
  updateDietPlan: async (userId: string, updates: Partial<DietPlanData>) => {
    const response = await api.put(`admin/diet-plans/user/${userId}`, updates);
    return response.data;
  },

  /**
   * Delete user's diet plan
   */
  deleteDietPlan: async (userId: string) => {
    const response = await api.delete(`admin/diet-plans/user/${userId}`);
    return response.data;
  },
};
