import { Addon } from "@/types/extras.types";
import { Category, Meal, MealListRef } from "@/types/meals.types";
import React, { createContext, useContext, useRef, useState } from "react";

interface GlobalContextType {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  mobile: string;
  setMobile: React.Dispatch<React.SetStateAction<string>>;
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
  monthlyPlan: string[];
  setMonthlyPlan: React.Dispatch<React.SetStateAction<string[]>>;
  kidsPlanSelected: boolean;
  setKidsPlanSelected: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCategoryName: string | null;
  setSelectedCategoryName: React.Dispatch<React.SetStateAction<string | null>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  selectedUser: any;
  setSelectedUser: React.Dispatch<React.SetStateAction<any>>;
  selectedMeal: Meal | null;
  setSelectedMeal: React.Dispatch<React.SetStateAction<Meal | null>>;
  mealListRef: React.RefObject<MealListRef | null>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAddon : React.Dispatch<React.SetStateAction<Addon | null>>
  selectedAddon : Addon | null
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
  const [monthlyPlan, setMonthlyPlan] = useState<string[]>([]);
  const [kidsPlanSelected, setKidsPlanSelected] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userId,setUserId] = useState("")
  const [selectedAddon,setSelectedAddon] = useState<Addon | null>(null)
  const mealListRef = useRef<MealListRef | null>(null);

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
    monthlyPlan,
    setMonthlyPlan,
    kidsPlanSelected,
    setKidsPlanSelected,
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
    selectedUser,
    setSelectedUser,
    mealListRef,
    isEditing,
    setIsEditing,
    selectedAddon,
    setSelectedAddon
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
