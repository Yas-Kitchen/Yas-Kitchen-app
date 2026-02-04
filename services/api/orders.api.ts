import { supabase } from "@/lib/supabase";

export interface OrderCreate {
  order_date: string;
  today_special_id?: string;
  addon_ids: string[];
  total_amount: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_date: string;
  status: "placed" | "confirmed" | "delivered" | "cancelled";
  total_amount: number;
  created_at: string;
  users?: {
    name: string;
    phone_number: string;
    profile_image_url?: string;
  };
  items?: {
    name: string;
    category: string;
    price: number;
  }[];
}

export const orderAPI = {
  createOrder: async (data: OrderCreate) => {
    // We need current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id, // Auth User ID or Public User ID?
        // The `users` table has `auth_user_id`. `orders.user_id` is a FK to `users.id` usually.
        // But we need to look up `users.id` first using `auth_user_id`.
        // OR checks if schema uses auth.users directly. `user_repository` usually linked `public.users`.
        // Let's assume user_id in orders is public.users.id.

        // Wait, we can subquery or fetch it first.
        // Let's fetch it first to be safe.

        // Actually, let's fetch profile first.
        // userAPI.getUserProfile()... but we are in orderAPI.

        // Let's try inserting with a subquery if possible, or just fetch.
        // Fetching is safer.
      })
      .select() // To get ID
      .single();

    // Wait, I can't write complex logic inside the object literal easily.
    // Let's rewrite the method.

    // Step 1: Get public user ID
    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!profile) throw new Error("User profile not found");

    const { data: newOrder, error: insertError } = await supabase
      .from("orders")
      .insert({
        user_id: profile.id,
        order_date: data.order_date,
        today_special_id: data.today_special_id,
        addon_ids: data.addon_ids, // Supabase handles array if column is array
        total_amount: data.total_amount,
        status: "placed",
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return newOrder;
  },

  getPendingOrders: async () => {
    // For Admin
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
            *,
            users (name, phone_number, profile_image_url),
            today_specials (id, name, price)
        `,
      )
      .eq("status", "placed")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch all addons to resolve IDs
    // Optimization: Cache this or only fetch IDs in use? For now fetch all (likely small list)
    const { data: addons } = await supabase.from("addons").select("*");
    const addonMap = new Map((addons || []).map((a) => [a.id, a]));

    // Map orders to include 'items'
    return orders.map((order) => {
      const items = [];
      // Add Special
      if (order.today_specials) {
        // Note: Supabase joined object might be null if no relation
        items.push({
          name: order.today_specials.name,
          category: "Special",
          price: order.today_specials.price,
        });
      }

      // Add Addons
      if (Array.isArray(order.addon_ids)) {
        order.addon_ids.forEach((id: string) => {
          const addon = addonMap.get(id);
          if (addon) {
            items.push({
              name: addon.name,
              category: addon.category || "Add-ons",
              price: addon.price,
            });
          }
        });
      }

      return { ...order, items };
    });
  },

  getTodayOrders: async () => {
    // For Admin? Or User?
    // "today" implies admin dashboard usage usually.
    const today = new Date().toISOString().split("T")[0];
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
            *,
            users (name, phone_number, profile_image_url),
            today_specials (id, name, price)
        `,
      )
      .eq("order_date", today)
      .neq("status", "cancelled")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch all addons
    const { data: addons } = await supabase.from("addons").select("*");
    const addonMap = new Map((addons || []).map((a) => [a.id, a]));

    return orders.map((order) => {
      const items = [];
      // Add Special
      if (order.today_specials) {
        items.push({
          name: order.today_specials.name,
          category: "Special",
          price: order.today_specials.price,
        });
      }

      // Add Addons
      if (Array.isArray(order.addon_ids)) {
        order.addon_ids.forEach((id: string) => {
          const addon = addonMap.get(id);
          if (addon) {
            items.push({
              name: addon.name,
              category: addon.category || "Add-ons",
              price: addon.price,
            });
          }
        });
      }
      /**
       * Fallback: if no items found at all (e.g. legacy or other plan logic),
       * we usually might want to show *something*.
       * Detailed.tsx defaults to "Meal" if name missing.
       */

      return { ...order, items };
    });
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
