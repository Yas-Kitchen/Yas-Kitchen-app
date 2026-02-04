import { supabase } from "@/lib/supabase";

export const userAPI = {
  getAllUser: async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  getUserProfile: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (error) throw error;
    return data;
  },

  updateUserProfile: async (payload: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("users")
      .update(payload)
      .eq("auth_user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deactivateUserProfile: async (userId: string) => {
    // Only Admin should be able to do this (RLS protected)
    const { data, error } = await supabase
      .from("users")
      .update({ status: "inactive" })
      .eq("id", userId) // Assuming userId is the UUID primary key, not auth_user_id
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  activateUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .update({ status: "active" })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Note: updateUserCategories implementation depends on DB schema (category_ids array or join table?)
  // For now, implementing as a partial update assuming payload is handled elsewhere or passed correctly
  // BE: admin/users/${userId}/categories usually implies specific logic.
  // We'll leave it as a update for now, or might need to look at schema.
  updateUserCategories: async (userId: string, categories: any[]) => {
    // Assuming categories is an array of IDs?
    // Check schema if possible.
    // For now, simple update.
    const { data, error } = await supabase
      .from("users")
      .update({ category_ids: categories }) // Guessing column name
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
