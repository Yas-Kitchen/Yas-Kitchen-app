import { Addon } from "@/types/extras.types";
import { userAPI } from "@/services/api/user.api";
import {
  AggregatedWeeklyMenu,
  Category,
  Meal,
  MealListRef,
  SelectedMealDetails,
} from "@/types/meals.types";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { storage } from "@/services/storage";

interface GlobalContextType {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  mobile: string;
  setMobile: React.Dispatch<React.SetStateAction<string>>;
  cart: { [key: string]: number };
  setCart: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  name: any;
  setName: React.Dispatch<React.SetStateAction<any>>;
  address: any;
  setAddress: React.Dispatch<React.SetStateAction<any>>;
  popupNames: string;
  setPopupNames: React.Dispatch<React.SetStateAction<string>>;
  foodStyle: string;
  setFoodStyle: React.Dispatch<React.SetStateAction<string>>;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  has_diet_plan: boolean;
  setHasDietPlan: React.Dispatch<React.SetStateAction<boolean>>;
  has_regular_plan: boolean;
  setHasRegularPlan: React.Dispatch<React.SetStateAction<boolean>>;
  has_kids_plan: boolean;
  setHasKidsPlan: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCategoryName: string | null;
  setSelectedCategoryName: React.Dispatch<React.SetStateAction<string | null>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  selectedUser: any;
  setSelectedUser: React.Dispatch<React.SetStateAction<any>>;
  selectedMeal: SelectedMealDetails | null;
  setSelectedMeal: React.Dispatch<
    React.SetStateAction<SelectedMealDetails | null>
  >;
  mealListRef: React.RefObject<MealListRef | null>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAddon: React.Dispatch<React.SetStateAction<Addon | null>>;
  selectedAddon: Addon | null;
  selectedAddonItems: any;
  setSelectedAddonItems: React.Dispatch<React.SetStateAction<any>>;
  selectedSpecialItems: any[];
  setSelectedSpecialItems: React.Dispatch<React.SetStateAction<any[]>>;
  userProfile: string;
  setUserProfile: React.Dispatch<React.SetStateAction<string>>;
  monthlyPlan: any[];
  setMonthlyPlan: React.Dispatch<React.SetStateAction<any[]>>;
  getMonthlyPlanText: () => string;
  currentWeeklyMenu: AggregatedWeeklyMenu;
  setCurrentWeeklyMenu: React.Dispatch<
    React.SetStateAction<AggregatedWeeklyMenu>
  >;
  cuisineRefreshKey: number;
  setCuisineRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  mealRefreshKey: number;
  setMealRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  selectedDietUser: any;
  setSelectedDietUser: React.Dispatch<React.SetStateAction<any>>;
  userMealOpen: boolean;
  setUserMealOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthLoading: boolean;
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [popupNames, setPopupNames] = useState("");
  const [foodStyle, setFoodStyle] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [has_diet_plan, setHasDietPlan] = useState(false);
  const [has_regular_plan, setHasRegularPlan] = useState(false);
  const [has_kids_plan, setHasKidsPlan] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<SelectedMealDetails | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [selectedAddonItems, setSelectedAddonItems] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const mealListRef = useRef<MealListRef | null>(null);
  const [selectedSpecialItems, setSelectedSpecialItems] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState("");
  const [monthlyPlan, setMonthlyPlan] = useState<any[]>([]);
  const [currentWeeklyMenu, setCurrentWeeklyMenu] =
    useState<AggregatedWeeklyMenu>({} as AggregatedWeeklyMenu);
  const [cuisineRefreshKey, setCuisineRefreshKey] = useState(Date.now());
  const [mealRefreshKey, setMealRefreshKey] = useState(Date.now());
  const [selectedDietUser, setSelectedDietUser] = useState<any>(null);
  const [userMealOpen, setUserMealOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const fetchUserProfile = async () => {
    try {
      const data = await userAPI.getUserProfile();
      setUserData(data);
    } catch (error) {
      console.log("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUserId(session.user.id);
        storage.setToken(session.access_token, session.refresh_token);
        console.log("Session restored:", session.user.id);
      }
      setIsAuthLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      /* 
         We only want to set loading to true/false if we are actually processing an update.
         However, onAuthStateChange fires on mount too sometimes. 
         Safe way: set loading true, do work, set loading false.
      */
      if (session) {
        // If we are already loaded and just refreshing, maybe don't toggle full loader?
        // But for consistency let's toggle it or just ensure we fetch profile.
        // For AuthGuard purpose, we need userData.
        setUserId(session.user.id);
        storage.setToken(session.access_token, session.refresh_token);
      } else {
        setUserId("");
        setUserData(null);
        // storage.clearTokens(); 
      }
      // If we want AuthGuard to block while refetching on auth change, we might want setIsAuthLoading(true) at start.
      // But typically onAuthStateChange is instantaneous for session restore.
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    } else {
      setUserData(null);
    }
  }, [userId]);

  const getMonthlyPlanText = () => {
    if (has_regular_plan && has_kids_plan) return "Kids plan with Regular";
    if (has_regular_plan) return "Regular Plan";
    if (has_diet_plan) return "Diet Plan";
    if (has_kids_plan) return "Kids Plan"; // If backend ever sends it alone
    return "No plan selected";
  };

  const values: GlobalContextType = {
    mobile,
    setMobile,
    name,
    setName,
    address,
    setAddress,
    popupNames,
    setPopupNames,
    foodStyle,
    setFoodStyle,
    activeStep,
    setActiveStep,
    has_diet_plan,
    setHasDietPlan,
    has_regular_plan,
    setHasRegularPlan,
    has_kids_plan,
    setHasKidsPlan,
    selectedCategory,
    setSelectedCategory,
    selectedCategoryName,
    setSelectedCategoryName,
    categories,
    setCategories,
    userId,
    setUserId,
    selectedMeal,
    setSelectedMeal,
    selectedAddonItems,
    setSelectedAddonItems,
    selectedUser,
    setSelectedUser,
    mealListRef,
    isEditing,
    setIsEditing,
    selectedAddon,
    setSelectedAddon,
    cart,
    setCart,
    setSelectedSpecialItems,
    selectedSpecialItems,
    userProfile,
    setUserProfile,
    monthlyPlan,
    setMonthlyPlan,
    getMonthlyPlanText,
    currentWeeklyMenu,
    setCurrentWeeklyMenu,
    cuisineRefreshKey,
    setCuisineRefreshKey,
    mealRefreshKey,
    setMealRefreshKey,
    selectedDietUser,
    setSelectedDietUser,
    userMealOpen,
    setUserMealOpen,
    isAuthLoading,
    setIsAuthLoading,
    userData,
    setUserData,
  };

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx)
    throw new Error("useStateContext must be used within a StateProvider");
  return ctx;
};
