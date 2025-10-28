import api from "../api";

export const mealsAPI = {
  getMealsByCategory: async (categoryId: string) => {
    const response = await api.get(`meal-plan/?cuisine_type_id=${categoryId}`);
    return response.data;
  },
  getMealPlanDetails: async (planId: string) => {
    const response = await api.get(`meal-plans/${planId}`);
    return response.data;
  },
  deleteMealPlan: async (mealPlanId: string, itemId: string) => {
    const response = await api.delete(
      `admin/meal-plans/${mealPlanId}/items/${itemId}`
    );
    return response.data;
  },
  updateMealPlan: async (mealPlanId: string, itemId: any) => {
    const response = await api.put(`admin/meal-plans/${mealPlanId}/items/${itemId}`);
    return response.data;
  },
};
