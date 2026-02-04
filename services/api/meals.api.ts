import { supabase } from "@/lib/supabase";
import { Platform } from "react-native";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

export const mealsAPI = {
  createMealPlan: async (data: any) => {
    // data usually matches the table columns or needs transformation
    // data: name, description, price, cuisine_type_id, category_id, image_url, items?
    console.log("mealsAPI: createMealPlan sending request", data);

    // 1. Create the Meal Plan
    const { data: mealPlan, error } = await supabase
      .from("meal_plans")
      .insert({
        name: data.name,
        description: data.description,
        price: data.price,
        cuisine_type_id: data.cuisine_type_id,
        category_id: data.category_id,
        image_url: data.image_url,
        is_active: data.is_active !== undefined ? data.is_active : true,
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Create Meal Plan Items if provided (backend likely did this transactionally)
    if (data.items && data.items.length > 0) {
      const items = data.items.map((item: any) => ({
        meal_plan_id: mealPlan.id,
        meal_id: item.meal_id,
        day_of_week: item.day_of_week,
        meal_time_id: item.meal_time_id,
      }));

      const { error: itemsError } = await supabase
        .from("meal_plan_items")
        .insert(items);

      if (itemsError) {
        console.error("Error creating meal plan items", itemsError);
        // Ideally we should rollback mealPlan creation (not possible in simple client logic without RPC)
        throw itemsError;
      }
    }

    return mealPlan;
  },

  getCuisineDetails: async () => {
    const { data, error } = await supabase
      .from("cuisine_types")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return data;
  },

  createCuisine: async (data: any) => {
    const { data: newCuisine, error } = await supabase
      .from("cuisine_types")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newCuisine;
  },

  getMealsByCategory: async (
    categoryId: string | null,
    cuisineId: string | null,
    includeMenu = true,
  ) => {
    // Assuming backend returned a list of meal plans?
    let query = supabase
      .from("meal_plans")
      .select(
        `
        *,
        meal_plan_items (
            id, day_of_week, meal_time_id, 
            meals (id, name, description, image_url)
        )
      `,
      )
      .eq("is_active", true);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
    if (cuisineId) {
      query = query.eq("cuisine_type_id", cuisineId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getWeeklyMeals: async (mealPlanId: string) => {
    // Fetch meal plan with items joined
    const { data, error } = await supabase
      .from("meal_plans")
      .select(
        `
        *,
        meal_plan_items (
            *,
            meals (*)
        )
      `,
      )
      .eq("id", mealPlanId)
      .single();

    if (error) throw error;

    // If backend did some transformation (grouping by day), we might need to do it here
    // or expected format might be just the object.
    return data;
  },

  getPlanDetails: async () => {
    // "onboarding/available-plans" usually fetches active categories and maybe cuisines?
    // Let's assume it returns Categories which contain Plans?
    // Or just Categories?
    // Based on previous chats, it seems to select plans by category.
    // Let's mimic what it likely did: Fetch All Categories?

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;

    return { categories };
  },

  deleteMealPlan: async (mealPlanId: string) => {
    const { error } = await supabase
      .from("meal_plans")
      .delete()
      .eq("id", mealPlanId);

    if (error) throw error;
    return { success: true };
  },

  deleteMealPlanItem: async (mealPlanId: string, mealId: string) => {
    // This looks like deleting a specific relationship or item?
    // The previous API was delete(`admin/meal-plans/${mealPlanId}/items/${mealId}`)
    // This implies deleting from meal_plan_items where meal_id = mealId AND meal_plan_id = mealPlanId
    const { error } = await supabase
      .from("meal_plan_items")
      .delete()
      .match({ meal_plan_id: mealPlanId, meal_id: mealId });

    if (error) throw error;
    return { success: true };
  },

  deleteCuisine: async (cuisineId: string) => {
    const { error } = await supabase
      .from("cuisine_types")
      .delete()
      .eq("id", cuisineId);

    if (error) throw error;
  },

  updateMeal: async (mealId: string, data: any) => {
    // mealId might refer to a 'meal' from 'meals' table?
    // Or a 'meal_plan'?
    // The endpoint was `admin/meals/${mealId}`. Likely 'meals' table.
    const { data: updated, error } = await supabase
      .from("meals")
      .update(data)
      .eq("id", mealId)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  getCategories: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  },

  uploadMealImage: async (imageUri: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id || "anonymous";

      let fileBody;
      let contentType = "image/jpeg"; // Default
      const fileName = `meals/${userId}/${Date.now()}.jpg`;

      if (Platform.OS === "web") {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        fileBody = blob;
        contentType = blob.type || "image/jpeg";
      } else {
        // Read file as base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: "base64",
        });
        fileBody = decode(base64);
        // Guess type? often just assume jpeg for uploads from picker
      }

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, fileBody, {
          contentType: contentType,
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(data.path);

      return publicUrl;
    } catch (e) {
      console.error("Upload failed:", e);
      throw e;
    }
  },
};
