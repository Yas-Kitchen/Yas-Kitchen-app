import api from "../api";

import { DietPlanData } from "@/types/user.types";

export const dietPlanAPI = {
  listDietUsers: async () => {
    const response = await api.get("admin/diet-plans/");
    return response.data;
  },
  getUserDietPlan: async (userId: string) => {
    const response = await api.get(`admin/diet-plans/user/${userId}`);
    return response.data;
  },

  createDietPlan: async (userId: string, planData: DietPlanData) => {
    const response = await api.post(
      `admin/diet-plans/user/${userId}`,
      planData
    );
    return response.data;
  },

  updateDietPlan: async (userId: string, updates: Partial<DietPlanData>) => {
    const response = await api.put(`admin/diet-plans/user/${userId}`, updates);
    return response.data;
  },

  deleteDietPlan: async (userId: string) => {
    const response = await api.delete(`admin/diet-plans/user/${userId}`);
    return response.data;
  },
};
