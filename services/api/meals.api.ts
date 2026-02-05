import { supabase } from "@/lib/supabase";
import { Platform } from "react-native";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import axios from "axios";

export const mealsAPI = {
  createMealPlan: async (data: any) => {
    console.log("mealsAPI: createMealPlan sending request", data);

    // Meal time ID mapping
    const MEAL_TIME_IDS: Record<string, string> = {
      lunch: "3fa38ff4-34c5-40e2-a162-c31c6b5d18e4",
      dinner: "8e852a0f-c061-49a2-ba32-3a9b40feef7f",
    };

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

    // 2. Process weekly_menu format (from AddMeal component)
    if (data.weekly_menu) {
      for (const [dayKey, dayMeals] of Object.entries(data.weekly_menu)) {
        for (const [timeKey, mealData] of Object.entries(
          dayMeals as Record<string, any>,
        )) {
          // Create the meal in 'meals' table
          const { data: meal, error: mealError } = await supabase
            .from("meals")
            .insert({
              name: mealData.name,
              description: mealData.description,
              price: mealData.price || 0,
              image_url: mealData.image,
              is_available: true, // Correct column name
              cuisine_type_id: data.cuisine_type_id, // Required field
            })
            .select()
            .single();

          if (mealError) {
            console.error("Error creating meal", mealError);
            throw mealError;
          }

          // Create meal_plan_item linking meal to plan
          const mealTimeId = MEAL_TIME_IDS[timeKey.toLowerCase()];
          const { error: itemError } = await supabase
            .from("meal_plan_items")
            .insert({
              meal_plan_id: mealPlan.id,
              meal_id: meal.id,
              day_of_week: dayKey.toLowerCase(), // Must be lowercase per check constraint
              meal_time_id: mealTimeId,
            });

          if (itemError) {
            console.error("Error creating meal_plan_item", itemError);
            throw itemError;
          }
        }
      }
    }

    // 3. Also handle legacy 'items' format if provided
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
    categoryIdOrKey: string | null,
    cuisineId: string | null,
    includeMenu = true,
  ) => {
    let categoryId = categoryIdOrKey;
    if (
      categoryIdOrKey &&
      !categoryIdOrKey.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      )
    ) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .ilike("key", categoryIdOrKey)
        .single();
      categoryId = category?.id || null;
    }
    const { data: mealTimes } = await supabase
      .from("meal_times")
      .select("id, name");
    const mealTimeMap: Record<string, string> = {};
    mealTimes?.forEach((mt) => {
      mealTimeMap[mt.id] = mt.name.toLowerCase();
    });

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

    const transformed = data?.map((plan: any) => {
      const weekly_menu: Record<string, Record<string, any>> = {};

      plan.meal_plan_items?.forEach((item: any) => {
        const day = item.day_of_week?.toLowerCase();
        const mealTime = mealTimeMap[item.meal_time_id] || "lunch";

        if (!weekly_menu[day]) {
          weekly_menu[day] = {};
        }

        if (item.meals) {
          weekly_menu[day][mealTime] = {
            id: item.id,
            meal_id: item.meals.id,
            name: item.meals.name,
            description: item.meals.description,
            image: item.meals.image_url, // Changed from image_url to match MealList component
          };
        }
      });

      return {
        ...plan,
        weekly_menu,
      };
    });

    return transformed;
  },

  getWeeklyMeals: async (mealPlanId: string) => {
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

    return data;
  },

  getPlanDetails: async () => {
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

      const fileExt = imageUri.split(".").pop()?.toLowerCase();
      if (fileExt === "png") contentType = "image/png";
      else if (fileExt === "jpg" || fileExt === "jpeg")
        contentType = "image/jpeg";

      const fileName = `meals/${userId}/${Date.now()}.${fileExt || "jpg"}`;

      // Upload using Native FileSystem (Bypasses RN Fetch/Axios issues on Simulator)
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      const uploadUrl = `${supabaseUrl}/storage/v1/object/yas-storage/${fileName}`;

      console.log(`[Upload] Starting upload to ${uploadUrl}`);
      const response = await FileSystem.uploadAsync(uploadUrl, imageUri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": contentType,
          "x-upsert": "true",
        },
      });

      console.log(`[Upload] Response Status: ${response.status}`);
      console.log(`[Upload] Response Body: ${response.body}`);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          `Supabase Upload Failed [${response.status}]: ${response.body}`,
        );
      }

      const { data } = supabase.storage
        .from("yas-storage")
        .getPublicUrl(fileName);

      console.log(`[Upload] Success! Public URL: ${data.publicUrl}`);
      return data.publicUrl;
    } catch (e: any) {
      console.error("Supabase storage upload CRITICAL error:", e);
      // THROW the error so AddMeal.tsx sees it and alerts the user
      throw new Error(`Image Upload Failed: ${e.message}`);
    }
  },
};
