import React from "react";
import { Text, View } from "react-native";

const MostOrders = () => {
  return (
    <View className="bg-white rounded-2xl font-semibold mx-5 p-5">
      <Text className="text-faded_black text-[16px]">Popular Orders Today</Text>
      <View className="gap-3 flex-col mt-3">
        <View className="flex-row justify-between">
          <Text className="text-base_color text-[14px]">Pappadam</Text>
          <Text className="text-primary text-[14px]">18 orders</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base_color text-[14px]">Kondattam</Text>
          <Text className="text-primary text-[14px]">50 orders</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base_color text-[14px]">Curd</Text>
          <Text className="text-primary text-[14px]">28 orders</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base_color text-[14px]">Salad</Text>
          <Text className="text-primary text-[14px]">58 orders</Text>
        </View>
      </View>
    </View>
  );
};

export default MostOrders;
