export interface DashboardStats {
  today: string;
  weekStart?: string;
  weekEnd?: string;
  monthStart?: string;
  monthEnd?: string;
}

export interface PlanCategoryStats {
  total_users: number;
  percentage: number;
}

export interface PlanDistribution {
  Regular: PlanCategoryStats;
  Diet: PlanCategoryStats;
  Kids: PlanCategoryStats;
  regular?: PlanCategoryStats;
  diet?: PlanCategoryStats;
  kids?: PlanCategoryStats;
}

export interface PopularItem {
  product_name: string;
  orders: number;
}

export interface Stats {
  active_users: number;
  special_orders_count: number;
  revenue: string;
  order_revenue: string;
  regular_revenue: string;
  addon_revenue: string;
  addon_count: number;
  pending_orders: number;
  plan_distribution: PlanDistribution;
  popular_items?: PopularItem[];
}

export interface DashboardData {
  today: Stats;
  week: Stats;
  month: Stats;
}
