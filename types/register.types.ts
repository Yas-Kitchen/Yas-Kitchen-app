export interface CuisineType {
  id: string;
  label: string;
  value: string;
  name: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CuisineResponse {
  data?: CuisineType[];
  message?: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  image?: string;
  cuisine_type_id: string;
  is_available: boolean;
  day_of_week?: string;
  meal_time?: string;
  created_at: string;
  updated_at: string;
  item_id?: string;
  mealPlanId: string;
  day: string;
  time: string;
  image_url?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MealListRef {
  refresh: () => void;
}

export interface CuisineItemProps {
  cuisine: any;
  isSelected: boolean;
  onSelect: () => void;
  width: number;
  height: number;
}
