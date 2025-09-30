import React from "react";
import { Text, View } from "react-native";

type RevenueTypes = {
    total : string
    reg_total : string
    add_total : string
}

const TotalRevenue = ({total, reg_total, add_total} : RevenueTypes) => {
  return (
    <View className="bg-white rounded-2xl p-5 gap-3">
      <Text className="text-[16px] font-semibold">Total Revenue</Text>
      <Text className="text-primary text-[26px]">{total} AED</Text>
      <View className="bg-base_color/10 h-[1px] w-full" />
      <View className="flex-row justify-between">
        <Text>Regular Plan</Text>
        <Text>{reg_total} AED</Text>
      </View>
      <View className="flex-row justify-between">
        <Text>Add-on item&apos;s</Text>
        <Text>{add_total} AED</Text>
      </View>
    </View>
  );
};

export default TotalRevenue;
