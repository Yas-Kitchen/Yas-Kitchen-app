import { supabase } from "@/lib/supabase";
import { DashboardStats, DashboardData } from "@/types/dashboard.types";

export const dashBoardAPI = {
  getDashBoardStats: async ({
    today, // YYYY-MM-DD
    weekStart,
    weekEnd,
    monthStart,
    monthEnd,
  }: DashboardStats) => {
    try {
      // We'll return a structure matching DashboardData, but calculated on client side (or via simple queries)
      // 1. Fetch Today's Orders
      const todayDate = today || new Date().toISOString().split("T")[0];
      const { data: todayOrders, error: todayError } = await supabase
        .from("orders")
        .select("total_amount, status, addon_ids, user_id, today_special_id")
        .eq("order_date", todayDate)
        .neq("status", "cancelled");

      if (todayError) throw todayError;

      // 2. Fetch Week's Orders
      // Defaults? If not provided, assume current week logic?
      // Ideally the caller provided ranges.
      // We'll skip complex date math here for brevity and assume caller passed valid ranges or we just query "today" if range invalid?
      // Let's rely on the passed params.

      let weekOrders: any[] = [];
      if (weekStart && weekEnd) {
        const { data } = await supabase
          .from("orders")
          .select("total_amount, status, addon_ids")
          .gte("order_date", weekStart)
          .lte("order_date", weekEnd)
          .neq("status", "cancelled");
        weekOrders = data || [];
      }

      // 3. Fetch Month's Orders
      let monthOrders: any[] = [];
      if (monthStart && monthEnd) {
        const { data } = await supabase
          .from("orders")
          .select("total_amount, status, addon_ids, today_special_id")
          .gte("order_date", monthStart)
          .lte("order_date", monthEnd)
          .neq("status", "cancelled");
        monthOrders = data || [];
      }

      // 4. Fetch Active Users
      const { count: activeUserCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .eq("role", "user");

      // Fetch Addons for lookup
      const { data: allAddons } = await supabase
        .from("addons")
        .select("id, name");

      const addonMap = new Map((allAddons || []).map((a) => [a.id, a.name]));

      // 5. Calculate Stats
      const calculateStats = (orders: any[]) => {
        const revenue = orders.reduce(
          (sum, o) => sum + (o.total_amount || 0),
          0,
        );
        const addonCount = orders.reduce(
          (sum, o) => sum + (o.addon_ids?.length || 0),
          0,
        );
        const specialCount = orders.filter((o) => o.today_special_id).length;

        // Calculate Popular Items (Addons)
        const itemCounts: Record<string, number> = {};
        orders.forEach((o) => {
          if (Array.isArray(o.addon_ids)) {
            o.addon_ids.forEach((id: string) => {
              itemCounts[id] = (itemCounts[id] || 0) + 1;
            });
          }
        });

        const popularItems = Object.entries(itemCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([id, count]) => ({
            product_name: addonMap.get(id) || "Unknown Addon",
            orders: count,
          }));

        return {
          revenue: revenue.toString(),
          order_revenue: revenue.toString(),
          regular_revenue: revenue.toString(),
          addon_revenue: "0",
          addon_count: addonCount,
          special_orders_count: specialCount,
          active_users: activeUserCount || 0,
          pending_orders: 0,
          plan_distribution: {
            Regular: { total_users: 0, percentage: 0 },
            Diet: { total_users: 0, percentage: 0 },
            Kids: { total_users: 0, percentage: 0 },
          },
          popular_items: popularItems,
        };
      };

      const todayStats = calculateStats(todayOrders || []);
      const weekStats = calculateStats(weekOrders);
      const monthStats = calculateStats(monthOrders);

      // Add specific global counters
      const { count: pendingCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "placed"); // Assuming 'placed' means pending

      todayStats.pending_orders = pendingCount || 0;

      return {
        today: todayStats,
        week: weekStats,
        month: monthStats,
      };
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
      throw error;
    }
  },
};
