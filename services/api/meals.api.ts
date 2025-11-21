import { CuisineCreate } from "@/types/meals.types";
import api from "../api";

export const mealsAPI = {
  createMealPlan: async (data: any) => {
    const response = await api.post(`admin/meal-plans/`, data);
    return response.data;
  },
  getCuisineDetails: async () => {
    const response = await api.get(`cuisine-types/`);
    return response.data;
  },
  createCuisine: async (data: CuisineCreate) => {
    const response = await api.post(`admin/cuisine-types/`, data);
    return response.data;
  },
  getMealsByCategory: async (
    categoryId: string,
    cuisineId: string,
    includeMenu = true
  ) => {
    const params = {
      category: categoryId || null,
      cuisine_id: cuisineId || null,
      include_menu: includeMenu,
      active_only: true,
    };
    const response = await api.get("meal-plans/", { params });
    return response.data;
  },
  getWeeklyMeals: async (mealPlanId: string) => {
    const response = await api.get(`meal-plans/${mealPlanId}`);
    return response.data;
  },
  getPlanDetails: async () => {
    const response = await api.get("onboarding/available-plans");
    return response.data;
  },
  deleteMealPlan: async (mealPlanId: string) => {
    const response = await api.delete(`admin/meal-plans/${mealPlanId}`);
    return response.data;
  },
  deleteMealPlanItem: async (mealPlanId: string, mealId: string) => {
    const response = await api.delete(`admin/meal-plans/${mealPlanId}/items/${mealId}`);
    return response.data;
  },
  deleteCuisine: async (cuisineId: string) => {
    await api.delete(`admin/cuisine-types/${cuisineId}`);
  },
  updateMeal: async (mealId: string, data: any) => {
    const response = await api.put(`admin/meals/${mealId}`, data);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get("admin/categories");
    return response.data;
  },
  uploadMealImage: async (imageUri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    } as any);

    formData.append("category", "meals");

    const response = await api.post("images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.url;
  },
};
