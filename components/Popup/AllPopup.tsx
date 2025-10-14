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
import EditMeal from "./EditMeal";
import AddAddon from "./AddAddons";

const AllPopup = () => {
  const { popupNames, setPopupNames } = useGlobalContext();
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
        open={popupNames === "Delivery Adress"}
        onClose={() => setPopupNames("")}
      />
      <AddMeal
        open={popupNames === "addmeal"}
        onClose={() => setPopupNames("")}
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
      <AddAddon
        open={popupNames === "addaddon"}
        onClose={() => setPopupNames("")}
      />
    </>
  );
};

export default AllPopup;
