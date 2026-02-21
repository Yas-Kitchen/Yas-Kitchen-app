export interface ReviewData {
  cuisine: any;
  plan: any[];
  user: ReviewUser;
}

export interface ReviewCuisine {
  id: string;
  name: string;
  description: string;
  editable: boolean;
}

export interface ReviewOnboarding {
  session_id: string;
  current_step:
    | "cuisine_selection"
    | "profile_completion"
    | "plan_selection"
    | "pricing_confirmation"
    | "completed";
  can_edit_profile: boolean;
  can_edit_plans: boolean;
  can_edit_cuisine: boolean;
}

export interface ReviewPlans {
  editable: boolean;
  selected_plans: string[]; // ["regular", "kids"]
  pricing_breakdown: PricingBreakdown;
}

export interface PricingBreakdown {
  diet_plan_cost: number | null;
  regular_plan_cost: number | null;
  kids_plan_cost: number | null;
  total_cost: number;
}

export interface ReviewUser {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  profile_complete: boolean;
  has_regular_plan?: boolean;
  has_diet_plan?: boolean;
  has_kids_plan?: boolean;
}

export interface ReviewTypes {
  name: string | undefined;
  mobile: string | undefined;
  address: string | undefined;
  foodStyle: string;
}
