import { useGlobalContext } from "@/context/GlobalContext";
import { mealsAPI } from "@/services/api/meals.api";
import { CuisineCreate, MealPlan } from "@/types/meals.types";
import { useState } from "react";

export const useMealsAPI = () => {
  const [meals, setMeals] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyPlan, setMonthlyPlan] = useState<any[]>([]);
  const { selectedCategory } = useGlobalContext();

  const fetchCuisineDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mealsAPI.getCuisineDetails();

      let cuisineData = [];

      if (Array.isArray(data)) {
        cuisineData = data.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
      } else if (data?.data) {
        cuisineData = data.data.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
      }
      return cuisineData;
    } catch (err: any) {
      console.log(err?.message || "Failed to fetch cuisine details");
    } finally {
      setLoading(false);
    }
  };

  const createCuisine = async (data: CuisineCreate) => {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = data.image_url;
      if (data.image_url && !data.image_url.startsWith("http")) {
        imageUrl = await mealsAPI.uploadMealImage(data.image_url);
      }
      const payload: CuisineCreate = {
        name: data.name,
        description: data.description,
        image_url: imageUrl || "",
        is_active: true,
      };

      await mealsAPI.createCuisine(payload);
      await fetchCuisineDetails();
    } catch (err: any) {
      setError(err?.message || "Failed to create category");
      console.error("Failed to create cuisine types with err", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeals = async (categoryKey: string, cuisineId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mealsAPI.getMealsByCategory(
        categoryKey,
        cuisineId,
        true
      );
      const parsedMeals = Array.isArray(data) ? data : data?.data ?? [];
      setMeals(parsedMeals);
    } catch (err: any) {
      console.error("Failed to fetch meal plan:", err);
      console.error("Error details:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        categoryKey,
        cuisineId,
      });
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to get meal plan"
      );
    } finally {
      setLoading(false);
    }
  };

  const createMealPlan = async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mealsAPI.createMealPlan(payload);
      if (selectedCategory) {
        await fetchMeals("regular", selectedCategory);
      }
      return response;
    } catch (err: any) {
      setError(err?.message || "Failed to create meal plan");
      console.error("Create meal plan error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const data = await mealsAPI.getPlanDetails();
      setMonthlyPlan(data || []);
      setError(null);
      return data;
    } catch (err: any) {
      console.log(err?.message || "Failed to fetch plan details");
    } finally {
      setLoading(false);
    }
  };

  const deleteMeals = async (mealPlanId: string, itemId?: string) => {
    setLoading(true);
    setError(null);

    try {
      if (itemId) {
        await mealsAPI.deleteMealPlanItem(mealPlanId, itemId);
      } else {
        await mealsAPI.deleteMealPlan(mealPlanId);
      }
      if (selectedCategory) {
        await fetchMeals("regular", selectedCategory);
      }
    } catch (err: any) {
      console.log("DeleteMeal error", err);
      setError(err?.message || "Failed to delete meal");
    } finally {
      setLoading(false);
    }
  };
  const getCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mealsAPI.getCategories();
      const categories = Array.isArray(data?.categories) ? data.categories : [];
      setMonthlyPlan(categories);
      return categories;
    } catch (err: any) {
      setError(err?.message);
      console.log("Failed to fetch monthly plan");
    } finally {
      setLoading(false);
    }
  };

  const deleteCuisine = async (cuisineId: string) => {
    setLoading(true);
    setError(null);
    try {
      await mealsAPI.deleteCuisine(cuisineId);
    } catch (err: any) {
      setError(err?.message || "Failed to delete cuisine");
      console.error("Failed to delete cuisine with error :", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMeal = async (
    mealId: string,
    data: {
      name?: string;
      description?: string;
      image?: string | null;
      price?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = data.image;
      if (data.image && !data.image.startsWith("http")) {
        imageUrl = await mealsAPI.uploadMealImage(data.image);
      }

      const payload = {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(imageUrl && { image_url: imageUrl }),
        ...(data.price !== undefined && { price: data.price }),
      };

      await mealsAPI.updateMeal(mealId, payload);
      if (selectedCategory) {
        await fetchMeals("regular", selectedCategory);
      }
    } catch (err: any) {
      console.log("Update Meal error", err);
      setError(err?.message || "Failed to update meal");
    } finally {
      setLoading(false);
    }
  };
  return {
    meals,
    loading,
    fetchCuisineDetails,
    fetchPlanDetails,
    fetchMeals,
    deleteMeals,
    updateMeal,
    error,
    createCuisine,
    monthlyPlan,
    getCategories,
    deleteCuisine,
    createMealPlan,
  };
};
