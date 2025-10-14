import React, { createContext, useContext, useEffect, useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

interface Meal {
  id: string;
  name: string;
  description: string;
  image_url: string;
  day: string;
  time: string;
  rating: number;
  cuisine_type: string;
}

interface Category {
  label: string;
  value: string;
  name: string;
}

interface GlobalContextType {
  mobile: string;
  setMobile: React.Dispatch<React.SetStateAction<string>>;
  name: any;
  setName: React.Dispatch<React.SetStateAction<any>>;
  adress: any;
  setAdress: React.Dispatch<React.SetStateAction<any>>;
  popupNames: string;
  setPopupNames: React.Dispatch<React.SetStateAction<string>>;
  teacher: any;
  setTeacher: React.Dispatch<React.SetStateAction<any>>;
  foodStyle: string;
  setFoodStyle: React.Dispatch<React.SetStateAction<string>>;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  monthlyPlan: string;
  setMonthlyPlan: React.Dispatch<React.SetStateAction<string>>;
  kidsPlanSelected: string;
  setKidsPlanSelected: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCategoryName: string | null;
  setSelectedCategoryName: React.Dispatch<React.SetStateAction<string | null>>;
  categories: Array<Category>;
  setCategories: React.Dispatch<React.SetStateAction<Array<Category>>>;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  // ✅ Add these two lines
  selectedMeal: Meal | null;
  setSelectedMeal: React.Dispatch<React.SetStateAction<Meal | null>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [teacher, setTeacher] = useState("");
  const [popupNames, setPopupNames] = useState("");
  const [foodStyle, setFoodStyle] = useState("south");
  const [activeStep, setActiveStep] = useState(1);
  const [monthlyPlan, setMonthlyPlan] = useState("regular");
  const [kidsPlanSelected, setKidsPlanSelected] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const result = await response.json();

      if (result.success && result.data) {
        const formattedCategories = result.data.map((cat: any) => ({
          label: cat.name,
          value: cat.id,
          name: cat.name,
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addCategory = async (name: string) => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Failed to add category");
      }

      await fetchCategories();
      
      return result;
    } catch (error: any) {
      console.error("Error adding category:", error);
      throw error;
    }
  };

  const values: GlobalContextType = {
    mobile,
    setMobile,
    name,
    setName,
    adress,
    setAdress,
    popupNames,
    setPopupNames,
    teacher,
    setTeacher,
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
    fetchCategories,
    addCategory,
    selectedMeal,
    setSelectedMeal,
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
