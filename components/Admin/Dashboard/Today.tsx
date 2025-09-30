import React from "react";
import { Text, View } from "react-native";
import QuickSettings from "../QuickSettings";
import PlanPercentage from "./PlanPercentage";
import TopAddons from "./TopAddons";
import TotalRevenue from "./TotalRevenue";

const Today = () => {
  return (
    <View className="gap-5">
      <View className="flex-row justify-evenly">
        <QuickSettings header="Active Users" icon="users" number={128} />
        <QuickSettings header="Special Orders" icon="list" number={45} />
      </View>
      <TotalRevenue total="15,540" reg_total="13,328" add_total="2,352" />
      <PlanPercentage northPercentage={30} southPercentage={70} kidsMeal={18} />
      <View className="bg-white rounded-2xl p-5 gap-3">
        <Text className="text-[16px]">Top Add-on items</Text>
        <TopAddons productName="Chicken Fry" orders={18} />
        <TopAddons productName="Egg curry" orders={5} />
        <TopAddons productName="Pappadam" orders={8} />
        <TopAddons productName="Curd" orders={10} />
      </View>
    </View>
  );
};

export default Today;
