import { mealsAPI } from "@/services/api/meals.api";
import { useState } from "react";

export const useMeals = () => {
  const [meals, setMeals] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    console.log(error);
    try {
      const plans = await mealsAPI.getMealsByCategory(categoryId);

      if (!Array.isArray(plans) || plans.length === 0) {
        setMeals([]);
        setLoading(false);
        return;
      }
      const mealPlanId = plans[0].id;
      const planDetails = await mealsAPI.getMealPlanDetails(mealPlanId);
      setMeals({
        ...planDetails[categoryId],
        mealPlanId,
      });
    } catch (err: any) {
      console.log("fetchMeals error", err);
      setError(err?.message || "Failed to fetch meals");
    } finally {
      setLoading(false);
    }
  };

  const deleteMeals = async (mealPlanId: string, itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      await mealsAPI.deleteMealPlan(mealPlanId, itemId);
      await fetchMeals(mealPlanId);
    } catch (err: any) {
      console.log("DeleteMeal error", err);
      setError(err?.message || "Failed to delete meal");
    } finally {
      setLoading(false);
    }
  };

  const updateMeal = async (
    mealPlanId: string,
    itemId: string,
    data: {
      name?: string;
      description?: string;
      image?: string | null;
      availability?: string;
      userId?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = data.image;
      if (data.image && !data.image.startsWith("http")) {
        imageUrl = await mealsAPI.uploadMealImage(data.image, data.userId!);
      }

      const payload = {
        name: data.name,
        description: data.description,
        ...(imageUrl && { image: imageUrl }),
      };

      await mealsAPI.updateMealPlan(mealPlanId, itemId, payload);
      await fetchMeals(mealPlanId);
    } catch (err: any) {
      console.log("Update Meal error", err);
      setError(err?.message || "Failed to update meal");
    } finally {
      setLoading(false);
    }
  };
  return { meals, loading, fetchMeals, deleteMeals, updateMeal };
};
