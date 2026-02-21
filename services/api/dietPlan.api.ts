import { supabase } from "@/lib/supabase";
import { DietPlanData } from "@/types/user.types";

export const dietPlanAPI = {
  listDietUsers: async () => {
    // Query users directly who have diet plan enabled
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("has_diet_plan", true)
      .eq("role", "user")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  getUserDietPlan: async (userId: string) => {
    const { data, error } = await supabase
      .from("diet_plans")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    // Extract weekly_menu from plan_details for component compatibility
    return {
      ...data,
      weekly_menu: data.plan_details?.weekly_menu || {},
    };
  },

  createDietPlan: async (userId: string, planData: DietPlanData) => {
    const { weekly_menu, plan_details, ...rest } = planData;
    const mergedPlanDetails = {
      ...plan_details,
      weekly_menu: weekly_menu || {},
    };

    const { data: newPlan, error } = await supabase
      .from("diet_plans")
      .insert({
        user_id: userId,
        plan_details: mergedPlanDetails,
        is_active: rest.is_active ?? true,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return newPlan;
  },

  updateDietPlan: async (userId: string, updates: Partial<DietPlanData>) => {
    // If updating weekly_menu, merge it into plan_details
    let updatePayload: any = {};

    if (updates.weekly_menu) {
      // Get current plan_details first
      const { data: current } = await supabase
        .from("diet_plans")
        .select("plan_details")
        .eq("user_id", userId)
        .single();

      updatePayload.plan_details = {
        ...(current?.plan_details || {}),
        weekly_menu: updates.weekly_menu,
      };
    }

    if (updates.is_active !== undefined)
      updatePayload.is_active = updates.is_active;
    if (updates.restrictions) updatePayload.restrictions = updates.restrictions;
    if (updates.preferences) updatePayload.preferences = updates.preferences;

    const { data: updated, error } = await supabase
      .from("diet_plans")
      .update(updatePayload)
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
