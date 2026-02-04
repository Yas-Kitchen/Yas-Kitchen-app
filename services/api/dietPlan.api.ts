import { supabase } from "@/lib/supabase";
import { DietPlanData } from "@/types/user.types";

export const dietPlanAPI = {
  listDietUsers: async () => {
    // Return diet plans with user details
    const { data, error } = await supabase
      .from("diet_plans")
      .select(
        `
            *,
            users (name, phone_number, profile_image_url)
        `,
      )
      .eq("is_active", true);

    if (error) throw error;
    return data;
  },

  getUserDietPlan: async (userId: string) => {
    // Note: userId here is likely public ID if from admin list?
    // If it's undefined, it might mean "current user", but the signature demands userId.
    const { data, error } = await supabase
      .from("diet_plans")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  createDietPlan: async (userId: string, planData: DietPlanData) => {
    const { data: newPlan, error } = await supabase
      .from("diet_plans")
      .insert({
        user_id: userId,
        ...planData,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return newPlan;
  },

  updateDietPlan: async (userId: string, updates: Partial<DietPlanData>) => {
    // Update by user_id
    const { data: updated, error } = await supabase
      .from("diet_plans")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  deleteDietPlan: async (userId: string) => {
    const { error } = await supabase
      .from("diet_plans")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true };
  },
};
