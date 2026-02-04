import { useMockMenu } from "@/hooks/use-MockMenu";
import { Feather } from "@expo/vector-icons";
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

const WeeklyPlan = () => {
  const menuData: { southindian: WeeklyMenu } = useMockMenu();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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
  const numberOfDaysToShow = 3;
  const upcomingDays = [];

  for (let i = 1; i <= numberOfDaysToShow; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    const dayName = daysOfWeek[nextDay.getDay()];
    const date = nextDay.getDate();
    const month = months[nextDay.getMonth()];

    const dayKey = dayName.toLowerCase();
    const lunch = menuData.southindian[dayKey]?.lunch?.name || "Lunch not available";
    const dinner =
      menuData.southindian[dayKey]?.dinner?.name || "Dinner not available";

    upcomingDays.push({ dayName, date, month, lunch, dinner });
  }

  return (
    <View className="font-poppins bg-white p-5 rounded-2xl">
      <View className="font-poppins flex-row gap-2 items-center">
        <Feather name="calendar" size={19} color={"#FF7629"} />
        <Text className="text-[16px] font-poppins-semibold">Weekly Meal Plan</Text>
      </View>
      <View className="font-poppins mt-5 gap-3">
        {upcomingDays.map((day, index) => (
          <View
            key={index}
            className="font-poppins p-5 flex-col justify-between border border-base_color/20 rounded-xl"
          >
            <View className="font-poppins flex-row justify-between">
              <Text className="font-poppins-semibold text-[14px]">{day.dayName}</Text>
              <Text className="text-base_color font-poppins-medium text-[12px]">
                {day.date} {day.month}
              </Text>
            </View>
            <View className="font-poppins mt-1 gap-1">
              <Text className="font-poppins text-[12px]">Lunch: {day.lunch}</Text>
              <Text className="font-poppins text-[12px]">Dinner: {day.dinner}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WeeklyPlan;
