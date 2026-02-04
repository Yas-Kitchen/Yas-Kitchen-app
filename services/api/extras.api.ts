import { supabase } from "@/lib/supabase";
import {
  AddonCreate,
  AddonUpdate,
  TodaySpecialCreate,
  TodaySpecialUpdate,
} from "@/types/extras.types";

//Specials
export const extrasAPI = {
  getTodaySpecials: async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("today_specials")
      .select("*")
      .eq("available_date", today)
      .eq("is_active", true);

    if (error) throw error;
    return data;
  },

  getUpcomingSpecials: async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("today_specials")
      .select("*")
      .gt("available_date", today)
      .eq("is_active", true)
      .order("available_date");

    if (error) throw error;
    return data;
  },

  getSpecialsByDate: async (targetDate: string) => {
    // targetDate format YYYY-MM-DD
    const { data, error } = await supabase
      .from("today_specials")
      .select("*")
      .eq("available_date", targetDate);

    if (error) throw error;
    return data;
  },

  createSpecial: async (data: TodaySpecialCreate) => {
    const { data: newSpecial, error } = await supabase
      .from("today_specials")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newSpecial;
  },

  getSpecialById: async (specialID: string) => {
    const { data, error } = await supabase
      .from("today_specials")
      .select("*")
      .eq("id", specialID)
      .single();

    if (error) throw error;
    return data;
  },

  updateSpecial: async (specialID: string, data: TodaySpecialUpdate) => {
    const { data: updated, error } = await supabase
      .from("today_specials")
      .update(data)
      .eq("id", specialID)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  deleteSpecial: async (specialId: string): Promise<void> => {
    const { error } = await supabase
      .from("today_specials")
      .delete()
      .eq("id", specialId);

    if (error) throw error;
  },

  //Addons
  getAllAddons: async () => {
    const { data, error } = await supabase
      .from("addons")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  },

  getAddonsForKids: async () => {
    // Assuming backend filtered by category 'kids' or similar?
    // Or maybe it was `category` = 'kids-meals'?
    // I'll check what the category usually is, for now match backend endpoint name logic: category='kids' or 'kids-meals'
    // Let's guess 'kids' or 'kids_meal'. If unsure, maybe fetch all and let frontend receive it?
    // But backend was specific.
    // I will try filtering by category ILIKE '%kid%' to be safe?
    // Or just fetching all for now?
    // Better: `category` = 'kids'

    const { data, error } = await supabase
      .from("addons")
      .select("*")
      .ilike("category", "%kid%")
      .eq("is_active", true);

    if (error) throw error;
    return data;
  },

  createAddons: async (data: AddonCreate) => {
    const { data: newAddon, error } = await supabase
      .from("addons")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newAddon;
  },

  updateAddon: async (AddonID: string, data: AddonUpdate) => {
    const { data: updated, error } = await supabase
      .from("addons")
      .update(data)
      .eq("id", AddonID)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  getAddonById: async (AddonID: string) => {
    const { data, error } = await supabase
      .from("addons")
      .select("*")
      .eq("id", AddonID)
      .single();

    if (error) throw error;
    return data;
  },

  deleteAddon: async (addonId: string): Promise<void> => {
    const { error } = await supabase.from("addons").delete().eq("id", addonId);

    if (error) throw error;
  },
};
