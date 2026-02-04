import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CuisineCreate } from "@/types/meals.types";
import api from "../api";

export const mealsAPI = {
  createMealPlan: async (data: any) => {
    console.log("mealsAPI: createMealPlan sending request", data);
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
    if (Platform.OS === "web") {
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        console.log("Image Upload Debug (Web):", {
          uri: imageUri,
          blobSize: blob.size,
          blobType: blob.type
        });
        // Determine extension from, blob type or default to jpg
        let extension = "jpg";
        if (blob.type === "image/png") extension = "png";
        else if (blob.type === "image/webp") extension = "webp";
        else if (blob.type === "image/jpeg") extension = "jpg";

        formData.append("file", blob, `upload.${extension}`);
      } catch (e) {
        console.error("Failed to convert image to blob:", e);
        throw e;
      }
    } else {
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);
    }

    formData.append("category", "meals");

    // Do NOT manually set Content-Type for FormData on web; let the browser/axios set the boundary.
    // We must explicitly set it to undefined to override the default 'application/json' in the axios instance.
    const headers: any = {};
    if (Platform.OS === "web") {
      headers["Content-Type"] = undefined;
    } else {
      headers["Content-Type"] = "multipart/form-data";
    }

    // Explicitly Add Auth Token to bypass potential interceptor issues with FormData
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("uploadMealImage: No access token found in AsyncStorage");
      }
    } catch (e) {
      console.error("uploadMealImage: Error getting access token", e);
    }

    const response = await api.post("images/upload", formData, {
      headers: headers,
      transformRequest: (data, headers) => {
        // Axios hack: return data to prevent it from trying to stringify FormData or mess with headers
        return data;
      },
      timeout: 60000,
    });

    return response.data.data.url;
  },
};

