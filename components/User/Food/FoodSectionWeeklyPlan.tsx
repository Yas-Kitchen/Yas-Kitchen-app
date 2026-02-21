import { useDietPlanAPI } from "@/hooks/useDietPlanAPI";
import { useGlobalContext } from "@/context/GlobalContext";
import { useMockMenu } from "@/hooks/use-MockMenu";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

type Meal = {
  id: string;
  name: string;
  description: string;
  availability: string;
  rating: number;
  image: string;
};

type DayMenu = {
  lunch: Meal;
  dinner: Meal;
};

type WeeklyMenu = {
  [day: string]: DayMenu;
};

const FoodSectionWeeklyPlan = () => {
  const menuData: { southindian: WeeklyMenu } = useMockMenu();
  const { userData } = useGlobalContext();
  const has_diet_plan = userData?.has_diet_plan;
  const publicUserId = userData?.id;
  const {
    getUserDietPlan,
    userDietPlan,
    loading: dietLoading,
  } = useDietPlanAPI();

  useEffect(() => {
    if (has_diet_plan && publicUserId) {
      getUserDietPlan(publicUserId);
    }
  }, [has_diet_plan, publicUserId]);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const today = new Date();
  const currentDayName =
    daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1]; // Sunday = 6
  const upcomingDays = [];

  const monday = new Date(today);
  const dayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay(); // Sunday adjustment
  monday.setDate(today.getDate() + dayOffset);

  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const dayName = daysOfWeek[i];
    const date = day.getDate();
    const month = months[day.getMonth()];

    const dayKey = dayName.toLowerCase();
    let lunch = "Lunch not available";
    let dinner = "Dinner not available";

    if (dietLoading || !userData) {
      lunch = "Loading...";
      dinner = "Loading...";
    } else if (has_diet_plan && userDietPlan && userDietPlan.weekly_menu) {
      if (userDietPlan.weekly_menu[dayKey]) {
        lunch =
          userDietPlan.weekly_menu[dayKey]?.lunch?.name ||
          "Lunch not available";
        dinner =
          userDietPlan.weekly_menu[dayKey]?.dinner?.name ||
          "Dinner not available";
      }
    } else {
      lunch =
        menuData.southindian[dayKey]?.lunch?.name || "Lunch not available";
      dinner =
        menuData.southindian[dayKey]?.dinner?.name || "Dinner not available";
    }
    upcomingDays.push({ dayName, date, month, lunch, dinner });
  }
  return (
    <View className="font-poppins mt-3 gap-3">
      {upcomingDays.map((day, index) => (
        <View
          key={index}
          className={`p-5  bg-white/40 flex-col justify-between border rounded-xl ${
            day.dayName === currentDayName
              ? "border-primary border-2 text-primary"
              : "border-base_color/20"
          }`}
        >
          <View className="font-poppins flex-row justify-between">
            <Text
              className={`font-poppins-semibold text-[14px] ${
                day.dayName === currentDayName
                  ? " text-primary"
                  : "text-faded_black"
              }`}
            >
              {day.dayName}
            </Text>
            <Text className="font-poppins-medium text-[12px] text-base_color">
              {day.date} {day.month}
            </Text>
          </View>
          <View className="font-poppins mt-1 gap-1">
            <Text className="font-poppins text-[12px]">Lunch: {day.lunch}</Text>
            <Text className="font-poppins text-[12px]">
              Dinner: {day.dinner}
            </Text>
          </View>
        </View>
      ))}
      <View className="font-poppins h-40" />
    </View>
  );
};

export default FoodSectionWeeklyPlan;
