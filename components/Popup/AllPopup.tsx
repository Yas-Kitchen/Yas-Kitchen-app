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

const AllPopup = () => {
  const { popupNames, setPopupNames, selectedCategory, mealListRef } =
    useGlobalContext();
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
        categoryId="8143039e-b302-48a9-958e-0f68560e4bb6"
        cuisineId={selectedCategory}
        onSuccess={() => mealListRef.current?.refresh()}
      />
      <AddSpecials
        open={popupNames === "addspecial"}
        onClose={() => setPopupNames("")}
      />
      <AddCategoryModal
        open={popupNames === "addcategory"}
        onClose={() => setPopupNames("")}
      />
      <AddUser
        open={popupNames === "adduser"}
        onClose={() => setPopupNames("")}
      />
      <EditMeal
        open={popupNames === "editmeal"}
        onClose={() => setPopupNames("")}
      />

      <EditUser
        open={popupNames === "edituser"}
        onClose={() => setPopupNames("")}
      />
      <AddAddon
        open={popupNames === "addaddon"}
        onClose={() => setPopupNames("")}
      />
      <EditAddon
        open={popupNames === "editaddon"}
        onClose={() => setPopupNames("")}
      />
    </>
  );
};

export default AllPopup;
