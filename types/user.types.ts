export interface UserTypes {
  id?: string;
  name: string;
  number: string;
  category: string;
  status: string;
  joindate: string;
  dietPlan?: boolean;
  meal_plan_id?: string;
  has_diet_plan?: boolean;
  has_kids_plan?: boolean;
  has_regular_plan?: boolean;
  onStatusChange?: () => void;
  is_password_set?: boolean;
}

export interface DietUser {
  id: string;
  name: string;
  phone_number: string;
  has_diet_plan: boolean;
  diet_meal_plan_id?: string | null;
  status: string;
  created_at: string;
  diet_meal_plan?: any;
}

export interface DietPlanData {
  name: string;
  description: string;
  price: number;
  is_active?: boolean;
  category_id?: string;
  cuisine_type_id?: string;
  weekly_menu?: {
    [day: string]: {
      [mealTime: string]: {
        meal_id?: string | null;
        name: string;
        description?: string;
        availability?: string;
        rating?: number;
        image?: string | null;
      };
    };
  };
}
