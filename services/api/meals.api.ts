import { CuisineCreate } from "@/types/meals.types";
import api from "../api";

export const mealsAPI = {
  getCuisineDetails: async () => {
    const response = await api.get(`cuisine-types/`);
    return response.data;
  },
  createCuisine: async (data: CuisineCreate) => {
    const response = await api.post(`admin/cuisine-types/`, data);
    return response.data;
  },
  getMealsByCategory: async (categoryId: string, cuisineId: string) => {
    const params = {
      category: categoryId || null,
      cuisine_id: cuisineId || null,
      active_only: true,
    };
    const response = await api.get("meal-plans/", { params });
    return response.data;
  },
  getMealPlanDetails: async (planId: string) => {
    const response = await api.get(`meal-plans/${planId}`);
    return response.data;
  },
  getPlanDetails: async () => {
    const response = await api.get("onboarding/available-plans");
    return response.data;
  },
  deleteMealPlan: async (itemId: string) => {
    const response = await api.delete(`admin/meals/${itemId}`);
    return response.data;
  },
  deleteCuisine: async (cuisineId: string) => {
    await api.delete(`admin/cuisine-types/${cuisineId}`);
  },
  updateMealPlan: async (mealPlanId: string, itemId: any, data: any) => {
    const response = await api.put(
      `admin/meal-plans/${mealPlanId}/items/${itemId}`,
      data
    );
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
