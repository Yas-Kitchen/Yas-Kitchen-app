//  Cuisine Interfaces
export interface CuisineType {
  id: string;
  name: string;
  label: string;
  value: string;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CuisineResponse {
  data?: CuisineType[];
  message?: string;
}

export interface CuisineCreate {
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

//  Meal Interfaces
export interface Meal {
  id: string;
  name: string;
  description: string;
  cuisine_type_id: string;
  mealPlanId: string;
  is_available: boolean;

  day: string;
  time: string;
  day_of_week?: string;
  meal_time?: string;
  item_id?: string;

  image_url?: string | null;
  image?: string;

  created_at: string;
  updated_at: string;
}

//  Meal List Interfaces
export interface MealListProps {
  meals: Meal[];
  loading: boolean;
  onDeleteMeal: (mealPlanId: string, itemId: string) => void;
}

export interface MealListRef {
  refresh: () => void;
}

//  Category Interfaces
export interface Category {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  label?: string;
}

export interface CategoryDropdown extends Category {
  label: string;
  value: string;
}

// UI Interfaces
export interface CuisineItemProps {
  cuisine: CuisineType | Category;
  isSelected: boolean;
  onSelect: () => void;
  width: number;
  height: number;
}
