import { useMockMenu } from "@/hooks/use-MockMenu";
import React from "react";
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
    const lunch = menuData.southindian[dayKey]?.lunch?.name || "Lunch not available";
    const dinner =
      menuData.southindian[dayKey]?.dinner?.name || "Dinner not available";
      upcomingDays.push({ dayName, date, month, lunch, dinner });
    }
    return (
      <View className="mt-3 gap-3">
        {upcomingDays.map((day, index) => (
          <View
            key={index}
            className={`p-5  bg-white/40 flex-col justify-between border rounded-xl ${
              day.dayName === currentDayName
                ? "border-primary border-2 text-primary"
                : "border-base_color/20"
            }`}
          >
            <View className="flex-row justify-between">
              <Text
                className={`font-semibold text-[14px] ${
                  day.dayName === currentDayName
                    ? " text-primary"
                    : "text-faded_black"
                }`}
              >
                {day.dayName}
              </Text>
              <Text className="font-medium text-[12px] text-base_color">
                {day.date} {day.month}
              </Text>
            </View>
            <View className="mt-1 gap-1">
              <Text className="text-[12px]">Lunch: {day.lunch}</Text>
              <Text className="text-[12px]">Dinner: {day.dinner}</Text>
            </View>
          </View>
        ))}
        <View className="h-40"/>
      </View>
    );
};

export default FoodSectionWeeklyPlan;
