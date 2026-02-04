import React, { useState } from "react";
import { Text, View } from "react-native";
import QuickSettings from "../Home/QuickSettings";
import PlanPercentage from "./PlanPercentage";
import TopAddons from "./TopAddons";
import TotalRevenue from "./TotalRevenue";
import { DashboardData } from "@/types/dashboard.types";

interface ThisWeekProps {
  setStart: (date: string) => void;
  setEnd: (date: string) => void;
  data: DashboardData | null;
}

const ThisWeek = ({ setStart, setEnd, data }: ThisWeekProps) => {
  const formatDateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Sunday
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Saturday
    return { start, end };
  };

  const [weekRange, setWeekRange] = React.useState(() => {
    const range = getWeekRange(new Date());
    // Initialize parent state
    setStart(formatDateToYYYYMMDD(range.start));
    setEnd(formatDateToYYYYMMDD(range.end));
    return range;
  });

  const { start: weekStart, end: weekEnd } = weekRange;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const updateWeek = (newStart: Date, newEnd: Date) => {
    setWeekRange({ start: newStart, end: newEnd });
    setStart(formatDateToYYYYMMDD(newStart));
    setEnd(formatDateToYYYYMMDD(newEnd));
  };

  const handlePrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    const newEnd = new Date(newStart);
    newEnd.setDate(newStart.getDate() + 6);
    updateWeek(newStart, newEnd);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    const newEnd = new Date(newStart);
    newEnd.setDate(newStart.getDate() + 6);
    updateWeek(newStart, newEnd);
  };

  return (
    <View className="font-poppins gap-5">
      <View className="font-poppins flex-row mx-auto items-center">
        <View className="font-poppins flex-row items-center bg-gray-200 rounded-lg">
          <Text onPress={handlePrevWeek} className="font-poppins px-3 py-1 text-lg">
            {"<"}
          </Text>
          <Text className="px-2 font-poppins-medium">
            {formatDate(weekStart)} - {formatDate(weekEnd)}
          </Text>
          <Text onPress={handleNextWeek} className="font-poppins px-3 py-1 text-lg">
            {">"}
          </Text>
        </View>
      </View>
      <View className="font-poppins flex-row justify-evenly">
        <QuickSettings
          header="Active Users"
          icon="users"
          number={data?.week?.active_users || 0}
        />
        <QuickSettings
          header="Special Orders"
          icon="list"
          number={data?.week?.special_orders_count || 0}
        />
      </View>
      <TotalRevenue
        total={data?.week?.revenue || "0"}
        reg_total={data?.week?.regular_revenue || "0"}
        add_total={data?.week?.addon_revenue || "0"}
        label="Special Orders"
      />
      <View className="font-poppins bg-white rounded-2xl p-5 gap-3">
        <Text className="font-poppins text-[16px]">Top Add-on items</Text>
        {data?.week?.popular_items && data.week.popular_items.length > 0 ? (
          data.week.popular_items.map((item: any, index: number) => (
            <TopAddons
              key={index}
              productName={item.product_name}
              orders={item.orders}
            />
          ))
        ) : (
          <Text className="font-poppins text-gray-500 text-center">No popular items</Text>
        )}
      </View>
    </View>
  );
};

export default ThisWeek;
