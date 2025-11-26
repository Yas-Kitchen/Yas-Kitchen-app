import React from "react";
import { Text, View } from "react-native";
import QuickSettings from "../Home/QuickSettings";
import PlanPercentage from "./PlanPercentage";
import TopAddons from "./TopAddons";
import TotalRevenue from "./TotalRevenue";
import { DashboardData } from "@/types/dashboard.types";

interface ThisMonthProps {
  setStart: (date: string) => void;
  setEnd: (date: string) => void;
  data: DashboardData | null;
}

const ThisMonth = ({ setStart, setEnd, data }: ThisMonthProps) => {
  const formatDateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getMonthRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  };

  const [monthRange, setMonthRange] = React.useState(() => {
    const range = getMonthRange(new Date());
    setStart(formatDateToYYYYMMDD(range.start));
    setEnd(formatDateToYYYYMMDD(range.end));
    return range;
  });

  const { start: monthStart, end: monthEnd } = monthRange;

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const updateMonth = (newDate: Date) => {
    const range = getMonthRange(newDate);
    setMonthRange(range);
    setStart(formatDateToYYYYMMDD(range.start));
    setEnd(formatDateToYYYYMMDD(range.end));
  };

  const handlePrevMonth = () => {
    const newDate = new Date(monthStart);
    newDate.setMonth(newDate.getMonth() - 1);
    updateMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(monthStart);
    newDate.setMonth(newDate.getMonth() + 1);
    updateMonth(newDate);
  };

  return (
    <View className="gap-5">
      <View className="flex-row mx-auto items-center">
        <View className="flex-row items-center bg-gray-200 rounded-lg">
          <Text onPress={handlePrevMonth} className="px-3 py-1 text-lg">
            {"<"}
          </Text>
          <Text className="px-2 font-medium min-w-[120px] text-center">
            {formatMonth(monthStart)}
          </Text>
          <Text onPress={handleNextMonth} className="px-3 py-1 text-lg">
            {">"}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-evenly">
        <QuickSettings
          header="Active Users"
          icon="users"
          number={data?.month?.active_users || 0}
        />
        <QuickSettings
          header="Special Orders"
          icon="list"
          number={data?.month?.special_orders_count || 0}
        />
      </View>
      <TotalRevenue
        total={data?.month?.revenue || "0"}
        reg_total={data?.month?.regular_revenue || "0"}
        add_total={data?.month?.addon_revenue || "0"}
      />
      <PlanPercentage
        northPercentage={
          data?.month?.plan_distribution
            ? Math.round(
                (data.month.plan_distribution.Regular.total_users /
                  (data.month.active_users || 1)) *
                  100
              )
            : 0
        }
        southPercentage={
          data?.month?.plan_distribution
            ? Math.round(
                (data.month.plan_distribution.Diet.total_users /
                  (data.month.active_users || 1)) *
                  100
              )
            : 0
        }
        diet={
          data?.month?.plan_distribution
            ? Math.round(
                (data.month.plan_distribution.Kids.total_users /
                  (data.month.active_users || 1)) *
                  100
              )
            : 0
        }
      />
      <View className="bg-white rounded-2xl p-5 gap-3">
        <Text className="text-[16px]">Top Add-on items</Text>
        {data?.month?.popular_items && data.month.popular_items.length > 0 ? (
          data.month.popular_items.map((item: any, index: number) => (
            <TopAddons
              key={index}
              productName={item.product_name}
              orders={item.orders}
            />
          ))
        ) : (
          <Text className="text-gray-500 text-center">No popular items</Text>
        )}
      </View>
    </View>
  );
};

export default ThisMonth;
