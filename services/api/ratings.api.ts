import { supabase } from "@/lib/supabase";

export const ratingsAPI = {
  submitRating: async (
    userId: string,
    mealPlanId: string,
    day: string,
    mealTime: string,
    rating: number,
  ) => {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("meal_ratings")
      .upsert(
        {
          user_id: userId,
          meal_plan_id: mealPlanId,
          day: day.toLowerCase(),
          meal_time: mealTime.toLowerCase(),
          rating,
          rated_date: today,
        },
        {
          onConflict: "user_id,meal_plan_id,day,meal_time,rated_date",
        },
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getAverageRating: async (
    mealPlanId: string,
    day: string,
    mealTime: string,
  ) => {
    const { data, error } = await supabase
      .from("meal_ratings")
      .select("rating")
      .eq("meal_plan_id", mealPlanId)
      .eq("day", day.toLowerCase())
      .eq("meal_time", mealTime.toLowerCase());

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    const sum = data.reduce((acc: number, r: any) => acc + r.rating, 0);
    return Math.round((sum / data.length) * 10) / 10;
  },

  getUserRatingToday: async (
    userId: string,
    mealPlanId: string,
    day: string,
    mealTime: string,
  ) => {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("meal_ratings")
      .select("rating")
      .eq("user_id", userId)
      .eq("meal_plan_id", mealPlanId)
      .eq("day", day.toLowerCase())
      .eq("meal_time", mealTime.toLowerCase())
      .eq("rated_date", today)
      .maybeSingle();

    if (error) throw error;
    return data?.rating || null;
  },
};
