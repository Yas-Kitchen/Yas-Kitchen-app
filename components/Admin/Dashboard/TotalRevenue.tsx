import React from "react";
import { Text, View } from "react-native";

type RevenueTypes = {
  total: string;
  reg_total: string;
  add_total: string;
  label?: string;
};

const TotalRevenue = ({
  total,
  reg_total,
  add_total,
  label = "Regular Plan",
}: RevenueTypes) => {
  return (
    <View className="font-poppins bg-white rounded-2xl p-5 gap-3">
      <Text className="text-[16px] font-poppins-semibold">Total Revenue</Text>
      <Text className="font-poppins text-primary text-[26px]">{total} AED</Text>
      <View className="font-poppins bg-base_color/10 h-[1px] w-full" />
      <View className="font-poppins flex-row justify-between">
        <Text>{label}</Text>
        <Text>{reg_total} AED</Text>
      </View>
      <View className="font-poppins flex-row justify-between">
        <Text>Add-on item&apos;s</Text>
        <Text>{add_total} AED</Text>
      </View>
    </View>
  );
};

export default TotalRevenue;
