import { supabase } from "@/lib/supabase";

export const registerAPI = {
  startOnboarding: async () => {
    // Just ensure user is logged in?
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    return { success: true, message: "Onboarding started" };
  },

  selectCuisine: async (cuisineId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("users")
      .update({ cuisine_type_id: cuisineId })
      .eq("auth_user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  profileCompletion: async (name: string, address: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    let query;
    if (existing) {
      query = supabase
        .from("users")
        .update({ name, address })
        .eq("auth_user_id", user.id);
    } else {
      query = supabase.from("users").insert({
        auth_user_id: user.id,
        name,
        address,
        phone_number: user.phone || user.user_metadata?.phone_number,
        status: "initiated",
      });
    }

    const { data, error } = await query.select().single();

    if (error) throw error;
    return data;
  },

  selectPlan: async (planIds: string | string[]) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const selectedPlans = Array.isArray(planIds)
      ? planIds.map((p) => p.toLowerCase())
      : [typeof planIds === "string" ? planIds.toLowerCase() : ""];

    // Map plans strings to user columns
    // This depends on what frontend sends. Likely "regular", "kids", "diet".
    // We also need to map them to category IDs if possible, but let's just set flags for now if that's what backend used.
    // The `users` table has `selected_main_category_id`.

    // Let's fetch categories first to find IDs?
    const { data: categories } = await supabase.from("categories").select("*");

    const updates: any = {
      has_regular_plan: false,
      has_kids_plan: false,
      has_diet_plan: false,
      // Resetting others? Or merging?
      // Usually selection overwrites.
    };

    // Helper to find category ID
    const findCat = (key: string) =>
      categories?.find((c) => c.key === key || c.name.toLowerCase() === key)
        ?.id;

    if (
      selectedPlans.includes("regular") ||
      selectedPlans.includes("standard")
    ) {
      updates.has_regular_plan = true;
      updates.selected_main_category_id =
        findCat("regular") || findCat("standard");
    }
    if (selectedPlans.includes("kids")) {
      updates.has_kids_plan = true;
      // updates.kids_category_id? user table has selected_kids_category (boolean)
      updates.selected_kids_category = true;
    }
    if (
      selectedPlans.includes("diet") ||
      selectedPlans.includes("weightloss")
    ) {
      updates.has_diet_plan = true;
      // updates.diet_meal_plan_id?
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("auth_user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  confirmPrice: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Maybe update status to 'active'?
    const { data, error } = await supabase
      .from("users")
      .update({ status: "pending" })
      .eq("auth_user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getOnboardingUserData: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    // Return structured default if data is empty (user just registered)
    if (!data) {
      return {
        id: user.id, // Or a mock ID if needed
        auth_user_id: user.id,
        phone_number: user.phone || user.user_metadata?.phone_number,
        status: "initiated",
      };
    }

    return data;
  },

  updateProfile: async (
    name: string,
    address: string,
    cuisine_type_id: string | undefined,
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    const updates = { name, address, cuisine_type_id };

    let query;
    if (existing) {
      query = supabase
        .from("users")
        .update(updates)
        .eq("auth_user_id", user.id);
    } else {
      query = supabase.from("users").insert({
        auth_user_id: user.id,
        ...updates,
        phone_number: user.phone || user.user_metadata?.phone_number,
        status: "initiated",
      });
    }

    const { data, error } = await query.select().single();

    if (error) throw error;
    return data;
  },

  updatePlan: async (planIds: string | string[]) => {
    // Alias to selectPlan
    return registerAPI.selectPlan(planIds);
  },

  getOnboardingSession: async () => {
    const user = await registerAPI.getOnboardingUserData();

    // Compute current_step dynamically
    let current_step = "cuisine_selection";

    if (user.cuisine_type_id) {
      current_step = "profile_completion";
    }
    if (
      user.name &&
      user.address &&
      user.name !== user.phone_number &&
      user.address !== "Pending"
    ) {
      current_step = "plan_selection";
    }
    if (user.has_regular_plan || user.has_kids_plan || user.has_diet_plan) {
      current_step = "pricing_confirmation";
    }
    if (user.status === "active") {
      current_step = "completed";
    }

    return {
      ...user,
      current_step,
    };
  },

  getReviewData: async () => {
    // Return aggregated data for review screen
    // User + Cuisine + Plans + Estimated Price?
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Fetch user with cuisine and category details
    const { data: profile, error } = await supabase
      .from("users")
      .select(
        `
            *,
            cuisine_types (name),
            categories:selected_main_category_id (name, price) 
        `,
      )
      // Note: Relation name 'categories' typically matches table name, but here it's FK 'selected_main_category_id'.
      // Supabase might map it. If not, we might need explicit relation hints or separate queries.
      // Assuming standard auto-detection.
      .eq("auth_user_id", user.id)
      .single();

    if (error) throw error;

    return {
      user: profile,
      // Simplify for frontend
      cuisine: profile.cuisine_types,
      plan: profile.categories, // Main plan
    };
  },
};
