import React from "react";
import { Text, View } from "react-native";
import QuickSettings from "../Home/QuickSettings";
import PlanPercentage from "./PlanPercentage";
import TopAddons from "./TopAddons";
import TotalRevenue from "./TotalRevenue";

const ThisMonth = () => {
  return (
    <View className="gap-5">
      <View className="flex-row justify-evenly">
        <QuickSettings header="Active Users" icon="users" number={156} />
        <QuickSettings header="Special Orders" icon="list" number={1245} />
      </View>
      <TotalRevenue total="382,850" reg_total="322,328" add_total="57,352" />
      <PlanPercentage northPercentage={40} southPercentage={60} kidsMeal={13} />
      <View className="bg-white rounded-2xl p-5 gap-3">
        <Text className="text-[16px]">Top Add-on items</Text>
        <TopAddons productName="Chicken Fry" orders={487} />
        <TopAddons productName="Egg curry" orders={356} />
        <TopAddons productName="Pappadam" orders={278} />
        <TopAddons productName="Curd" orders={196} />
      </View>
    </View>
  );
};

export default ThisMonth;
