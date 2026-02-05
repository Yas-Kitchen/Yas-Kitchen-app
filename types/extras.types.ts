// Addons Interfaces
export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: "addon" | "kids_meal" | "diet";
  is_active: boolean;
  cutoff_time: string;
  created_at: string;
  updated_at: string;
}

export interface AddonCreate {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  cutoff_time: string;
  category: "addon" | "kids_meal" | "diet";
}

export interface AddonUpdate {
  name?: string;
  description?: string;
  price?: number;
  cutoff_time?: string;
  image_url?: string;
  category?: "addon" | "kids_meal" | "diet";
  is_active?: boolean;
}

// Specials Interfaces
export interface TodaySpecial {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  special_date: string;
  cutoff_time?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TodaySpecialCreate {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  addons?: Addon[];
  available_date: string;
  cutoff_time?: string;
  is_active?: boolean;
}

export interface TodaySpecialUpdate {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  addons?: Addon[];
}

// UI Props Interfaces
export interface AddSpecialsProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface EditAddonProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
