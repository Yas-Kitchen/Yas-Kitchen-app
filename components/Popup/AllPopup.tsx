import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import AddMeal from "./AddMeal";
import ChangeFoodPlan from "./ChangeFoodPlan";
import EditAdress from "./EditAdress";
import EditName from "./EditName";
import SwitchMeals from "./Switchmeals";

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
      <AddMeal
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
    </>
  );
};

export default AllPopup;
