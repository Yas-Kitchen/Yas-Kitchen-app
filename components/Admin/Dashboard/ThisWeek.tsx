import React from "react";
import { Text, View } from "react-native";
import QuickSettings from "../QuickSettings";
import PlanPercentage from "./PlanPercentage";
import TopAddons from "./TopAddons";
import TotalRevenue from "./TotalRevenue";

const ThisWeek = () => {
  return (
    <View className="gap-5">
      <View className="flex-row justify-evenly">
        <QuickSettings header="Active Users" icon="users" number={128} />
        <QuickSettings header="Special Orders" icon="list" number={45} />
      </View>
      <TotalRevenue total="96,540" reg_total="82,328" add_total="14,352" />
      <PlanPercentage northPercentage={30} southPercentage={70} kidsMeal={18} />
      <View className="bg-white rounded-2xl p-5 gap-3">
        <Text className="text-[16px]">Top Add-on items</Text>
        <TopAddons productName="Chicken Fry" orders={118} />
        <TopAddons productName="Egg curry" orders={87} />
        <TopAddons productName="Pappadam" orders={64} />
        <TopAddons productName="Curd" orders={42} />
      </View>
    </View>
  );
};

export default ThisWeek;
