import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import AddMeal from "./AddMeal";
import AddSpecials from "./AddSpecials";
import BookMeal from "./BookMeal";
import ChangeFoodPlan from "./ChangeFoodPlan";
import EditAdress from "./EditAdress";
import EditName from "./EditName";
import SwitchMeals from "./Switchmeals";
import AddCategoryModal from "./AddCategoryModal";
import AddUser from "./AddUser";
import AddAddon from "./AddAddons";
import EditUser from "./EditUser";
import EditAddon from "./EditAddon";
import EditMeal from "./EditMeal";
import AddDietMeals from "./AddDietMeals";

const AllPopup = () => {
  const {
    popupNames,
    setPopupNames,
    selectedCategory,
    mealListRef,
    setMealRefreshKey,
    setSpecialRefreshKey,
    setAddonRefreshKey,
  } = useGlobalContext();
  return (
    <>
      <ChangeFoodPlan
        open={popupNames === "Monthly Food Plan"}
        onClose={() => setPopupNames("")}
      />
      <SwitchMeals
        open={popupNames === "Switch Meals"}
        onClose={() => setPopupNames("")}
      />
      <BookMeal
        open={popupNames === "Add Meal"}
        onClose={() => setPopupNames("")}
      />
      <EditName
        open={popupNames === "Name"}
        onClose={() => setPopupNames("")}
      />
      <EditAdress
        open={popupNames === "Delivery Address"}
        onClose={() => setPopupNames("")}
      />
      <AddMeal
        open={popupNames === "addmeal"}
        onClose={() => setPopupNames("")}
        // Using the strictly seeded ID for "Regular" category in the database
        categoryId="4b6ef9b7-6474-402b-8a7b-819d39e0d7a3"
        cuisineId={selectedCategory}
        onSuccess={() => mealListRef.current?.refresh()}
      />
      <AddSpecials
        open={popupNames === "addspecial"}
        onClose={() => setPopupNames("")}
        onSuccess={() => setSpecialRefreshKey(Date.now())}
      />
      <AddCategoryModal
        open={popupNames === "addcategory"}
        onClose={() => setPopupNames("")}
      />
      <AddUser
        open={popupNames === "adduser" || popupNames === "adduser_diet"}
        onClose={() => setPopupNames("")}
        isDietUser={popupNames === "adduser_diet"}
      />
      <EditMeal
        open={popupNames === "editmeal"}
        onClose={() => setPopupNames("")}
        onSuccess={() => setMealRefreshKey(Date.now())}
      />

      <EditUser
        open={popupNames === "edituser"}
        onClose={() => setPopupNames("")}
      />
      <AddAddon
        open={popupNames === "addaddon"}
        onClose={() => setPopupNames("")}
        onSuccess={() => setAddonRefreshKey(Date.now())}
      />
      <EditAddon
        open={popupNames === "editaddon"}
        onClose={() => setPopupNames("")}
      />
      <AddDietMeals
        open={popupNames === "createdietplan"}
        onClose={() => setPopupNames("")}
        // Using the strictly seeded ID for "Diet" category in the database
        categoryId="9d29b9df-0b56-4407-95a0-ac68ecf0b751"
        cuisineId={selectedCategory}
        onSuccess={() => mealListRef.current?.refresh()}
      />
    </>
  );
};

export default AllPopup;
